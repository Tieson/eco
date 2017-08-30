/**
 * Created by Tom on 28.08.2017.
 */
/**
 * Created by Tom on 27.04.2017.
 */



function vhdExport() {
    var types = {IN: 'mylib.INPUT', OUT: 'mylib.OUTPUT', GATE: 'mylib.Gate', CLK: 'mylib.CLK'};

    /**
     * Metoda generující obsah vhdl souboru (pro export) z vytvořeného schématu.
     * @returns {obsah|String}
     */
    this.exportSchema = function (c_name_en, c_name_arch, graph) {
        // console.log('exportSchema', graph );
        var elements = getAllEntities(graph),
            inputs = getInputs(graph),
            outputs = getOutputs(graph);

        // print jednotlivých částí jako VHDL
        var ios = portsToVHDL(inputs, outputs); //back_ios(io);
        var sig = getSignals(graph, elements);
        var hrd = gatesToVHDL(graph, elements);
        //var positions = getAllEntities().join(";");

        // struktura vystupniho souboru - celkové spojení
        return "library IEEE;\r\nuse IEEE.std_logic_1164.all;\r\n\r\nentity " + c_name_en + " is\r\n" +
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
    };

    function getElemByType(graph, type) {
        var elems = graph.getElements(),
            result = [];
        for (var i = 0; i < elems.length; i++) {
            // console.log('eeeeee', elems[i], elems[i].get('type'), elems[i].get('exportType'));
            var e = elems[i];
            //var custom = e.attr('custom');
            if (e.get('exportType') === type) {
                result.push(e);
            }
        }
        // console.log('%c getElemByType', 'color: red;', type, result);
        return result;
    }

    function getAllEntities(graph) {
        var elements = graph.getElements();
        // console.log('getAllEntities', elements);
        return elements;
    }

    function getInputs(graph) {
        var inputs = getElemByType(graph, types.IN);
        // console.log('getInputs', inputs);
        return inputs;
    }
    function getOutputs(graph) {
        var outputs = getElemByType(graph, types.OUT);
        // console.log('getOutputs', outputs);
        return outputs;
    }

    /**
     * Vypíše jako VHDL signály používané uvnitř architektury entity
     * Vnitřní signály jsou (jako porty) std_logic
     *
     * @param graph
     * @param elements
     * @returns {string}
     */
    function getSignals(graph, elements) {
        var sig, sigs = [], tId, tCell, targetType, sigName, custom, index, type, duplicitCounter = createMapCounter(0);

        for (var i = 0; i < elements.length; i++) {
            type = elements[i].get('exportType');
            custom = elements[i].attr('custom');
            if (type === types.GATE) {

                var cLinks = graph.getConnectedLinks(elements[i], {outbound: true});
                for (var j = 0; j < cLinks.length; j++) {
                    sig = cLinks[j];

                    tId = sig.get('target');
                    tCell = graph.getCell(tId).attr('custom');
                    targetType = graph.getCell(tId).get('exportType');
                    sigName = sig.get('source').port + '_' + custom.uniqueName;
                    index = duplicitCounter.inc(sigName);
                    // console.log(sigName, index);
                    if (index < 1) {
                        if (targetType == types.GATE) {
                            sigs.push("\tsignal " + sig.get('source').port + '_' + custom.uniqueName + " : std_logic;\r\n");
                        }
                    } else {
                        console.log('Duplicit signal warning!');
                    }
                }
            }
        }
        // console.log(sigs);
        return sigs.join('');
    }

    function gatesToVHDL(graph, elements) {
        var result = [], ins, pos, type;

        for (var i = 0; i < elements.length; i++) {
            ins = elements[i].attr('custom');
            type = elements[i].get('exportType');
            pos = elements[i].attributes.position;
            if (type === types.GATE) {
                var name = ins.name || ins.label || 'gate';
                var portmap = getPortMap(graph, elements[i]);
                result.push("\r\n\t" + name + "_" + ins.number + " : entity work." + ins.type
                    + ' --[' + pos.x + ';' + pos.y + ']'
                    + "\r\n\tport map(" + portmap + ");\r\n");
            }
        }
        return result.join("");
    }

    function portsToVHDL(inputs, outputs) {
        var result = [];
        for (var i = 0, max = inputs.length; i < max; i++) {
            var attr = inputs[i].attributes,
                custom = inputs[i].attr('custom'),
                uniqueName = custom['name']+''+custom['number'];
            result.push("\t\t" + uniqueName
                + " : in std_logic"
                + (i < max - 1 || outputs.length > 0 ? ';' : '')
                + ' --[' + attr.position.x + ';' + attr.position.y + ']');
        }
        for (var j = 0, max_out = outputs.length; j < max_out; j++) {
            var attr_out = outputs[j].attributes,
                custom = outputs[j].attr('custom'),
                uniqueName = custom['name']+''+custom['number'];
            result.push("\t\t" + uniqueName
                + " : out std_logic" + (j < max_out - 1 ? ';' : '')
                + ' --[' + attr_out.position.x + ';'
                + attr_out.position.y + ']');
        }
        return result.join("\r\n");
    }


    function getPortMap(graph, gate) {
        var sig, portmap = [],
            linksOut, linksIn,
            other, source, target,
            gCustom,
            customOther,
            duplicitCounter = createMapCounter();

        linksOut = graph.getConnectedLinks(gate, {outbound: true});
        linksIn = graph.getConnectedLinks(gate, {inbound: true});

        for (var i = 0; i < linksIn.length; i++) {
            sig = linksIn[i];
            target = sig.get('target');
            source = sig.get('source');
            other = graph.getCell(source.id);
            customOther = other.attr('custom');
            switch (other.get('exportType')) {
                case types.GATE:
                    portmap.push(target.port + " => " + source.port + '_' + customOther.uniqueName);
                    break;
                case types.IN:
                    portmap.push(target.port + " => " + customOther.name+customOther.number);
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
            other = graph.getCell(target.id);
            customOther = other.attr('custom');
            // console.log('x ',target, source, other, customOther);
            if (duplicitCounter.inc(source.port) < 1) {
                switch (other.get('exportType')) {
                    case types.GATE:
                        portmap.push(source.port + " => " + source.port + '_' + gCustom.uniqueName);
                        break;
                    case types.OUT:
                        portmap.push(source.port + " => " + customOther.name+customOther.number);
                        break;
                    default :
                        break;
                }
            } else {
                console.log('Duplicit signal and port added error!!!');
            }
        }
        var result = portmap.join(', ');
        // console.log(result);
        return result;
    }
};


eco.Models.VhdlExporter = Backbone.Model.extend({

    initialize: function (opts) {
        this.schema = opts.schema;
    },

    saveVhdlToFile: function (a) {
        var file_name;
        var name = this.schema.get('name');
        var architecture = this.schema.get('architecture');

        if (name == "") {
            file_name = "unknown_schema.vhd";
        } else {
            file_name = name + ".vhd";
        }

        var showSave = function () {
            return true;
        };

        var vhdEx = new vhdExport();
        var blobObject;
        var content = vhdEx.exportSchema(name, architecture, this.schema.get('graph'));
        var DownloadAttributeSupport = 'download' in document.createElement('a');
        if (DownloadAttributeSupport) {
            showSave = function (data, name) {
                var uriContent = 'data:application/octet-stream,' + encodeURIComponent(data);
                a.attr('href', uriContent);
                a.attr('download', name);
                a.attr('target', "_blank");
                a[0].click(); // automatické stažení
                return true;
            };
        } else {
            showSave = function (data, name) {
                try {
                    blobObject = new Blob([data], {type: "application/octet-stream"});
                    window.navigator.msSaveOrOpenBlob(blobObject, (name));
                }
                catch (ex) {
                    window.BlobBuilder = window.BlobBuilder ||
                        window.WebKitBlobBuilder ||
                        window.MozBlobBuilder ||
                        window.MSBlobBuilder;
                    if (ex.name == 'TypeError' && window.BlobBuilder) {
                        var bb = new BlobBuilder([data]);
                        blobObject = bb.getBlob("application/octet-stream");
                        if(window.navigator.msSaveOrOpenBlob)
                            window.navigator.msSaveOrOpenBlob(blobObject, (name));
                    }
                    else {
                        showSnackbar('Uložení do souboru není podporováno ve vašem prohlížeči.');
                        return false;
                    }
                }
                return true;
            };
        }
        return showSave(content, file_name);
    },

});
