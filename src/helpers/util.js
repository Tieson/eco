/**
 * Created by Tom on 21.04.2017.
 */


function createBorderedCounter(min, max, start) {
    var start = start || 0;
    if (min > max) {
        console.log("Minimum value is larger than max");
        error("Minimum value is larger than max");
    }
    if (start < min) {
        start = min;
        console.log("The start was set to the min value (" + min + ")");
    } else if (start > max) {
        start = max;
        console.log("The start was set to the max value (" + max + ")");
    }
    var count = start;

    var functions = {
        get: function () {
            return count;
        },
        set: function (value) {
            if (value > max) {
                value = max;
            } else if (value < min) {
                value = min;
            }
            count = value;
        },
        add: function (value) {
            count += value;
            if (count > max) {
                count = max;
            } else if (value < min) {
                count = min;
            }
            return count;
        },
        inc: function () {
            if (count < max){
                count++;
            }
            return count;
        },
        dec: function () {
            if (count > min){
                count--;
            }
            return count;
        },
        reset: function () {
            count = start;
        }
    };
    return functions;
}

function Counter(start){
    this.count = 0;
    this.start = start || 0;
}

Counter.prototype = {
    get: function () {
        return this.count;
    },
    set: function (value) {
        this.count = value;
        return this.count;
    },
    add: function (value) {
        this.count += value;
        return this.count;
    },
    inc: function () {
        this.count++;
        return this.count;
    },
    dec: function () {
        this.count--;
        return this.count;
    },
    reset: function () {
        this.count = this.start;
    }
};

function createSimpleCounter(start) {
    var start = start || 0;
    var count = start;
    var functions = {
        get: function () {
            return count;
        },
        set: function (value) {
            count = value;
        },
        add: function (value) {
            count += value;
            return count;
        },
        inc: function () {
            count++;
            return count;
        },
        dec: function () {
            count--;
            return count;
        },
        reset: function () {
            count = start;
        }
    };
    return functions;
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



function getUtils() {
    var namespace = {
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
        inputParsers: {
            byValue: function (x) {
                return x.val();
            },
        },
        getDay: function(key){
            return this.days[key];
        },
        getWeeks: function(key) {
            return this.weeks[key];
        },
        mapValues: function (names, prefix, $element) {
            var result = {};
            _.each(names, function (item, key) {
                result[key] = item($element.find(prefix+ key));
            });
            return result;
            return _.ma
        }
    };

    return namespace;
}