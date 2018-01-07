/**
 * Created by Tom on 28.08.2017.
 */
/**
 * Created by Tom on 27.04.2017.
 */


/**
 * Objekt pro export schéma do VHDL
 * Veřejné funkce:
 */
function VhdExporter() {
    this.notConnectedInputDefault = eco.Utils.notConnectedInputDefault;
};

/**
 * Metoda generující obsah vhdl souboru (pro export) z vytvořeného schématu.
 * @returns {vhdl|String}
 */
VhdExporter.prototype.exportSchema = function (c_name_en, c_name_arch, graph) {
    var elements = this.getAllEntities(graph),
        inputs = this.getInputs(graph),
        outputs = this.getOutputs(graph);
    var inputOutputs = this.portsToVHDL(inputs, outputs);
    var signals = this.getSignals(graph, elements);
    var gates = this.gatesToVHDL(graph, elements);
    var outputsMap = this.getOutputMap(graph, outputs);

    var vhdl = "library IEEE;\r\nuse IEEE.std_logic_1164.all;" +
        "\r\n\r\nentity " + c_name_en + " is\r\n" +
        "\tport (\r\n" + inputOutputs +
        "\r\n\t);\r\nend entity " + c_name_en + ";\r\n\r\n" +
        "architecture " + c_name_arch + " of " + c_name_en + " is\r\n" +
        signals + "\r\n" +
        "begin" +
        gates + "\r\n\t" +
        outputsMap.join(';\r\n\t') +
        ((outputsMap.length > 0)?";":"") +
        "\r\nend architecture " + c_name_arch + ";\r\n" +
        "\r\n";
    return vhdl;
};

VhdExporter.prototype.getElemByType = function(graph, type) {
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
};

VhdExporter.prototype.getAllEntities = function(graph) {
    var elements = graph.getElements();
    // console.log('getAllEntities', elements);
    return elements;
};

VhdExporter.prototype.getInputs = function(graph) {
    var inputs = this.getElemByType(graph, eco.Utils.types.IN);
    // console.log('getInputs', inputs);
    return inputs;
};
VhdExporter.prototype.getOutputs = function(graph) {
    var outputs = this.getElemByType(graph, eco.Utils.types.OUT);
    // console.log('getOutputs', outputs);
    return outputs;
};

/**
 * Vypíše jako VHDL signály používané uvnitř architektury entity
 * Vnitřní signály jsou (jako porty) std_logic
 *
 * @param graph
 * @param elements
 * @returns {string}
 */
VhdExporter.prototype.getSignals = function(graph, elements) {
    var self = this, sig, sigs = [], tId, tCell, targetType, sigName, custom, index, type, duplicitCounter = createMapCounter(0);

    sigs.push("\tsignal default_input : std_logic := '"+this.notConnectedInputDefault+"';\r\n"); // signál s log 1 jako výchozí pro nezapojené vstupy

    for (var i = 0; i < elements.length; i++) {
        type = elements[i].get('exportType');
        custom = elements[i].attr('custom');
        if (type === eco.Utils.types.GATE) {

            var cLinks = graph.getConnectedLinks(elements[i], {outbound: true});
            for (var j = 0; j < cLinks.length; j++) {
                sig = cLinks[j];

                tId = sig.get('target');
                tCell = graph.getCell(tId).attr('custom');
                targetType = graph.getCell(tId).get('exportType');
                sigName = sig.get('source').port + '_' + custom.uniqueName;
                index = duplicitCounter.inc(sigName);

                if (index < 1) {
                    if (targetType === eco.Utils.types.GATE || targetType === eco.Utils.types.OUT) {
                        sigs.push("\tsignal " + sigName + " : std_logic;\r\n");
                    }
                }
            }
        }
    }
    // console.log(sigs);
    return sigs.join('');
};

