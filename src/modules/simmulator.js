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

        // vynulování všech signálů
        _.invoke(graph.getLinks(), 'set', 'signal', 0);

        // odebrání všech aktivních tříd
        paper.$el.find('.live').each(function () {
            V(this).removeClass('live');
        });
    },

    startSimulation: function () {
        var self = this;
        this.initializeSignal(self.paper, self.paper.model);

        this.paper.on('cell:pointerclick', createCellDoubleclickHandler(function (cellView, evt, x, y) {
        }));

        this.paper.on('cell:pointerclick', function (cellView) {
            var gate = cellView.model;

            if (gate instanceof joint.shapes.mylib.INPUT) {
                gate.switchSignal();
                self.broadcastSignal(gate, {q: gate.signal}, self.paper.model);
                V(cellView.el).toggleClass('live', gate.isVisualyActive());
            }
            if (gate instanceof joint.shapes.mylib.CLK) {
                gate.switchSignal();
                self.broadcastSignal(gate, {q: gate.signal}, self.paper.model);
                V(cellView.el).toggleClass('live', gate.isVisualyActive());
            }
        });

        /**
         * Reinitialyze signals when wire was connected or disconnected.
         */
        this.paper.model.on('change:source change:target', function (model, end) {
            console.log('change:source change:target');
            var e = 'target' in model.changed ? 'target' : 'source';
            if ((model.previous(e).id && !model.get(e).id) || (!model.previous(e).id && model.get(e).id) || model.previous(e).port != model.get(e).port) {
                console.log('change:source change:target----initializeSignal');
                self.initializeSignal(self.paper, self.paper.model);
            }
        });
        this.paper.model.on('remove', function (model,a, b) {
            console.log('remove', model, a,b);
            var e = 'target' in model.changed ? 'target' : 'source';
                self.initializeSignal(self.paper, self.paper.model);
        });

        var onSignal = self.onSignalChangeFactory();
        this.paper.model.on('change:signal', function (wire, signal) {
            self.toggleLive(wire, signal, self.paper);
            var gate = self.paper.model.getCell(wire.get('target').id);

            //Rozsvítit cílové hradlo pokud přijde log.1 a je to výstup
            if (gate instanceof joint.shapes.mylib.OUTPUT) {
                self.toggleLive(gate, signal, self.paper);
            }
            if (gate instanceof joint.shapes.mylib.Hradlo) {
                gate.onSignal(signal, onSignal);
            }
        });
    },

    onSignalChangeFactory: function() {
        var self = this;
        return function (gate) {
            var ports = {}; //pole portů
            _.each(gate.ports, function (x) {
                ports[x.id] = eco.Utils.notConnectedInputDefault;
            }); // výchozí hodnota nezapojených vstupů

            // získání pole signálů pro všechny vstupní porty
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

            // self.paper.findViewByModel(gate).$el.toggleClass('live', gate.isVisualyActive());
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

    startClock: function (gate, signal, graph) {
        var self = this;
        window.setInterval(function () {
            if (gate.tryTick()) {
                self.broadcastSignal(gate, {q: gate.signal}, graph);
            }
        }, gate.interval);
        return true;
    },

    startHradlo: function (gate, signal, graph) {
        var onSignal = this.onSignalChangeFactory();
        gate.onSignal(signal, onSignal);
        return true;
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
            INPUT: this.broadcastSignal,
            VCC: this.broadcastSignal,
            GND: this.broadcastSignal,
            CLK: this.startClock,
            Hradlo: this.startHradlo,
        };

        _.each(graph.getElements(), function (element) {
            var view = paper.findViewByModel(element);
            _.each(signalProducers, function (item, key) {
                (element instanceof joint.shapes.mylib[key])
                && item.call(self,element, {q: element.signal}, graph)
                && view.$el.toggleClass('live', element.isVisualyActive());
            });
        });
    },


});
