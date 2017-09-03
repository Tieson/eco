/**
 * Created by Tom on 27.04.2017.
 */



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

        var gates = {
            // JKFFAR: new joint.shapes.mylib.JKFFAR({position: {x: 50, y: 50}}),
            // rs: new joint.shapes.mylib.RST({ position: { x: 25, y: 25 }}),
            // rs2: new joint.shapes.mylib.RST({ position: { x: 25, y: 25 }}),
            // mux: new joint.shapes.mylib.MUX2({ position: { x: 25, y: 125 }}),
            // dec: new joint.shapes.mylib.DEC18({ position: { x: 25, y: 225 }}),
            // ram: new joint.shapes.mylib.ARAM4x16({ position: { x: 25, y: 325 }}),
            // fadd: new joint.shapes.mylib.FULLADDER({ position: { x: 25, y: 425 }}),
            // and1: new joint.shapes.mylib.TUL_AND({ position: { x: 25, y: 425 }}),
            // and2: new joint.shapes.mylib.TUL_AND({ position: { x: 25, y: 425 }}),
            // add: new joint.shapes.mylib.ADD4({ position: { x: 25, y: 425 }}),
            // mult: new joint.shapes.mylib.MUL8({ position: { x: 25, y: 425 }}),
            // in: new joint.shapes.mylib.INPUT({ position: { x: 25, y: 425 }}),
        };
        this.paper.model.addCells(_.toArray(gates));

        var self = this;
        initializeSignal(self.paper, self.paper.model);

        this.paper.on('cell:pointerclick', createCellDoubleclickHandler(function (cellView, evt, x, y) {
            console.log("dbclick", cellView);
        }));

        this.paper.on('cell:pointerclick', function (cellView) {
            console.log('pointerclick');

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

                // console.log(cellView.model.get('outPorts') );

                if (cellView.model instanceof joint.shapes.mylib.INPUT) {
                    cellView.model.switchSignal();
                    broadcastSignal(cellView.model, {q: cellView.model.signal}, self.paper, self.paper.model);
                    V(cellView.el).toggleClass('live', cellView.model.signal > 0);
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
                        broadcastSignal(gate, outputs, self.paper, self.paper.model);
                    });
                }
            }
        });
    }


});
