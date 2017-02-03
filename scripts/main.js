
/* global comm */

$(document).ready(main);


var settings = {
	selCard: 0,
	selSchema: 0,
	schemaCounter: 0
};
/**
 * Lokálně uloží pomocná data ()
 * Pokud žádná data neexistují, tak uloží defaultní stav.
 * @returns {undefined}
 */
function loadSettings() {
	var temp = serializer.loadObject('settings');
	if (temp != null) {
		settings = temp;
	} else {
		saveSettings();
	}
}
/**
 * Načte lokálně uložená pomocná data
 * @returns {undefined}
 */
function saveSettings() {
	serializer.saveObject('settings', settings);
}


var schemaState = {NEW: 0, UNSAVED: 1, EDITED: 1, LOCAL: 2, OPENED: 2, SAVED: 2, REMOTE: 3};
var types = {IN: 'INPUT', OUT: 'OUTPUT', GATE: 'GATE', CLK: 'CLK'};

var serializer = new Serializer();
var counterTypes = {SCHEMA: 'schema', SCHEMA_LIST: 'schemaList'};


function log(message) {
	if (console && console.log) {
		console.log(message);
	}
}


function main() {
	var localSchemasCounter = new Counter();
	var $canvasWrapper = $('#canvasWrapper');
	var localSchemas = [],
			activeSchema;

	startAppSchemaInit();

	/**
	 * Načte všechna schémata uložená lokálně
	 * @returns {Array|Schema} Pole schémat
	 */
	function lc_loadSchemas() {
		var schemaList = serializer.loadObject(counterTypes.SCHEMA_LIST);
		var schemas = [], pocet = 0;
		if (schemaList != null) {
			for (var key in schemaList) {
				var item = schemaList[key];
				var schemaJson = serializer.loadGraphJSON(item);
				if (schemaJson != null && schemaJson != undefined) {
					var schema = new Schema(item.name, item.arch, item.id);
					schema.schemaInfo = item;
					schema.json = schemaJson;
					schemas.push(schema);
					localSchemasCounter.initCounterMax(counterTypes.SCHEMA, item.id);
					pocet++;
				}
			}
			pushNotification('Otevřeno schémat: ' + pocet);
		}
		return schemas;
	}

	/**
	 * Kompletně uloží schéma - vytvoří uložení (uloží seznam schémat a samotné upravené schéma)
	 * @param {Schema} schema
	 * @returns {undefined}
	 */
	function saveAddedSchema(schema) {
		saveSchemaInfoCollection();
		saveSchemaLocally(schema);
	}

	/**
	 * Lokálně uloží seznam otevřených schémat (pouze základní informace = bez dat grafu)
	 * @returns {undefined}
	 */
	function saveSchemaInfoCollection() {
		var stack = [];
		for (var i in localSchemas) {
			var schemaInfo = localSchemas[i].schemaInfo;
			stack.push(schemaInfo);
		}
		serializer.saveObject(counterTypes.SCHEMA_LIST, stack);
	}

	/**
	 * V lokálním uložišti uloží dané schéma
	 * @param {type} schema
	 * @returns {undefined}
	 */
	function saveSchemaLocally(schema) {
		var schemaInfo = schema.schemaInfo;
		serializer.saveGraph(schema);
		//pushNotification('Schéma ' + schemaInfo.name + ' bylo lokálně uloženo.');
	}

	/**
	 *
	 * @param {Schema} schema
	 * @returns {undefined}
	 */
	function synchronizeSchemaData(schema) {
		var info = schema.schemaInfo;
		var beforeUpdateTime = info.lastUpdate;
		if (info.remoteId == undefined) {
			comm.requestNewSchema(schema, function (result) {
				if (result.status == 'ok') {
					info.remoteId = result.schema.id;
					info.lastUpdate = result.schema.last_update;
					comm.requestSaveSchema(schema, function (result2) {
						pushNotification('Schéma ' + info.name + ' bylo uloženo na serveru..', messageType.OK);

					}, function (result2) {
						pushNotification("Chyba, schéma nebylo uloženo na serveru.", messageType.ERROR);
					});
					saveSchemaInfoCollection();
				} else if (result.status == 'auth failed') {
					log('Save request denied. User is not logged.');
				}
				else {
					pushNotification("Chyba, schéma nebylo vytvořeno na serveru.", messageType.ERROR);
				}
			});
		} else {
			comm.requestSaveSchema(schema, function (result) {
				if (result.status == 'ok') {
					pushNotification('Schéma ' + info.name + ' bylo uloženo na serveru.');
					if (beforeUpdateTime == info.lastUpdate) {
						info.lastUpdate = result.schema.last_update;
						saveSchemaInfoCollection();
					}
				} else if (result.status == 'auth failed') {
					log('Save request denied. User is not logged.');
				} else {
					pushNotification("Chyba, schéma nebylo uloženo na serveru.", messageType.ERROR);
				}
			}, function (XMLHttpRequest, textStatus, errorThrown) {
				pushNotification("Chyba, schéma nebylo uloženo na serveru.", messageType.ERROR);
			});
		}
		comm.requestUpdateSchema(schema, function (result) {
			//OK
		}, function (result) {
			//ERROR
		});
	}

	/**
	 * Save in localStorage the JSON representation of schema graph.
	 * @returns {undefined}
	 */
	function saveAllSchemaGraphs() {
		_.each(localSchemas, function (schema) {
			serializer.saveGraph(schema);
		});
	}

	/**
	 * Vytvoří instanci Schéma, přiřadí mu nové id a
	 * vytvoří všechny jeho závislé objekty (graf, plátno, handlery událostí a kartu)
	 * @returns {Schema|main.createSchema.sch}
	 */
	function createSchema() {
		log('Creating new schema');
		var number = localSchemasCounter.next(counterTypes.SCHEMA);
		var sch = new Schema('new_schema' + number, 'RTL', number);

		sch.createGraph(createPaper, $canvasWrapper);
		initGraphHandlers(sch);
		initPaperHandlers(sch);

		localSchemas.push(sch);
		saveAddedSchema(sch);
		addCard(sch);
		showSchema(sch);

		return sch;
	}

	/**
	 * Inicilizuje handlery událostí pro graf zadaného schématu
	 * @param {Schema} schema
	 * @returns {undefined}
	 */
	function initGraphHandlers(schema) {
		if (schema && schema.graph) {
			var graph = schema.graph;
			graph.on('remove', function (cell) {
				log('Cell removed');
			});
			graph.on('add', function (cell) {
				log('New cell added to the graph.');
			});
		}
	}

	/**
	 * Inicializuje obsluhu událostí pro paper zadaného schématu
	 * @param {Schema} schema
	 * @returns {undefined}
	 */
	function initPaperHandlers(schema) {
		var paper = schema.paper;
		// smazání prvku a odebrání z příslušných polí
		paper.on('cell:pointerdblclick', function (cellView, evt, x, y) {
			var element = cellView.model;
			schema.creator.removeElement(element);
		});
		var lastPosition = {x: null, y: null};
		paper.on('cell:pointerdown', function (cellView, evt, x, y) {
			try {
				lastPosition = {x: x, y: y};
			} catch (ex) {
				log('ERROR in pointerDown: ' + ex);
			}
		});
		paper.on('cell:pointerup', function (cellView, evt, x, y) {
			var id = cellView.model.id;
			if (lastPosition.x != x || lastPosition.y != y) {
				positionChanged(cellView.model);
				serializer.saveGraph(schema);
			}
			try {
			} catch (ex) {
				log('ERROR in pointerUp: ' + ex);
			}
		});
	}


	function positionChanged(x) {
		//log(x);
	}

	/**
	 * Vybere zadané schéma jako aktivní - zvýrazní se tab (card) tohoto schéma a
	 * schéma je zobrazeno.
	 * Aktivní schéma je použito při úpravách vyvolaných z menu (editace, odstranění, atd.)
	 * @param {Schema} schema
	 * @returns {undefined}
	 */
	function showSchema(schema) {
		$(".paper").hide();
		schema.container.fadeIn(200);
		activeSchema = schema;
		selectTab(schema.card);
	}


	/**
	 * Načte všechna schémata z lokálního uložiště, případně vytvoří nové čisté.
	 * @returns {undefined}
	 */
	function startAppSchemaInit() {
		loadSettings();
		var temp = lc_loadSchemas(); // načte seznam schémat z LS a vytvoří jejichobjekty
		if (temp != undefined && temp.length > 0) {
			localSchemas = temp;
			var schema;
			for (var i in localSchemas) {
				schema = localSchemas[i];

				schema.createGraph(createPaper, $canvasWrapper); // pro schéma načte a vytvoří graf a paper
				initGraphHandlers(schema);
				initPaperHandlers(schema);

				addCard(schema);

				if (schema.json != undefined) {
					schema.setGraphFromJson(schema.json);
					initilizeEntityCounters(schema);
					saveAddedSchema(schema);
				}
			}
			showSchema(schema); // zobrazí poslední schéma které bylo načteno
		} else {
			createSchema(); // pokud není uložené žádné schéma tak vytvoří nové čisté
		}
	}


	/* Obsluha tlačítek - nejen v menu */

	/**
	 * Vyvolá export schéma do vhdl souboru
	 */
	$('#export').click(function () {
		log("export trigged");
		if (exportToVHDL($(this))) {
			pushNotification('Export úspěšně dokončen.', messageType.OK);
		}
	});

	/**
	 * Vymaže všechna data v localstorage
	 */
	$('#clearLocalData').click(function () {
		if (confirm('All schemas will be deleted. Do you want to continue?')) {
			localStorage.clear();
			pushNotification("Local storage data was deleted.", messageType.VARN);
			location.reload();
		} else {
			return false;
		}
	});

	/**
	 * Spustí uložení schéma (schéma se ukládají také automaticky při většině úprav)
	 */
	$('#bttn_saveSchema').click(function () {
		synchronizeSchemaData(activeSchema);
		saveSchemaLocally(activeSchema);
		hideMenu();
	});
	$('#bttn_saveSchemaOnServer').click(function () {
		synchronizeSchemaData(activeSchema);
		saveSchemaLocally(activeSchema);
		hideMenu();
	});
	$('#addSchema').click(createNewSchemaHandler);
	$('#bttn_editSchema').click(function () {
		editSchema(activeSchema);
		return false;
	});
	$('#bttn_deleteSchemaLocal').on('click', function () {
		if (confirm('Schema ' + activeSchema.schemaInfo.name + ' (' + activeSchema.schemaInfo.id + ') will be deleted. Do you want to continue?')) {
			deleteSchema(activeSchema);
		}
		return false;
	});
	$('#bttn_closeSchema').on('click', function () {
		if (confirm('Schema ' + activeSchema.schemaInfo.name + ' (' + activeSchema.schemaInfo.id + ') will be closed. All unsynchronized changes will be dropped. Do you want to continue?')) {
			deleteSchema(activeSchema);
		}
		return false;
	});
	$('#bttn_deleteSchemaOnServer').on('click', function () {
		comm.requestDeleteSchema(activeSchema.schemaInfo, function (result) {
			activeSchema.schemaInfo.remoteId = undefined;
			activeSchema.schemaInfo.lastUpdate = undefined;
			pushNotification('Schéma bylo odstraněno ze serveru!', messageType.VARN);
		}, function (result) {
			log(result);
			pushNotification('Schéma se nepodařilo odstranit', messageType.ERROR);
		});
		return false;
	});
	$('#bttn_newSchema').click(createNewSchemaHandler);

	/* otevření schémat ze serveru */
	$('#bttn_openSchemas').click(function () {
		log('Display user schemas form server storage.');
		comm.requestGetSchemas(function (data) {
			var count = addToSchemaList(data.schemas);
			pushNotification('Nalezeno schémat: ' + count);
			$.fancybox({
				href: '#openSchemaList'
			});
		}, function (XMLHttpRequest, textStatus, errorThrown) {
			log("Seznam schémat se nepodařilo načíst. " + textStatus);
		});
	});

	/**
	 * Naplní tabulku seznamem entit
	 * @param {type} data
	 * @returns {Number}
	 */
	function addToSchemaList(data) {
		$('#schemasData tbody').empty();
		var count = 0, oneSchemaRow,
				maketa = $("#openSchItemTemplate .row");
		for (var dbItem in data) {
			oneSchemaRow = maketa.clone();
			if (_.find(localSchemas, function (sch) {
				return sch.schemaInfo.remoteId != undefined && sch.schemaInfo.remoteId == data[dbItem]['id'];
			}) != undefined) {
				continue;
			}
			var name = oneSchemaRow.find('.name');
			name.text(data[dbItem]['entity']);
			name.attr('title', data[dbItem]['title']);

			var architecture = oneSchemaRow.find('.arch');
			architecture.text(data[dbItem]['arch']);

			var open = oneSchemaRow.find('.button.open');
			open.data('remoteid', data[dbItem]['id']);

			open.on('click', function () {
				var remoteId = $(this).data('remoteid');
				var $self = $(this);

				comm.requestGetSchema(remoteId, function (data) {
					var result = data.schema;
					var schema = createSchema();
					schema.schemaInfo.name = result.entity;
					schema.schemaInfo.arch = result.arch;
					schema.schemaInfo.title = result.title;
					schema.schemaInfo.remoteId = result.id;
					schema.json = JSON.parse(result.graph);
					updateSchemaCart(schema);

					if (schema.json != undefined && schema.json != '') {
						schema.setGraphFromJson(schema.json);
						initilizeEntityCounters(schema);
						saveAddedSchema(schema);
					}

					$self.closest('.row').remove();
				}, function (data) {
					log('Načtení schéma ze serveru se nepovedlo');
				});

			});

			$('#schemasData tbody').append(oneSchemaRow);
			count++;
		}
		return count;
	}


	$(document).on('keydown', null, 'ctrl+s', function () {
		saveSchemaLocally(activeSchema);
		synchronizeSchemaData(activeSchema);
		return false;
	});

	/* kliknutí na entitu v rinbbon menu - přidání enitity*/
	$('#ribbonContent .entity').click(function () {
		pridej($(this).data('type'), $(this).text());
	});


	/**
	 * Odstraní schéma z lokálního uložiště a z aplikace (graf, kontejner plátna, schéma)
	 * @param {Schema} schema
	 * @returns {undefined}
	 */
	function deleteSchema(schema) {
		if (schema != undefined) {
			log('deleting schema: ' + schema.schemaInfo.name);
			localSchemas = _.filter(localSchemas, function (sch) {
				return sch.schemaInfo.id != schema.schemaInfo.id;
			});
			serializer.removeSchemaGraphJSON(schema);
			saveSchemaInfoCollection();
			schema.graph.clear(); // clear graph elements

			log(schema.container);
			log($canvasWrapper.find(schema.container).remove()); // delete paper container,
			removeCard(schema); // remove card
		}
		activeSchema = _.last(localSchemas);
		if (activeSchema == undefined) {
			localSchemasCounter.initCounter(counterTypes.SCHEMA, 0);
			createSchema();
		}
		showSchema(activeSchema);
	}


	/**
	 * Zobrazí a zpracuje formulář pro vytvoření nového schéma
	 * Vytvoří a nastaví hodnoty
	 * @returns {undefined}
	 */
	function createNewSchemaHandler() {
		log('Create schema!');
		var dialog = '#newSchema';
		$.fancybox({
			href: '#newSchema'
		});
		var $submit = $(dialog + ' form .button.ok');
		log($submit);

		$submit.off('click');
		$submit.on('click', function () {
			log('Potvrzeno vytvoření nového schéma');

			var result = getSchemaInfo($('#newSchema'));
			if (result != false) {
				var schema = createSchema(),
						schInfo = schema.schemaInfo;
				schInfo.name = result.name;
				schInfo.title = result.title;
				schInfo.arch = result.arch;
				updateSchemaCart(schema);
				showSchema(schema);
				saveSchemaInfoCollection();

				pushNotification("Bylo vytvořeno nové schéma.", messageType.INFO);
				$.fancybox.close();
				fillSchemaInfo({name: '', arch: '', title: ''}, $('#newSchema'));
				$submit.off('click');

				comm.requestNewSchema(schema, function (data) {
					pushNotification("Schéma " + data.result.schema.name + " bylo uloženo na vašem účtu.", messageType.OK);
				});
				return true;
			}
			return false;
		});


		hideMenu();
	}

	/**
	 * Zobrazí a zpracuje formulář pro editaci schéma, nastaví a aktualizuje všechny hodnoty
	 * @param {Schema} schema
	 * @returns {undefined}
	 */
	function editSchema(schema) {
		log('Editing schema!');
		var dialog = '#editSchema', schemaInfo = schema.schemaInfo;
		fillSchemaInfo(schemaInfo, $(dialog));
		$.fancybox({
			href: dialog
		});
		var $submit = $('#bttn_changeSchema');
		$submit.off('click');
		$submit.on('click', function () {
			log('Změna hodnot entity');

			var result = getSchemaInfo($('#editSchema'));
			if (result != false) {
				schemaInfo.name = result.name;
				schemaInfo.title = result.title;
				schemaInfo.arch = result.arch;
				pushNotification('Hodnoty byly změněny.', messageType.OK);
				saveSchemaInfoCollection();
				updateSchemaCart(schema);
				synchronizeSchemaData(schema);
				$.fancybox.close();
				$submit.off('click');
				return true;
			} else {
				pushNotification('Hodnoty nebyly změněny.', messageType.ERROR);
			}
			return false;
		});
		hideMenu();
	}


	/**
	 * Přidá schéma jako kartu na panel karet otevřených schémat.
	 * funkce
	 * @param {type} schema
	 * @returns {undefined}
	 */
	function addCard(schema) {
		var schemaInfo = schema.schemaInfo;
		var result = $('<div></div>', {
			class: 'schemaItem noselect', text: schemaInfo.name, 'data-id': schemaInfo.id
		});
		schema.card = result;
		result.dblclick(function () {
			editSchema(schema);
		});
		result.on('click', function () {
			showSchema(schema);
			log('Selected tab: ' + schemaInfo.name + ' (' + schemaInfo.id + ')');
		});
		$('#schemaList .wrapper .schemaListContainer').append(result);
	}

	function removeCard(schema) {
		$('#schemaList .schemaListContainer').find('.schemaItem[data-id="' + schema.schemaInfo.id + '"]').remove();
	}


	function updateSchemaCart(schema) {
		schema.card.text(schema.schemaInfo.name);
	}

	function selectTab($tab) {
		$('#schemaList .schemaItem').removeClass('active');
		$tab.addClass('active');
	}

	function getInput($input) {
		if ($input.val().trim() != '') {
			return $input.val().trim();
		}
		return '';
	}

	/* INICIALIZACE handlerů */
	var dragIdentificator = '#canvasWrapper',
			dragDropZone = $(dragIdentificator);
	/* drag and drop pro načtení schéma */
	dragDropZone.on('dragover', handleDragOver);
	dragDropZone.on('drop', handleFileSelect);
	dragDropZone.on('dragenter', handleDragEnter);
	dragDropZone.on('dragleave', handleDragLeave);





	function fillSchemaInfo(schemaInfo, parent) {
		if (schemaInfo != undefined) {
			parent.find('.f_entity').val(schemaInfo.name);
			parent.find('.f_arch').val(schemaInfo.arch);
			parent.find('.f_title').val(schemaInfo.title);
			parent.schema = schemaInfo;
		}

	}

	function getSchemaInfo(parentForm) {
		var name, arch, title;
		name = parentForm.find('.f_entity').val();
		arch = parentForm.find('.f_arch').val();
		title = parentForm.find('.f_title').val();
		var rxArchBlock = /^([a-zA-Z](_?[a-zA-Z0-9])*[a-zA-Z0-9]*)$/i;
		if (rxArchBlock.test(name) && rxArchBlock.test(arch)) {
			return {name: name, arch: arch, title: title};
		}
		pushNotification('Chybně jste vyplnili údaje, povolené znaky jsou pouze písmena a-z, číslovky a podtržítko. Název nesmí začínat číslem nebo podtržítkem, kterým nesmí ani končit.', messageType.VARN);
		return false;
	}

	/**
	 * Nastaví počáteční hodnoty čítačů ID pro jedntlivé typy entit v daném schéma.
	 * @param {Schema} schema
	 * @returns {undefined}
	 */
	function initilizeEntityCounters(schema) {
		var graph = schema.graph, counter = schema.counter;
		try {
			var elems = graph.getElements();
			log(elems);
			for (var i = 0; i < elems.length; i++) {
				var element = elems[i],
						custom = element.attr('custom');
				if (custom.type === types.GATE) {
					counter.initCounterMax(custom.name, custom.number);
				} else if (custom.name === types.CLK) {
					counter.initCounterMax(types.CLK, custom.number);
				} else {
					counter.initCounterMax(custom.type, custom.number);
				}
			}

		} catch (ex) {
			log(ex);
		}
	}

	function createPaper(graph, parent) {
		var sirka = 2600, vyska = 1800;
		var paper = new joint.dia.Paper({
			el: parent, // přiřazení ke canvasu
			width: sirka, // šířka canvasu
			height: vyska, // výška canvasu
			gridSize: 10, // velikost mřížky v canvasu : 1 pro jemný posun prvků
			snapLinks: true, //přichytávání linků
			defaultLink: new joint.shapes.mylib.Vodic, //definice výchozího linku
			model: graph, // druh modelu v canvasu
			drawGrid: {
				color: '#ccc',
				thickness: 1
			},
			validateConnection: function (vs, ms, vt, mt, e, vl)     // kontrola připojení do portů
			{
				if (e === 'target') {
					if (!mt || !mt.getAttribute('class') || mt.getAttribute('class').indexOf('input') < 0) {
						return false;
					}
					var portUsed = _.find(this.model.getLinks(), function (link) {
						return (link.id !== vl.model.id &&
						link.get('target').id === vt.model.id &&
						link.get('target').port === mt.getAttribute('port'));
					});
					return !portUsed;
				}
				else {
					return (ms && ms.getAttribute('class') && ms.getAttribute('class').indexOf('output') >= 0);
				}
			}
		});
		return paper;
	}


	function exportToVHDL(a) {
		log('Exporting to VHDL.');
		var file_name = "test_circuit.vhd", schemaInfo = activeSchema.schemaInfo;
		var val1 = activeSchema.schemaInfo.name;
		if (val1 == "" || val1 == null) {
		} else {
			file_name = val1 + ".vhd";
		}

		var vhdEx = new vhdExport();
		var content = vhdEx.exportSchema(schemaInfo, activeSchema.graph);
		var DownloadAttributeSupport = 'download' in document.createElement('a');
		if (DownloadAttributeSupport) {
			showSave = function (data, name) {
				var uriContent = 'data:application/octet-stream,' + encodeURIComponent(data);
				a.attr('href', uriContent);
				a.attr('download', name);
				a.attr('target', "_blank");
				log('schow save');
				return true;
			};
			log('Supports download attribute.');
		} else {
			showSave = function (data, name) {
				try {
					var blobObject = new Blob([data], {type: "application/octet-stream"});
					window.navigator.msSaveOrOpenBlob(blobObject, (name));
				}
				catch (ex) {
					window.BlobBuilder = window.BlobBuilder ||
							window.WebKitBlobBuilder ||
							window.MozBlobBuilder ||
							window.MSBlobBuilder;
					if (ex.name == 'TypeError' && window.BlobBuilder) {
						var bb = new BlobBuilder([data]);
						var blobObject = bb.getBlob("application/octet-stream");
						window.navigator.msSaveOrOpenBlob(blobObject, (name));
					}
					else {
						pushNotification('Uložení do souboru není ve vašem prohlížeči podporováno.', messageType.ERROR);
						return false;
					}
				}
				return true;
			};
		}
		return showSave(content, file_name);
	}

	/**
	 * přidání logických členů na plátno (do schéma)
	 * využívá Creator
	 *
	 * @param {type} a
	 * @param {type} label
	 * @returns {undefined}
	 */
	function pridej(a, label) {
		if (activeSchema == undefined || !activeSchema.isCreated()) {
			return false;
		}
		var creator = activeSchema.creator;
		var x = creator.createEntity(a, 140, 67);
		//prvky_used.push(x);

		if (a == types.IN) {
			creator.addInput(x);
		}
		else if (a == types.OUT)
		{
			creator.addOutput(x);
			var x1 = creator.createEntity("TUL_BUF", 50, 50);
			creator.addGate(x1, 'TUL_BUF', 'Buffer');
		}
		else if (a == types.CLK) {
			creator.addClock(x);
		}
		else {
			creator.addGate(x, a, label);
		}

		saveSchemaLocally(activeSchema);
	}

	/**
	 * Provádí export testbenche souboru
	 * @returns testbenche
	 */
	function tb_sem() {
		var soubor;
		var aa = [];
		var bb = [];
		var cc = [];
		var tb = [];
		var io = [];
		//var signaly = getSignals();
		var inouts = back_ios(io);
		var numero = 0;
		var clk_en = false;
		for (var i = 0; i < io.length; i++) {
			if (io[i].indexOf("x") == 0) {
				cc.push("\r\n\r\t" + io[i] + " <= input_stimuli(" + numero + ");");
				numero++;
			} else if (io[i].indexOf("c") == 0) {
				clk_en = true;
			}
			if (io[i].indexOf("c") != 0) {
				aa.push("\r\t\signal " + io[i] + " : std_logic;\r\n");
			}
			bb.push("\r\n\r\t\r\t\r\t" + io[i] + " => " + io[i]);
		}

		var val1 = document.getElementById("en_name").value; //jmeno entity, zjisteni a prirazeni defaultni hodnoty
		if (val1 == "" || val1 == null) {
			var c_name_en = "test_circuit";
		} else {
			var c_name_en = val1;
		}

		var val2 = document.getElementById("arch_name").value; //jmeno architektury, stejne jako entita
		if (val2 == "" || val2 == null) {
			var c_name_arch = "RTL";
		} else {
			var c_name_arch = val2;
		}

		soubor = fileLoader('tb_vzor.vhd');
		soubor = soubor.split("#");
		soubor[1] = c_name_en; // nazev zacatku entity tb
		soubor[3] = numero; // pocet vstupu bez clk
		soubor[5] = c_name_en; // nazev konce entity
		soubor[7] = c_name_arch; // nazev architektury
		soubor[9] = c_name_en; // nazev entity architektury
		soubor[11] = c_name_en; // nazev componenty
		soubor[13] = inouts; // definice portů
		soubor[15] = c_name_en; // název konce componenty
		if (clk_en == false) {
			soubor[17] = ""; // enabled if clk
			soubor[26] = ""; // enable if clk
		}
		soubor[19] = aa.join(""); // definice signálů
		soubor[21] = c_name_en; // nazev instance componenty
		soubor[23] = bb.join(","); // definice přiřazení portů
		soubor[25] = cc.join(""); // definice přiřazení input stimuli
		soubor[28] = c_name_arch; // nazev konce architektury

		return soubor.join("");
	}


	/**
	 * Kontrola importovaného VHDL souboru
	 * Naivní kontrola zda-li jde o vhd file
	 * @param {type} evt
	 * @returns {undefined}
	 */
	function handleFileSelect(evt) {
		log(evt);
		evt.originalEvent.stopPropagation();
		evt.originalEvent.preventDefault();
		$(dragIdentificator).removeClass('dragover');
		var files = evt.originalEvent.dataTransfer.files; // FileList object.
		var reader = new FileReader();
		var importer = new VhdImport();
		reader.onload = function (event) {
			var import_text = event.target.result;
			var test = import_text.split(";");
			if (test[0].trim().toLowerCase() == "library IEEE".toLowerCase()) {
				var schema = createSchema();
				importer.loadImportedSchema(import_text, schema);
				showSchema(schema);
				updateSchemaCart(schema);
				saveAddedSchema(schema);

				pushNotification("Schéma bylo úspěšně načteno z VHD souboru!", messageType.OK);
			} else {
				pushNotification("Vložili jste špatně formátovaný soubor.", messageType.VARN);
			}
		};
		reader.readAsText(files[0], "UTF-8");
	}

	function handleDragOver(evt) {
		$(dragIdentificator).addClass('dragover');
		evt.originalEvent.stopPropagation();
		evt.originalEvent.preventDefault();
		evt.originalEvent.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
	}

	function handleDragEnter(evt) {
		evt.originalEvent.preventDefault();
		$(dragIdentificator).addClass('dragover');
	}

	function handleDragLeave(evt) {
		evt.originalEvent.preventDefault();
		$(dragIdentificator).removeClass('dragover');
	}


	/**
	 * Kontroluje jestli jsou k dispozici potřebné metody pro import dat.
	 */
	function checkFileImport() {
		if (!(window.File && window.FileReader && window.FileList && window.Blob))
			alert("Některé z funkcí pro import souboru nemusí fungovat!");
	}

}