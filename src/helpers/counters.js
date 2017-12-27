
function createBorderedCounter(min, max, start) {
    start = start || 0;
    if (min > max) {
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

function createMapCounter(start) {
    start = start || 0;
    var counts = {};
    var functions = {
        get: function (key) {
            return counts[key];
        },
        set: function (key, value) {
            counts[key] = value;
            return counts[key];
        },
        add: function (key, value) {
            if (counts[key] !== undefined){
                counts[key] = start;
            }
            counts[key] += value;
            return counts[key];
        },
        inc: function (key) {
            if (counts[key] !== undefined)
                counts[key] += 1;
            else
                counts[key] = start;
            return counts[key];
        },
        dec: function () {
            if (counts[key] !== undefined)
                counts[key] -= 1;
            else
                counts[key] = start;
            return counts[key];
        },
        reset: function (key) {
            counts[key] = start;
            return counts[key];
        },
    };
    return functions;
}

function createSetCounter(start) {
    start = start || 0;
    var counts = {};
    var counter = {
        set: function (key, value) {
            if(value < start){
                // throw new Exception("Value ("+value+") already exists.");
                return undefined;
            }
            if (_.find(counts[key], function(o){return o === value;}) === undefined){
                if(counts[key] !== undefined && _.size(counts[key])>0) {
                    counts[key].push(value);
                    counts[key] = _.sortBy(counts[key]);
                }else {
                    counts[key] = [value];
                }
            }
        },
        emptyAll: function () {
            counts = {};
        },
        empty: function (key) {
            counts[key] = [];
        },
        inc: function(key){
            return this.getNextEmpty(key);
        },
        getNextEmpty: function(key){
            var set = counts[key];
            if(set !== undefined && _.size(set)>0){

                var last = start;
                var result;
                _.forEach(set, function(value){
                    if (last===value){
                        last++;
                    }else{
                        counts[key].push(last);
                        counts[key] = _.sortBy(counts[key]);
                        result = last;
                        return false;
                    }
                });
                if(result === undefined){
                    counts[key].push(last);
                    result = last;
                }
                return result;

            }else{
                counts[key] = [start];
                return start;
            }
        },
        removeOne: function(key, value){
            var set = counts[key];
            var index = set.indexOf(value);
            if (index >= 0){
                set.splice(index, 1);
            }
        }
    };
    return counter;
}