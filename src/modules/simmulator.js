/**
 * Created by Tom on 27.04.2017.
 */

joint.shapes.mylib.Hradlo.prototype.onSignal = function (signal, handler) {
    handler.call(this, this, signal);
};

eco.Models.Simulation = Backbone.Model.extend({

    initialize: function (opts) {
        this.paper = opts.paper;
    },

    stopSimulation: function () {
        var paper = this.paper;
        paper.off('cell:pointerclick');
        paper.model.off('change:source change:target');
        paper.model.off('change:signal');
        paper.model.off('remove');
        _.invoke(paper.model.getLinks(), 'set', 'signal', 0);
        paper.$el.find('.live').each(function () {
            V(this).removeClass('live');
        });
    },

    startSimulation: function () {
        var self = this;
        self.onSignal = self.createOnSignalHandler();

        this.initializeSignal(self.paper, self.paper.model);

        this.paper.model.on('change:signal', function (wire, signal) {
            self.toggleLive(wire, signal, self.paper);
            var gate = self.paper.model.getCell(wire.get('target').id);

            if (gate instanceof joint.shapes.mylib.OUTPUT) {
                self.toggleLive(gate, signal, self.paper);
            }
            if (gate instanceof joint.shapes.mylib.Hradlo) {
                gate.onSignal(signal, self.onSignal);
            }
        });

        this.paper.on('cell:pointerclick', createCellDoubleclickHandler(function (cellView, evt, x, y) {}));
        this.paper.on('cell:pointerclick', function (cellView) {
            var gate = cellView.model;
            if (gate instanceof joint.shapes.mylib.INPUT || gate instanceof joint.shapes.mylib.CLK) {
                gate.switchSignal();
                self.broadcastSignal(gate, {q: gate.signal}, self.paper.model);
                V(cellView.el).toggleClass('live', gate.isVisualyActive());
            }
        });
        this.paper.model.on('change:source change:target', function (model, end) {
            var e = 'target' in model.changed ? 'target' : 'source';
            if ((model.previous(e).id && !model.get(e).id) || (!model.previous(e).id && model.get(e).id) || model.previous(e).port != model.get(e).port) {
                // self.initializeSignal(self.paper, self.paper.model);

                var gate = self.paper.model.getCell(model.get('target').id);
                var oldGate = self.paper.model.getCell(model.previous('target').id);
                if (oldGate){
                    if (oldGate instanceof joint.shapes.mylib.OUTPUT) {
                        self.toggleLive(oldGate, 0, self.paper);
                    }
                    if (oldGate instanceof joint.shapes.mylib.Hradlo) {
                        oldGate.onSignal(null, self.onSignal);
                    }
                }else {
                    if (gate instanceof joint.shapes.mylib.OUTPUT) {
                        self.toggleLive(gate, model.get('signal'), self.paper);
                    }
                    if (gate instanceof joint.shapes.mylib.Hradlo) {
                        gate.onSignal(null, self.onSignal);
                    }
                }
            }
        });
        this.paper.model.on('remove', function (model,a, b) {
            //1. get connected entities
            //2. trigger on signal
            var outputWires = [];

            if (model instanceof joint.shapes.mylib.Vodic) {
                outputWires.push(model);
            }else {
                outputWires = self.paper.model.getConnectedLinks(model, { outbound: true });
            }

            _.each(outputWires, function (wire) {
                var gate = self.paper.model.getCell(wire.get('target').id);

                if (gate instanceof joint.shapes.mylib.OUTPUT) {
                    self.toggleLive(gate, 0, self.paper);
                }
                if (gate instanceof joint.shapes.mylib.Hradlo) {
                    gate.onSignal(null, self.onSignal);
                }
            });

            //self.initializeSignal(self.paper, self.paper.model);
        });
        this.paper.model.on('add', function (model) {
            if (model instanceof joint.shapes.mylib.Vodic) {
                var gate = self.paper.model.getCell(model.get('source').id);

                var signalProducers = {
                    INPUT: self.broadcastSignal,
                    VCC: self.broadcastSignal,
                    GND: self.broadcastSignal,
                    CLK: self.startClock,
                    Hradlo: self.startGate,
                };

                var view = self.paper.findViewByModel(gate);
                    _.each(signalProducers, function (item, key) {
                        (gate instanceof joint.shapes.mylib[key])
                        && item.call(self,gate, {q: gate.signal}, self.paper.model)
                        && view.$el.toggleClass('live', gate.isVisualyActive());
                    });
            }
        });

    },

    createOnSignalHandler: function() {
        var self = this;
        return function (gate) {
            var ports = {};
            _.each(gate.ports, function (x) {
                ports[x.id] = eco.Utils.notConnectedInputDefault;
            });
            _.chain(_.sortBy(self.paper.model.getConnectedLinks(gate, {inbound: true}), function (x) {
                return x.get('target').port;
            })).groupBy(function (wire) {
                return wire.get('target').port;
            }).map(function (wires) {
                var inSignal = Math.max.apply(this, _.invoke(wires, 'get', 'signal'));
                ports[_.first(wires).get('target').port] = inSignal;
                return inSignal;
            }).value();

            var outputs = {};
            var ops = gate.operation.apply(gate, [ports]);
            if (_.size(ops) > 0) {
                _.each(ops, function (value, key) {
                    outputs[key] = value;
                });
            } else {
                outputs["q"] = ops;
            }
            self.broadcastSignal(gate, outputs, self.paper.model);
        };
    },

    broadcastSignal: function (gate, signals, graph) {
        var outLinks = graph.getConnectedLinks(gate, {outbound: true})
            .map(function (x) {
                return x;
            });
        var result = _.reduce(outLinks, function (result, item) {
            var key = item.get('source').port;
            (result[key] || (result[key] = [])).push(item);
            return result;
        }, {});
        _.each(result, function (wires, key) {
            _.defer(_.invoke, wires, 'set', 'signal', signals[key]);
        });
        return true;
    },

    toggleLive: function (model, signal, paper) {
        if (paper) {
            try {
                if (paper.findViewByModel(model))
                    V(paper.findViewByModel(model).el).toggleClass('live', signal > 0);
                V(paper.findViewByModel(model).el).toggleClass('invalid', signal < 0);
            } catch (ex) {}
        }
    },

    startClock: function (clock, signal, graph) {
        var self = this;
        window.setInterval(function () {
            if (clock.tryTick()) {
                self.broadcastSignal(clock, {q: clock.signal}, graph);
            }
        }, clock.interval);
        return true;
    },

    startGate: function (gate, signal, graph) {
        gate.onSignal(signal, this.onSignal);
        return false;
    },
    startInput: function (gate, signals, graph) {
        this.broadcastSignal(gate, signals, graph);
        return false;
    },

    /**
     * Inicializuje signál v grafu
     * @param paper
     * @param graph
     * @returns {number}
     */
    initializeSignal: function (paper, graph) {
        var self = this;
        _.invoke(graph.getLinks(), 'set', 'signal', 0);
        paper.$el.find('.live').each(function () {
            V(this).removeClass('live');
        });

        var signalProducers = {
            INPUT: this.startInput,
            VCC: this.broadcastSignal,
            GND: this.broadcastSignal,
            CLK: this.startClock,
            Hradlo: this.startGate,
        };
        _.each(signalProducers, function (item, key) {
            _.each(graph.getElements(), function (element) {
                if (element instanceof joint.shapes.mylib[key]) {
                    if (item.call(self, element, {q: element.signal}, graph)) {
                        var view = paper.findViewByModel(element);
                        view.$el.toggleClass('live', element.isVisualyActive());
                    }
                }
            });
        });
    },
});
