/**
 * Created by Tom on 27.04.2017.
 */



eco.Models.Simulation = Backbone.Model.extend({
    initialize: function (opts) {
        this.paper = opts.paper;

        ///

        var gates = {
            rs: new joint.shapes.mylib.RS({ position: { x: 25, y: 25 }}),
        };
        this.paper.model.addCells(_.toArray(gates));


        ///

        var self = this;
        console.log(this.paper);
        initializeSignal(self.paper, self.paper.model);

        console.log('eco.Models.Simulation - initialize - paper + graph', this.paper, this.paper.model);

        this.paper.on('cell:pointerclick', createCellDoubleclickHandler(function (cellView, evt, x, y) {
            console.log("dbclick", cellView);

        }));
        this.paper.on('cell:pointerclick', function (cellView) {

            // console.log(cellView.model.get('outPorts') );

            if (cellView.model instanceof joint.shapes.mylib.INPUT) {
                cellView.model.switchSignal();
                broadcastSignal(cellView.model, {q: cellView.model.signal}, self.paper, self.paper.model);
                V(cellView.el).toggleClass('live', cellView.model.signal > 0);
            }

        });

        /**
         * Reinitialyze signals when wire was connected or disconnected.
         */
        this.paper.model.on('change:source change:target', function (model, end) {
            // console.log('eco.Models.Simulation - on:: change:source change:target', this);
            var e = 'target' in model.changed ? 'target' : 'source';
            if ((model.previous(e).id && !model.get(e).id) || (!model.previous(e).id && model.get(e).id)) {
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

                        // get an array of signals on all input ports
                        var inputs = _.chain(self.paper.model.getConnectedLinks(gate, {inbound: true}))
                            .groupBy(function (wire) {
                                return wire.get('target').port;
                            })
                            .map(function (wires) {
                                var inSignal = Math.max.apply(this, _.invoke(wires, 'get', 'signal'));
                                return  inSignal;
                            })
                            .value();

                        var outputs = {};
                        var ops = gate.operation.apply(gate, inputs);
                        if (_.size(ops)>0){
                            _.each(ops, function (value, key) {
                                outputs[key] = magnitude * value;
                            });

                        }else{
                            var result = gate.operation.apply(gate, inputs);
                            outputs["q"] = magnitude * result;
                        }
                        broadcastSignal(gate, outputs, self.paper, self.paper.model);
                    });
                }
            }
        });
    }


});
