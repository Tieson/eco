/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* jshint devel: true */
'use strict';

function VhdImport() {

	var creator;
	var graph;
	/**
	 * Tato metoda vyparsuje schéma z vhdl souboru.
	 * @param {type} import_text
	 * @returns {undefined}
	 */
	this.loadImportedSchema = function (import_text, schema) {
		//graph.clear(); // vyčištění plochy, asi yb se to mělo zeptat pokud tak už něco máš, případně to otepřít v další záložce

		graph = schema.graph;
		graph.clear();

		var schemaInfo = schema.schemaInfo;

		creator = schema.creator;
		var rxArchBlock = /architecture\s*(\w+)\s+of\s+(\w+)\s+is([\s\S]*)begin([\s\S]*)end\s+architecture/im,
				portTmp = rxArchBlock.exec(import_text),
				archName = portTmp[1],
				entityName = portTmp[2],
				signals = portTmp[3],
				portmapts = portTmp[4];
		var startIndex = 0,
				im_inout = loadIO(import_text),
				im_signals = loadSignals(signals),
				im_hradla = loadGates(portmapts);
		importSchema(im_inout, im_signals, im_hradla);
		//setSchemaInfo(entityName, archName);

		schemaInfo.name = entityName;
		schemaInfo.arch = archName;
		schemaInfo.title = "";
		schemaInfo.state = schemaState.NEW;
		//return {name: entityName, arch: archName, title: '', creator: creator, graph: graph};
		return schema;

		function loadIO(import_text) {

			var rxPortBlock = /port\s*\(\s*([^)]*)\s*\)/im,
					portTmp = rxPortBlock.exec(import_text),
					port, rxPorts = /\s*(\w+\d*)\s*:\s*(in|out)\s+(std_logic);?\s*(--\[(\d+);(\d+)\]\s*\n)?/ig,
					result = [];
			while ((port = rxPorts.exec(portTmp[1])) !== null) {
				var type, name, position, number, str;
				name = port[1];
				type = port[2];
				if (port[5] != 'undefined' && port[6] != 'undefined') {
					position = {x: port[5], y: port[6]};
				} else
					position = 'undefined';
				number = /\d+/i.exec(name)[0];
				str = /([^\d\s]+)\d*/i.exec(name)[1];
				if (type.toLowerCase() == 'in') {
					if (str.toLowerCase() == 'clk') {
						result.push({type: types.CLK, un: name, position: position, number: parseInt(number)});
					} else if (str.toLowerCase() == 'x') {
						result.push({type: types.IN, un: name, position: position, number: parseInt(number)});
					}
				} else if (type.toLowerCase() == 'out') {
					result.push({type: types.OUT, un: name, position: position, number: parseInt(number)});
				}
			}
			return result;
		}

		function loadSignals(import_text) {
			var rxSig = /signal\s+(([^_\s\d]+)_((\w+)_([^_\s\w]+)))/ig,
					sig, result = [];
			while ((sig = rxSig.exec(import_text)) != null) {
				result[sig[1]] = {port: sig[2], un: sig[3], number: sig[5]};
			}
			return result;
		}

		function parseGateUN(un) {
			var spltrLast = un.lastIndexOf('_');
			return {
				name: un.substring(0, spltrLast),
				number: un.substr(spltrLast + 1)
			};
		}

		function loadGates(import_text) {
			var rxGates = /\s*(\w+)\s*:\s*entity\s+work\.(\w+)\s*(--\[(\d+);(\d+)\])?\s*(\r\n)?\s*port\s+map\s*\(([^)]*)\)/img,
					gatesTmp,
					result = [],
					ports, obj, position = 'undefined';
			while ((gatesTmp = rxGates.exec(import_text)) != null) {
				obj = parseGateUN(gatesTmp[1]);
				ports = parsePortmap(gatesTmp[7]);
				if (gatesTmp[4] != 'undefined' && gatesTmp[5] != 'undefined') {
					position = {x: gatesTmp[4], y: gatesTmp[5]};
				}
				result.push({uniqueName: gatesTmp[1], name: obj.name, number: obj.number, ports: ports, position: position});
			}
			return result;
		}

		function parsePortmap(ports) {
			ports = ports.split(',');
			var result = [];
			var port, elemUN, portMap, tPort, temp;
			for (var i = 0; i < ports.length; i++) {
				portMap = /(\w+)\s*=>\s*(\w+)/i.exec(ports[i].trim());
				if (portMap != null) {
					port = portMap[1];
					temp = /^([^_]*)_(\w+)/i.exec(portMap[2]);
					if (temp != null) {
						elemUN = temp[2];
						tPort = temp[1];
					} else {
						elemUN = portMap[2]; // pokud předchozí podmínka neprošla, je to považováno za vstup/výstup
						tPort = 'undefined';
					}
					result.push({port: port, elem: elemUN, signal: portMap[2], tPort: tPort});
				}
			}
			return result;
		}
	};

	function importSchema(io, sigs, gates) {
		var in_y = 60, out_y = 60,
				temp,
				io_temp = [],
				gates_temp = [];
		/* Načte a naplní vstupy, výstputy a CLK */
		for (var i = 0; i < io.length; i++) {
			temp = io[i];
			var x;
			if (isNaN(temp.number)) {
				console.log('Číslo hodin je chybné, nebudou přidány');
			} else {
				switch (temp.type) {
					case types.IN:
						if (temp.position != 'undefined') {
							x = creator.createEntity(types.IN, temp.position.x, temp.position.y);
						} else {
							x = creator.createEntity(types.IN, 60, in_y);
							in_y += 60;
						}
						creator.resumeInput(x, temp.number);
						io_temp[temp.un.toLowerCase()] = x;
						break;
					case types.OUT:
						if (temp.position != 'undefined') {
							x = creator.createEntity(types.OUT, temp.position.x, temp.position.y);
						} else {
							x = creator.createEntity(types.OUT, 800, out_y);
							out_y += 60;
						}
						creator.resumeOutput(x, temp.number);
						io_temp[temp.un.toLowerCase()] = x;
						break;
					case types.CLK:
						if (temp.position != 'undefined') {
							x = creator.createEntity(types.CLK, temp.position.x, temp.position.y);
						} else {
							x = creator.createEntity(types.CLK, 60, in_y);
							in_y += 60;
						}
						creator.resumeClock(x, temp.number);
						io_temp[temp.un.toLowerCase()] = x;
						break;
				}
			}
		}
		/* načte a vytvoří hradla/entity */
		for (var i = 0; i < gates.length; i++) {
			var gate = gates[i],
					x;
			if (gate.position != 'undefined') {
				x = creator.createEntity(gate.name, gate.position.x, gate.position.y);
			} else {
				x = creator.createEntity(gate.name, 440, 200);
			}
			creator.resumeGate(x, gate.name, gate.name, gate.number);
			if (gates_temp[gate.uniqueName] != undefined) {
				console.log('Chyba! Duplicitní ID hradla (' + gate.uniqueName + ')! Toto hradlo bylo zahozeno.');
			} else {
				gates_temp[gate.uniqueName] = x;
			}
		}
		/* z hradel a jejich portmap vyvoří vodiče/links */
		for (var i = 0; i < gates.length; i++) {
			var gate = gates[i];
			for (var j = 0; j < gate.ports.length; j++) {
				var p = gate.ports[j];
				var x_other = io_temp[p.elem.toLowerCase()],
						x_this = gates_temp[gate.uniqueName];
				if (x_this == undefined) {
					console.log('ERROR: Toto hradlo není definováno!');
					continue;
				}
				if (x_other != undefined) {
					var cust = x_other.attr('custom');
					if (cust.type == types.IN) {
						createLink({id: x_other.id, port: 'q'}, {id: x_this.id, port: p.port});
					} else if (cust.type == types.OUT) {
						createLink({id: x_this.id, port: p.port}, {id: x_other.id, port: 'a'});
					}
				} else if (sigs[p.signal] != 'undefined') {
					x_other = gates_temp[p.elem];
					if (x_other != undefined) {
						if (p.elem != gate.uniqueName) {
							createLink({id: x_other.id, port: p.tPort}, {id: x_this.id, port: p.port});
						} else {
							if (p.port != p.tPort) {
								createLink({id: x_this.id, port: p.tPort}, {id: x_this.id, port: p.port});
							}
						}
					}
				}
			}
		}

		/**
		 * Vytvoří vodič
		 * @param {id, port} source
		 * @param {id, port} target
		 * @returns {undefined}
		 */
		function createLink(source, target) {
			var ln = "new joint.shapes.mylib.Vodic({ source: { id: '" + source.id + "', port: '" + source.port + "' }, target: { id: '" + target.id + "', port: '" + target.port + "' }});";
			var lm = eval(ln);
			graph.addCell(lm);
		}

		function checkSignalExists(sigs, sUn, sPort) {
			for (var i = 0; i < sigs.length; i++) {
				if (sigs[i].uniqueName == sUn && sigs[i].port == sPort) {
					return true;
				}
			}
			return false;
		}
	}
}


