/**
 * Created by Tom on 27.04.2017.
 */

joint.shapes.mylib.Hradlo.prototype.onSignal = function (signal, handler) {
//            console.log("joint.shapes.mylib.Hradlo.prototype.onSignal", this);
    handler.call(this, 0, signal);
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
        // this.paper.model.addCells(_.toArray({}));

        var self = this;
        initializeSignal(self.paper, self.paper.model);

        this.paper.on('cell:pointerclick', createCellDoubleclickHandler(function (cellView, evt, x, y) {
            console.log("dbclick", cellView);
        }));

        this.paper.on('cell:pointerclick', function (cellView) {
            var gate = cellView.model;

            if (eco.Utils.getType('VODIC') !== gate.attr('type')){

                var ports = {};
                _.each(gate.ports, function (x) {
                    ports[x.id] = 1;
                });


                var inputs = _.chain(_.sortBy(self.paper.model.getConnectedLinks(gate, {inbound: true}), function (x) {
                    return x.get('target').port;
                }))
                    .groupBy(function (wire) {
                        return wire.get('target').port;
                    })
                    .map(function (wires) {
                        var inSignal = Math.max.apply(this, _.invoke(wires, 'get', 'signal'));
                        ports[_.first(wires).get('target').port] = inSignal;
                        return inSignal;
                    })
                    .value();

                var ops = gate.operation.apply(gate, _.map(ports, function (x) {
                    return x;
                }));
                if (_.size(ops) > 0) {
                    _.each(ops, function (value, key) {
                        ports[key] = value;
                    });

                } else {
                    ports["q"] = ops;
                }

                if (cellView.model instanceof joint.shapes.mylib.INPUT ) {
                    cellView.model.switchSignal();
                    broadcastSignal(cellView.model, {q: cellView.model.signal}, self.paper.model);
                    V(cellView.el).toggleClass('live', cellView.model.isVisualyActive());
                }
                if (cellView.model instanceof joint.shapes.mylib.CLK) {
                    cellView.model.switchSignal();
                    broadcastSignal(cellView.model, {q: cellView.model.signal}, self.paper.model);
                    V(cellView.el).toggleClass('live', cellView.model.isVisualyActive());
                }
            }
        });

        /**
         * Reinitialyze signals when wire was connected or disconnected.
         */
        this.paper.model.on('change:source change:target', function (model, end) {
            // console.log('eco.Models.Simulation - on:: change:source change:target', this);
            var e = 'target' in model.changed ? 'target' : 'source';
            if ((model.previous(e).id && !model.get(e).id) || (!model.previous(e).id && model.get(e).id) || model.previous(e).port != model.get(e).port) {
                initializeSignal(self.paper, self.paper.model);
                console.log('%c initGraph / change:source change:target ', 'background: black; color:white; ');
            }
        });

        this.paper.model.on('change:signal', function (wire, signal) {
            // toggleLive(wire, signal, self);
            toggleLive(wire, signal, self.paper);

            var magnitude = 1; //Math.abs(signal);

            // if a new signal has been generated stop transmitting the old one
//                if (magnitude !== current) return;

            var gate = self.paper.model.getCell(wire.get('target').id);

            //Rozsvítit cílové hradlo pokud přijde log.1 a je to výstup
            if (gate instanceof joint.shapes.mylib.OUTPUT) {
                toggleLive(gate, signal, self.paper);
            }

            if (gate) {

                if (gate instanceof joint.shapes.mylib.Hradlo) {
                    // console.log(gate);
                    gate.onSignal(signal, function () {

                        var ports = {};
                        _.each(gate.ports, function(x) {
                            ports[x.id] = 1;
                        });

                        // get an array of signals on all input ports
                        var inputs = _.chain(_.sortBy(self.paper.model.getConnectedLinks(gate, {inbound: true}),function (x) {
                                return x.get('target').port;
                            }))
                            .groupBy(function (wire) {
                                return wire.get('target').port;
                            })
                            .map(function (wires) {
                                var inSignal = Math.max.apply(this, _.invoke(wires, 'get', 'signal'));
                                ports[_.first(wires).get('target'). port] = inSignal;
                                return  inSignal;
                            })
                            .value();

                        var outputs = {};
                        var ops = gate.operation.apply(gate, [ports]);
                        if (_.size(ops)>0){
                            _.each(ops, function (value, key) {
                                outputs[key] = magnitude * value;
                            });
                        }else{
                            outputs["q"] = magnitude * ops;
                        }
                        broadcastSignal(gate, outputs, self.paper.model);
                    });
                }
            }
        });
    }


});
