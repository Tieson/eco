
/* jshint devel: true */
'use strict';


function Counter() {
	this.counters = [];
	this.start = 0;
	this.getCounters = function () {
		return Object.keys(this.counters);
	};
}
Counter.prototype.setStartValue = function (startVal) {
	this.start = startVal;
};


Counter.prototype.size = function () {
	return this.counters.length;
};

Counter.prototype.initCounter = function (name, start) {
	this.counters[name] = start;
	return this;
};

Counter.prototype.initCounterMax = function (name, start) {
	if (start != undefined) {
		if (typeof this.counters[name] == 'undefined' || this.counters[name] < start)
		{
			this.counters[name] = start;
		}
	}
	return this;
};

Counter.prototype.getCount = function (name) {
	if (typeof this.counters[name] != 'undefined') {
		return this.counters[name];
	}
	return this.counters[name];
};

/**
 * Inkrementuje počítadlo a vrátí jeho hodnotu. Pokud neexistuje počítadlo s daným id, tak je vytvořeno s hodnotou 0;
 * @param {type} name Identfikátor počítadla
 * @returns {Number} hodnotu počátadla
 */
Counter.prototype.next = function (name) {
	if (typeof this.counters[name] != 'undefined') {
		return ++this.counters[name];
	}
	this.counters[name] = this.start;
	return this.start;
};
