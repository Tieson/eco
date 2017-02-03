
/* jshint devel: true */
'use strict';


function Serializer() {

	this.schemaKey = 'sch';
	var schemaKey = this.schemaKey;


	function getCurrentTimestamp() {
		if (!Date.now) {
			Date.now = function () {
				return new Date().getTime();
			};
		}
	}

	this.saveObject = function (key, obj) {
		var key = 'eco.' + key;
		localStorage.setItem(key, JSON.stringify(obj));
	};

	this.loadObject = function (key) {
		var key = 'eco.' + key;
		return JSON.parse(localStorage.getItem(key));
	};

	this.removeSchemaGraphJSON = function (schema) {
		var key = schemaKey + '.' + schema.schemaInfo.id;
		localStorage.removeItem(key);
	};


//	this.saveGraphJSON = function (schema, graphJSON) {
//		var key = schemaKey + '.' + schema.id;
//		var jsonGraph = JSON.stringify(graphJSON);
//		localStorage.setItem(key, jsonGraph);
//	};


	this.loadGraphJSON = function (schemaInfo) {
		var key = schemaKey + '.' + schemaInfo.id;
		var gr = JSON.parse(localStorage.getItem(key));
		if (gr != null) {
			return gr;
		} else {
			console.log('Nepodařilo se načíst žádné schéma!');
		}
	};

//	this.loadGraph = function (schema) {
//		var key = schemaKey + '.' + schema.id;
//		var gr = JSON.parse(localStorage.getItem(key));
//		if (gr != null) {
//			graph.fromJSON(gr);
//		} else {
//			return false;
//		}
//	};


	this.saveSchemas = function (schemas) {
		var sch = [schemas.length];
		for (var i = 0; i < schemas.length; i++) {
			sch[i] = schemas[i].schema.id;
		}
		var key = 'schemas';
		var result = JSON.stringify(sch);
		localStorage.setItem(key, result);
	};
	this.loadSchemas = function () {
		var schms = localStorage.getItem('schemas');
		return JSON.parse(schms);
	};

	this.updateSchema = function (schema) {
		try {
			var key = schemaKey + '.schemaInfo.' + schema.id;
			var sch = JSON.parse(localStorage.getItem(key));
			var time = getCurrentTimestamp();
			sch.datetime = time;
			localStorage.setItem(key, JSON.stringify(sch));
		} catch (ex) {
			console.log('Uložené schema neexistuje, nelze ho updatovat!');
		}
	};

}

/**
 * Save JSON graph representation of gived schema, under the key that contain schema id.
 * @param {Schema} schema
 * @returns {Serializer.prototype}
 */
Serializer.prototype.saveGraph = function (schema) {
	var key = this.schemaKey + '.' + schema.schemaInfo.id;
	var jsonGraph = JSON.stringify(schema.graph.toJSON());
	localStorage.setItem(key, jsonGraph);
	return this;
};

/**
 * 
 * @param {Schema} schema
 * @returns {Boolean}
 */
//Serializer.prototype.loadGraph = function (schema) {
//	var key = this.schemaKey + '.' + schema.schemainfo.id;
//	var gr = JSON.parse(localStorage.getItem(key));
//	if (gr != null) {
//		try {
//			schema.setGraphFromJson(gr); //graph.fromJSON(gr);
//			return true;
//		} catch (err) {
//			log(err.message);
//		}
//		return false;
//	} else {
//		return false;
//	}
//};