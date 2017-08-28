/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* jshint devel: true */
'use strict';

function recreateSchema(schemaInfo, json) {
	var schema = new Schema();
	schema.schemaInfo = schemaInfo;
	schema.json = json;
	return schema;
}

/**
 *
 * @param {string} name
 * @param {string} arch
 * @param {int} id
 * @returns {Schema}
 */
function Schema(name, arch, id) {
	this.schemaKeyPrefix = 'schemaContainer';
	this.schemaInfo = {name: name,
		arch: arch,
		id: id, remoteId: undefined, title: '', lastUpdate: undefined, state: schemaState.NEW};
	this.graph;
	this.creator;
	this.counter;
	this.json;
	this.card;
	this.container;
	this.paper;
	this.created = false;
}

function NoCreatedSchemaException(message) {
	this.message = message;
	this.name = 'NoCreatedSchemaException';
}
NoCreatedSchemaException.prototype.toString = function () {
	return this.message;
};

Schema.prototype.setGraphFromJson = function (graphJson) {
	if (!this.created) {
		throw new NoCreatedSchemaException('Graph and paper is not initialized yet.');
	}
	else {
		this.graph.fromJSON(graphJson);
		// potřeba inicialitovat counter;
	}
};

Schema.prototype.createGraph = function (createPaper, $mainContainer, callback) {
	this.container = $('<div id="' + this.schemaKeyPrefix + this.schemaInfo.id + '" class="paper"></div>');

	this.graph = new joint.dia.Graph;

	this.counter = new Counter();
	this.creator = new Creator(this.graph, this.counter);
	this.paper = createPaper(this.graph, this.container);
	$mainContainer.append(this.container);
	this.created = true;

	if (typeof callback == 'function') {
		callback();
	}

};

Schema.prototype.isCreated = function () {
	return this.created;
};

Schema.prototype.haveGraph = function () {
	return this.graph !== undefined;
};

Schema.prototype.minify = function () {
	return {json: this.json, schemaInfo: this.schemaInfo};
};