VhdExporter.prototype.gatesToVHDL = function(graph, elements) {
    var result = [], ins, pos, type, self = this;

    for (var i = 0; i < elements.length; i++) {
        ins = elements[i].attr('custom');
        type = elements[i].get('exportType');
        pos = elements[i].attributes.position;
        if (type === eco.Utils.types.GATE) {
            var name = ins.name || ins.label || 'gate';
            var portmap = this.getPortMap(graph, elements[i]);
            result.push("\r\n\t" + name + "_" + ins.number + " : entity work." + ins.type + (portmap!==false?"":";")
                + ' --[' + pos.x + ';' + pos.y + ']'
                + (portmap!==false?("\r\n\tport map(" + portmap + ");"):"")
                + "\r\n");
        }
    }
    return result.join("");
};

VhdExporter.prototype.portsToVHDL = function(inputs, outputs) {
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
};

VhdExporter.prototype.getOutputMap = function(graph, outputs) {
    var portmap = [];
    var self = this;
    for (var j = 0, max_out = outputs.length; j < max_out; j++) {
        var linksIn = graph.getConnectedLinks(outputs[j], {inbound: true});
        var sig,
            target,
            source,
            other,
            customOther;

        for (var i = 0; i < linksIn.length; i++) {
            sig = linksIn[i];
            target = sig.get('target');
            source = sig.get('source');
            other = graph.getCell(source.id);
            customOther = other.attr('custom');
            switch (other.get('exportType')) {
                case eco.Utils.types.GATE:
                    portmap.push(outputs[j].attr('custom').name + outputs[j].attr('custom').number + " <= " + source.port + '_' + customOther.uniqueName);
                    break;
                case eco.Utils.types.IN:
                    portmap.push(outputs[j].attr('custom').name + outputs[j].attr('custom').number +" <= " + customOther.name + customOther.number);
                    break;
                default :
                    break;
            }
        }
    }
    return portmap;
};


VhdExporter.prototype.getPortMap = function(graph, gate) {
    var self= this;
    var sig, portmap = [],
        linksOut, linksIn,
        other, source, target,
        gCustom,
        customOther,
        duplicitCounter = createMapCounter();

    linksOut = graph.getConnectedLinks(gate, {outbound: true});
    linksIn = graph.getConnectedLinks(gate, {inbound: true});

    var inPorts = gate.get('inPorts');
    var usedPorts = {};

    for (var i = 0; i < linksIn.length; i++) {
        sig = linksIn[i];
        target = sig.get('target');
        source = sig.get('source');
        other = graph.getCell(source.id);
        customOther = other.attr('custom');
        switch (other.get('exportType')) {
            case eco.Utils.types.GATE:
                portmap.push(target.port + " => " + source.port + '_' + customOther.uniqueName);
                usedPorts[target.port] = 1;
                break;
            case eco.Utils.types.IN:
                portmap.push(target.port + " => " + customOther.name+customOther.number);
                usedPorts[target.port] = 1;
                break;
            default :
                break;
        }
    }

    for (var k = 0; k < inPorts.length; k++) {
        if (!usedPorts[inPorts[k]]){
            portmap.push(inPorts[k] + " => default_input");
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
                case eco.Utils.types.GATE:
                case eco.Utils.types.OUT:
                    portmap.push(source.port + " => " + source.port + '_' + gCustom.uniqueName);
                    break;
                default :
                    break;
            }
        } else {
            console.log('Duplicit signal and port added error!!!');
        }
    }
    if (portmap.length > 0) {
        return portmap.join(', ');
    }else {
        return false;
    }
};



eco.Models.VhdlExporter = Backbone.Model.extend({

    initialize: function (opts) {
        this.schema = opts.schema;
    },

    getVHDL: function(){
        var file_name;
        var name = this.schema.get('name');
        var architecture = this.schema.get('architecture');

        var vhdEx = new VhdExporter();
        var content = vhdEx.exportSchema(name, architecture, this.schema.get('graph'));

        return content;
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

        var vhdEx = new VhdExporter();
        var content = vhdEx.exportSchema(name, architecture, this.schema.get('graph'));

        var blobObject;
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
