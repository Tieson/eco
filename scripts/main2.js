
/* global comm */

$(document).ready(main);


var serializer = new Serializer();
var schemaState = {NEW: 0, UNSAVED: 1, EDITED: 1, LOCAL: 2, OPENED: 2, SAVED: 2, REMOTE: 3};
var counterTypes = {SCHEMA: 'schema', SCHEMA_LIST: 'schemaList'};
var types = {IN: 'INPUT', OUT: 'OUTPUT', GATE: 'GATE', CLK: 'CLK'};


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

	//startAppSchemaInit();
	createSchema();

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
	 * Vytvoří instanci Schéma, přiřadí mu nové id a
	 * vytvoří všechny jeho závislé objekty (graf, plátno, handlery událostí a kartu)
	 * @returns {Schema|main.createSchema.sch}
	 */
	function createSchema() {
		console.log('Creating new schema');
		var number = localSchemasCounter.next(counterTypes.SCHEMA);
		var sch = new Schema('new_schema' + number, 'RTL', number);

		sch.createGraph(createPaper, $canvasWrapper);
		initGraphHandlers(sch);
		initPaperHandlers(sch);

		localSchemas.push(sch);
		// saveAddedSchema(sch);
		// addCard(sch);
		// showSchema(sch);

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
				console.log('Cell removed');
			});
			graph.on('add', function (cell) {
				console.log('New cell added to the graph.');
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
			element.remove();
		});
		var lastPosition = {x: null, y: null};
		paper.on('cell:pointerdown', function (cellView, evt, x, y) {
			try {
				lastPosition = {x: x, y: y};
			} catch (ex) {
				console.log('ERROR in pointerDown: ' + ex);
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
				console.log('ERROR in pointerUp: ' + ex);
			}
		});
	}


	function positionChanged(x) {
		console.log("position changed");
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



	/**
	 * Nastaví počáteční hodnoty čítačů ID pro jedntlivé typy entit v daném schéma.
	 * @param {Schema} schema
	 * @returns {undefined}
	 */
	function initilizeEntityCounters(schema) {
		var graph = schema.graph,
			counter = schema.counter;
		try {
			var elems = graph.getElements();

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
			console.log(ex);
		}
	}

	function createPaper(graph, paper) {
		var size = {width:2000,height:1200};
		var paper = new joint.dia.Paper({
			el: paper, // přiřazení ke canvasu
			width: size.width, // šířka canvasu
			height: size.height, // výška canvasu
			gridSize: 20, // velikost mřížky v canvasu : 1 pro jemný posun prvků
			snapLinks: true, //přichytávání linků
			linkPinning: false,
			defaultLink: new joint.shapes.mylib.Vodic, //definice výchozího linku
			model: graph, // druh modelu v canvasu

			drawGrid: {
				color: '#333',
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
		console.log('Exporting to VHDL.');
		var file_name = "test_circuit.vhd", schemaInfo = activeSchema.schemaInfo;
		var val1 = activeSchema.schemaInfo.name;
		var showSave;
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
				console.log('schow save');
				return true;
			};
			console.log('Supports download attribute.');
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





	/* INICIALIZACE handlerů */
	var dragIdentificator = '#canvasWrapper',
		dragDropZone = $(dragIdentificator);
	/* drag and drop pro načtení schéma */
	dragDropZone.on('dragover', handleDragOver);
	dragDropZone.on('drop', handleFileSelect);
	dragDropZone.on('dragenter', handleDragEnter);
	dragDropZone.on('dragleave', handleDragLeave);


	/**
	 * Kontrola importovaného VHDL souboru
	 * Naivní kontrola zda-li jde o vhd file
	 * @param {type} evt
	 * @returns {undefined}
	 */
	function handleFileSelect(evt) {
		console.log(evt);
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

}