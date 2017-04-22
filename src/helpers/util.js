/**
 * Created by Tom on 21.04.2017.
 */

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

function inputNameValidator(self, event) {
    var text = $(event.target).val();
    if (text.length == 0 || isVhdlName(text) || (text.length > 0 && String.fromCharCode(event.keyCode) == '_')) {
        console.log("ok", text);
        return true;
    } else {
        console.log("nook");
        return false;
    }
}


function broadcastSignal(gate, signal, schema) {
    // console.log("broadcastSignal(gate, signal, schema)", gate, signal, schema);
    var graph = schema.get("graph");
    // broadcast signal to all output ports
    _.defer(_.invoke, graph.getConnectedLinks(gate, {outbound: true}), 'set', 'signal', signal);
    toggleLive(gate, signal, schema);
}

function toggleLive(model, signal, schema) {
    var paper = schema.get("paper");
    if (paper) {
        // add 'live' class to the element if there is a positive signal
        // console.log("live",model, paper, paper.findViewByModel(model));
        try {
            if (paper.findViewByModel(model))
                V(paper.findViewByModel(model).el).toggleClass('live', signal > 0);
        } catch (ex) {
            console.log(ex, model, signal, schema);
        }
    } else {
        // console.log("S: toggleLive -> no paper exist -> simulation without echo");
    }
}

function startClock(gate, signal, schema) {
//                _.delay(startClock, gate.clockSpd, gate, gate.signal);
    window.setInterval(function () {
        if (gate.tryTick()) {
            broadcastSignal(gate, gate.signal, schema);
        }
    }, 100);
}

function initializeSignal(schema) {

    var graph = schema.get("graph");
    var signal = Math.random();
    // > 0 wire with a positive signal is alive
    // < 0 wire with a negative signal means, there is no signal

    // 0 none of the above - reset value

    // cancel all signals stores in wires
    _.invoke(graph.getLinks(), 'set', 'signal', 0);

    // remove all 'live' classes
    $('.live').each(function () {
        V(this).removeClass('live');
    });

    _.each(graph.getElements(), function (element) {
        // broadcast a new signal from every input in the graph
        (element instanceof joint.shapes.mylib.INPUT) && broadcastSignal(element, element.signal, schema);
        (element instanceof joint.shapes.mylib.VCC) && broadcastSignal(element, element.signal, schema);
        (element instanceof joint.shapes.mylib.GND) && broadcastSignal(element, element.signal, schema);
        (element instanceof joint.shapes.mylib.CLK) && startClock(element, element.signal, schema);
    });

    return signal;
}