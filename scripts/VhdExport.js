
/* jshint devel: true */
'use strict';

function vhdExport() {

	/**
	 * Metoda generující obsah vhdl souboru (pro export) z vytvořeného schématu.
	 * @returns {obsah|String}
	 */
	this.exportSchema = function (schema, graph) {
		var elements = getAllEntities(graph),
				inputs = getInputs(graph),
				outputs = getOutputs(graph);

		var c_name_en = schema.name;
		var c_name_arch = schema.arch;
// print jednotlivých částí jako VHDL
		var hrd = gatesToVHDL(graph, elements);
		var sig = getSignals(graph, elements);
		var ios = portsToVHDL(inputs, outputs); //back_ios(io);
		//var positions = getAllEntities().join(";");
		// struktura vystupniho souboru - celkové spojení
		var obsah = "library IEEE;\r\nuse IEEE.std_logic_1164.all;\r\n\r\nentity " + c_name_en + " is\r\n" +
				"\tport (\r\n" +
				ios +
				"\r\n\t);\r\nend entity " + c_name_en + ";\r\n\r\n" +
				"architecture " + c_name_arch + " of " + c_name_en + " is\r\n" +
				sig +
				"\r\n" +
				"begin" +
				hrd +
				"\r\nend architecture " + c_name_arch + ";\r\n" +
				"\r\n";
		return obsah;
	};



	function getElemByType(graph, type) {
		var elems = graph.getElements(),
				result = [];
		for (var i = 0; i < elems.length; i++) {
			var e = elems[i],
					custom = e.attr('custom');
			if (custom.type == type) {
				result.push(e);
			}
		}
		return result;
	}

	function getAllEntities(graph) {
		return graph.getElements();
	}

	function getInputs(graph) {
		return getElemByType(graph, types.IN);
	}
	function getOutputs(graph) {
		return getElemByType(graph, types.OUT);
	}

	/**
	 * Vypíše jako VHDL signály používané uvnitř architektury entity
	 * Vnitřní signály jsou (jako porty) std_logic
	 *
	 * @param {type} elements
	 * @returns {String}
	 */
	function getSignals(graph, elements) {
		var sig, sigs = [], tId, tCell, sigName, custom, duplicitCounter = new Counter();

		for (var i = 0; i < elements.length; i++) {
			custom = elements[i].attr('custom');
			if (custom.type == types.GATE) {

				var cLinks = graph.getConnectedLinks(elements[i], {outbound: true});
				for (var j = 0; j < cLinks.length; j++) {
					sig = cLinks[j];

					tId = sig.get('target');
					tCell = graph.getCell(tId).attr('custom');
					sigName = sig.get('source').port + '_' + custom.uniqueName;
					if (duplicitCounter.next(sigName) < 1) {
						if (tCell.type == types.GATE) {
							sigs.push("\tsignal " + sig.get('source').port + '_' + custom.uniqueName + " : std_logic;\r\n");
						}
					} else {
						console.log('Duplicit signal added error!!!');
					}
				}
			}
		}
		return sigs.join('');
	}

	function gatesToVHDL(graph, elements) {
		var result = [], ins, pos;

		for (var i = 0; i < elements.length; i++) {
			ins = elements[i].attr('custom');
			pos = elements[i].attributes.position;
			if (ins.type === types.GATE) {
				var portmap = getPortMap(graph, elements[i]);
				result.push("\r\n\t" + ins.name + "_" + ins.number + " : entity work." + ins.name
						+ ' --[' + pos.x + ';' + pos.y + ']'
						+ "\r\n\tport map(" + portmap + ");\r\n");
			}
		}
		return result.join("");
	}

	function portsToVHDL(inputs, outputs) {
		var result = [];
		for (var i = 0, max = inputs.length; i < max; i++) {
			var attr = inputs[i].attributes, custom = inputs[i].attr('custom');
			result.push("\t\t" + custom.uniqueName + " : in std_logic" + (i < max - 1 || outputs.length > 0 ? ';' : '') + ' --[' + attr.position.x + ';' + attr.position.y + ']');
		}
		for (var i = 0, max = outputs.length; i < max; i++) {
			var attr = outputs[i].attributes, custom = outputs[i].attr('custom');
			result.push("\t\t" + custom.uniqueName + " : out std_logic" + (i < max - 1 ? ';' : '') + ' --[' + attr.position.x + ';' + attr.position.y + ']');
		}
		return result.join("\r\n");
	}


	function getPortMap(graph, gate) {
		var sig, portmap = [],
				linksOut, linksIn,
				other, source, target,
				gCustom,
				duplicitCounter = new Counter();

		linksOut = graph.getConnectedLinks(gate, {outbound: true});
		linksIn = graph.getConnectedLinks(gate, {inbound: true});

		for (var j = 0; j < linksIn.length; j++) {
			sig = linksIn[j];
			target = sig.get('target');
			source = sig.get('source');
			other = graph.getCell(source.id).attr('custom');
			switch (other.type) {
				case types.GATE:
					portmap.push(target.port + " => " + source.port + '_' + other.uniqueName);
					break;
				case types.IN:
					portmap.push(target.port + " => " + other.uniqueName);
					break;
				default :
					break;
			}
		}
		// Může mít pouze jeden signál pro každý výstup
		for (var j = 0; j < linksOut.length; j++) {
			sig = linksOut[j];
			gCustom = gate.attr('custom');
			target = sig.get('target');
			source = sig.get('source');
			other = graph.getCell(target.id).attr('custom');
			if (duplicitCounter.next(source.port) < 1) {
				switch (other.type) {
					case types.GATE:
						portmap.push(source.port + " => " + source.port + '_' + gCustom.uniqueName);
						break;
					case types.OUT:
						portmap.push(source.port + " => " + other.uniqueName);
						break;
					default :
						break;
				}
			} else {
				console.log('Duplicit signal and port added error!!!');
			}
		}
		return portmap.join(',');
	}
};