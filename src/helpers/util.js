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


function broadcastSignal(gate, signals, paper, graph) {
    // console.log("broadcastSignal(gate, signal, schema)", gate, signal, schema);
    // broadcast signal to all output ports
    // _.defer(_.invoke, graph.getConnectedLinks(gate, {outbound: true}), 'set', 'signal', signal);
    // console.log('%c Mělo by udělat: toggleLive ', 'background: orange; color: white');
    // toggleLive(gate, signal, paper);

    var outLinks = graph.getConnectedLinks(gate, {outbound: true})
        .map(function (x) {
            return x;
        });


    var result = _.reduce(outLinks, function(result, item) {
        var key = item.get('source').port;
        (result[key] || (result[key] = [])).push(item);
        return result;
    }, {});


    _.each(result, function (wires, key) {
        _.defer(_.invoke, wires, 'set', 'signal', signals[key]);
        // toggleLive(gate, signals[key], paper); //zvýrazňuje hradlo pokud jeho poslední výstup je v log 1 :D -> k ničemu, ale může se hodit u vstupů //TODO: udělat to u v stupů samostatně.
    });

    return true;

}

function toggleLive(model, signal, paper) {

    // console.log('%c toggleLive ', 'background: black; color:yellow; ', paper);
    if (paper) {
        // add 'live' class to the element if there is a positive signal
        // console.log("live",model, paper, paper.findViewByModel(model));
        try {
            if (paper.findViewByModel(model))
                V(paper.findViewByModel(model).el).toggleClass('live', signal > 0);
                V(paper.findViewByModel(model).el).toggleClass('invalid', signal < 0);
        } catch (ex) {
            console.log(ex, model, signal, paper);
        }
    } else {
        console.log("%c S: toggleLive -> no paper exist -> simulation without echo ", 'background: black; color:yellow; ');
    }
}

function startClock(gate, signal, paper, graph) {
//                _.delay(startClock, gate.clockSpd, gate, gate.signal);
    window.setInterval(function () {
        if (gate.tryTick()) {
            broadcastSignal(gate, {q:gate.signal}, paper, graph);
        }
    }, gate.interval);
}

/**
 * Inicializuje signál v grafu
 * @param paper
 * @param graph
 * @returns {number}
 */
function initializeSignal(paper, graph) {
    console.log("%c initializeSignal ", "background: brown; color: yellow");
    var signal = Math.random();
    var self = this;

    // > 0 vodič s log. 1
    // < 0 vodič s log. 0

    // 0 none of the above - reset value

    // vynulování všech signálů
    _.invoke(graph.getLinks(), 'set', 'signal', 0);

    // odebrání všech aktivních tříd
    paper.$el.find('.live').each(function () {
        V(this).removeClass('live');
    });

    _.each(graph.getElements(), function (element) {
        // rozeslání signálů ze vstupů
        var view = paper.findViewByModel(element);
        (element instanceof joint.shapes.mylib.INPUT) && broadcastSignal(element, {q : element.signal}, paper, graph) && view.$el.toggleClass('live', element.signal > 0);
        (element instanceof joint.shapes.mylib.VCC) && broadcastSignal(element, {q : element.signal}, paper, graph) && view.$el.toggleClass('live', element.signal > 0);
        (element instanceof joint.shapes.mylib.GND) && broadcastSignal(element, {q : element.signal}, paper, graph) && view.$el.toggleClass('live', element.signal > 0);
        (element instanceof joint.shapes.mylib.CLK) && startClock(element, {q : element.signal}, paper, graph) && view.$el.toggleClass('live', element.signal > 0);
    });

    return signal;
}

/*
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
}*/
