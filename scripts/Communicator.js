/* jshint devel: true */
'use strict';

var comm = {
	request: function (data, successHandler, errorHandler) {
		//data = $.param(data);

//		result = [];
		$.ajax({
			type: "POST",
			dataType: "json",
			url: "api.php",
			data: data,
			success: successHandler,
			error: errorHandler
		});
	},
	/**
	 * Vytvoří nové schém ana serveru - přihlášenému uživateli
	 * @param {Schema} schema
	 * @param {function} successHandler
	 * @returns {undefined}
	 */
	requestNewSchema: function (schema, successHandler) {
		log("requestNewSchema");
		log(schema.schemaInfo.name);
		comm.request({action: "createNewSchema", schemaInfo: schema.schemaInfo}, successHandler, function (XMLHttpRequest, textStatus, errorThrown) {
			pushNotification("Chyba při vytváření schéma", messageType.ERROR);
		});
	},
	/**
	 *
	 * @param {function} successHandler
	 * @returns {undefined}
	 */
	requestGetSchemas: function (successHandler, errorHandler) {
		log("requestGetSchemas");
		comm.request({action: "getUserSchemas"}, successHandler, errorHandler);
	},
	requestGetSchema: function (schemaId, successHandler, errorHandler) {
		log("requestGetSchema");
		comm.request({action: "getSchema", remoteId: schemaId}, successHandler, errorHandler);
	},
	requestSaveSchema: function (schema, successHandler, errorHandler) {
		log("requestSaveSchema");
		if (console && console.log) {
			console.log("ukládám na serveru!");
		}
		comm.request({action: "schemaSave", schema: {schemaInfo: schema.schemaInfo, graph: JSON.stringify(schema.graph.toJSON())}}, successHandler, errorHandler);
	},
	requestUpdateSchema: function (schema, successHandler, errorHandler) {
		log("requestUpdateSchema");
		comm.request({action: "schemaUpdateInfo", schemaInfo: schema.schemaInfo}, successHandler, errorHandler);
	},
	requestDeleteSchema: function (schemaInfo, successHandler, errorHandler) {
		log("requestDeleteSchema");
		comm.request({action: "deleteSchema", schemaInfo: schemaInfo}, successHandler, errorHandler);
	},
	requestSaveSchemaAs: function (schema, newsSchema, successHandler) {
		log("requestSaveSchemaAs");
		comm.request({action: "schemaSaveAs", schema: schema, newSchema: newsSchema}, successHandler, function (XMLHttpRequest, textStatus, errorThrown) {
			pushNotification("Schéma se nepodařilo na serveru uložit jako!", messageType.ERROR);
		});
	}
};