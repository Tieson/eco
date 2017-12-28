/**
 * Created by Tom on 21.04.2017.
 */


window.eco.Utils = {
    notConnectedInputDefault: 1, // 1 nebo 0, projeví se jak v exportu do VHDL tak v simulátoru
    types: {
        IN: 'mylib.INPUT',
        OUT: 'mylib.OUTPUT',
        GATE: 'mylib.Gate',
        CLK: 'mylib.CLK',
        VODIC: 'mylib.Vodic',
    },
    taskValidity: {
        0: '<span class="label label-danger">Není validní</span>',
        1: '<span class="label label-success">Validní</span>',
    },
    hradla: {
        INPUT: 'X',
        OUTPUT: 'Z',
        CLK: 'CLK',
    },
    days: {
        po: 'Pondělí',
        ut: 'Úterý',
        st: 'Středa',
        ct: 'Čtvrtek',
        pa: 'Pátek',
        so: 'Sobota',
        ne: 'Neděle'
    },
    weeks: {
        both: 'Každý',
        odd: 'Lichý',
        even: 'Sudý'
    },
    fileTypes: {
        normal: "Normální",
        etalon: "Správné řešení VHDL",
        test: "Testovací VHDL"
    },
    inputParsers: {
        byValue: function (x) {
            return x.val();
        },
    },
    taskStates: {
        open: '<span class="label label-warning">Zatím neodevzdáno</span>',
        done: '<span class="label label-success">Úspěšně odevzdané</span>',
        failed: '<span class="label label-danger">Neúspěšně odevzdané</span>',
    },
    solutionStatuses: {
        waiting: '<span class="label label-warning">Čeká na kontrolu</span>',
        done: '<span class="label label-default">Zkontrolováno</span>',
        processing: '<span class="label label-info">Probíhá simulace</span>',
    },
    solutionResults: {
        ok: 'Správné řešení',
        nok: 'Chybné řešení',
    },
    getSolutionStatus: function (key) {
        return getTranslate(key, this.solutionStatuses);
    },
    getSolutionResults: function (key) {
        var keys = {
            0: 'nok',
            1: 'ok'
        };
        return getTranslate(keys[key], this.solutionResults);
    },
    getTaskStatus: function (key) {
        return getTranslate(key, this.taskStates);
    },
    getDay: function (key) {
        return getTranslate(key, this.days);
    },
    getWeeks: function (key) {
        return getTranslate(key, this.weeks);
    },
    getType: function (key) {
        return getTranslate(key, this.types);
    },
    getTaskValid: function (key) {
        return getTranslate(key, this.taskValidity);
    },
    getElementLabel: function (type) {
        return this.hradla[type];
    },
    mapValues: function (names, prefix, $element) {
        var result = {};
        _.each(names, function (item, key) {
            result[key] = item($element.find(prefix + key));
        });
        return result;
    },
    inicilizeCounterbyGraph: function (counter, graph) {
        var self = this;
        var elements = graph.getElements();
        _.forEach(elements, function (item) {
            var type = item.attr('custom').type;
            var number = item.attr('custom').number;
            if (type !== self.types.VODIC) {
                counter.set(type, number);
            }
        });
    },
    addEntityToGraph: function (entityName, position, graph, foundEntity) {
        if (joint.shapes.mylib[entityName]) {
            var newCell = new joint.shapes.mylib[entityName]({
                position: position
            });
            var counter = graph.get('counter');
            // x.attr('custom', );
            var number = counter.inc(entityName);
            var elemLabel = eco.Utils.getElementLabel(entityName);
            var uniqueName;
            if (elemLabel !== undefined) {
                uniqueName = elemLabel + number;
                newCell.attr('.label/text', uniqueName);
            } else {
                uniqueName = entityName + '_' + number;
            }
            newCell.attr('custom', {
                type: entityName,
                name: elemLabel,
                number: number,
                uniqueName: uniqueName,
                label: foundEntity.get('label'),
            });
            graph.addCell(newCell);
        }
        else {
            foundEntity.set('disabled', true);
        }
    },

    /**
     * Schová tlačítka podle zadaného pole selectorů
     * @param btns
     */
    hideButtons: function (btns) {
        _.each(btns, function (item) {
            $(item).hide();
        });
    },
    /**
     * Zobrazí tlačítka podle zadaného seznamu selectorů
     * @param btns
     */
    showButtons: function (btns) {
        _.each(btns, function (item) {
            $(item).show();
        });
    },


    /**
     * Kontrola importovaného VHDL souboru
     * Naivní kontrola zda-li jde o vhd file
     * @param {type} evt
     * @returns {undefined}
     */
    getVhdlFileContent: function (file, callback) {
        var reader = new FileReader();
        reader.onload = function (event) {
            var import_text = event.target.result;
            var rxArchBlock = /architecture\s*(\w+)\s+of\s+(\w+)\s+is([\s\S]*)begin([\s\S]*)end\s+architecture/im,
                portTmp = rxArchBlock.exec(import_text),
                archName = portTmp[1],
                entityName = portTmp[2];
            callback(entityName, archName, import_text);
        };
        reader.readAsText(file, "UTF-8");
    },

    recoutSchemaCounters: function (schema) {
        var graph = schema.get('graph');
        var counter = graph.get('counter');
        counter.emptyAll();
        eco.Utils.inicilizeCounterbyGraph(counter, graph);
    },

    downloadAsFile: function (data, filename) {
        var a = $('<a href="#" target="_blank" style="display: none">');
        var uriContent = 'data:application/octet-stream,' + encodeURIComponent(data);
        a.attr('href', uriContent);
        a.attr('download', filename);
        a.attr('target', "_blank");
        a.appendTo($('body'));
        a[0].click(); // okamžité stažení souboru
        a.remove(); // odebrání z body
    },

};

function getTranslate(key, data){
    if(data && data[key])
        return data[key];
    else
        return key;
}

function isVhdlName(text) {
    var rxArchBlock = /^([a-zA-Z](_?[a-zA-Z0-9])*[a-zA-Z0-9]*)$/i;
    return rxArchBlock.test(text);
}

function createCellDoubleclickHandler(callback) {
    var doubleclick;
    return function (cellView, evt, x, y) {
        var now = new Date();
        if (doubleclick && doubleclick.getTime() > (now.getTime() - 500)) {
            callback(cellView, evt, x, y);
        } else {
            doubleclick = new Date();
        }
    }
}