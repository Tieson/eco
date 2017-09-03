/* jshint devel: true */
'use strict';


function Creator(graph, counter) {
    this.counter1 = counter;
    this.graph = graph;
}
Creator.prototype.createEntity = function (name, x, y) {
    return eval("new joint.shapes.mylib." + name + "({position:{x:" + x + ",y:" + y + "}})");
};
Creator.prototype.addClock = function (x) {
    var count = this.counter1.next(types.CLK),
        label = 'CLK' + count;
    x.attr('.label/text', label);
    // type je INPUT přesto že se jedná o hodiny - jsou vstupem
    x.attr('custom', {type: types.IN, name: types.CLK, number: count, uniqueName: label, label: 'hodiny'});
    this.graph.addCell(x);
};
Creator.prototype.resumeClock = function (x, number) {
    this.counter1.initCounterMax(types.CLK, number);
    var label = 'CLK' + number;
    x.attr('.label/text', label);
    x.attr('custom', {type: types.IN, name: types.CLK, number: number, uniqueName: label, label: 'hodiny'});
    this.graph.addCell(x);
};
Creator.prototype.addInput = function (x) {
    var count = this.counter1.next(types.IN),
        label = 'X' + count;
    x.attr('.label/text', label);
    x.attr('custom', {type: types.IN, name: 'X', number: count, uniqueName: label, label: 'vstup'});
    this.graph.addCell(x);
};
Creator.prototype.resumeInput = function (x, number) {
    this.counter1.initCounterMax(types.IN, number);
    var label = 'X' + number;
    x.attr('.label/text', label);
    x.attr('custom', {type: types.IN, name: 'X',
        number: number, uniqueName: label, label: 'vstup'});
    this.graph.addCell(x);
};
Creator.prototype.addOutput = function (x) {
    var count = this.counter1.next(types.OUT),
        label = 'Z' + count;
    x.attr('.label/text', label);
    x.attr('custom', {type: types.OUT, name: 'Z', number: count, uniqueName: label, label: 'výstup'});
    this.graph.addCell(x);
};
Creator.prototype.resumeOutput = function (x, number) {
    this.counter1.initCounterMax(types.OUT, number);
    var label = 'Z' + number;
    x.attr('.label/text', label);
    x.attr('custom', {type: types.OUT, name: 'Z', number: number, uniqueName: label, label: 'výstup'});
    this.graph.addCell(x);
};

Creator.prototype.addGate = function (x, gate, label) {
    var count = this.counter1.next(gate),
        name = gate + '_' + count;
    x.attr('custom', {type: types.GATE, name: gate, number: count, uniqueName: name, label: label});
    this.graph.addCell(x);
};
Creator.prototype.resumeGate = function (x, gate, label, number) {
    this.counter1.initCounterMax(gate, number);
    var name = gate + '_' + number;
    x.attr('custom', {type: types.GATE, name: gate, number: number, uniqueName: name, label: label});
    this.graph.addCell(x);
};

Creator.prototype.removeElement = function (x) {
    x.remove();
};
