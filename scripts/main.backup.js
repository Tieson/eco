//Deklarace proměnných

var prvky_all;
var casti;
var prvky_used = [];
var io = [];
var hradla = [];
var poc_input = 1;
var poc_output = 1;
var poc_vcc = 1;
var poc_gnd = 1;
var poc_clk = 1;
var obsah;
var tb;
var info = [];
var info_io = [];
var import_text = "";

var sirka = parseInt(screen.width * 1);
var vyska = parseInt(screen.height * 1);

// definování grafu v canvasu
var graph = new joint.dia.Graph;

var paper = new joint.dia.Paper({
	el: $('#moje_platno'), // přiřazení ke canvasu
	width: sirka, // šířka canvasu
	height: vyska, // výška canvasu
	gridSize: 1, // velikost mřížky v canvasu : 1 pro jemný posun prvků
	snapLinks: true, //přichytávání linků
	defaultLink: new joint.shapes.mylib.Vodic, //definice výchozího linku
	model: graph, // druh modelu v canvasu
	validateConnection: function (vs, ms, vt, mt, e, vl)     // kontrola připojení do portů
	{
		if (e === 'target') {
			if (!mt || !mt.getAttribute('class') || mt.getAttribute('class').indexOf('input') < 0)
			{
				return false;
			}
			var portUsed = _.find(this.model.getLinks(), function (link) {
				return (link.id !== vl.model.id && link.get('target').id === vt.model.id && link.get('target').port === mt.getAttribute('port'));
			});

			return !portUsed;
		}
		else
		{
			return (ms && ms.getAttribute('class') && ms.getAttribute('class').indexOf('output') >= 0);
		}
	}
});

// smazání prvku a odebrání z příslušných polí
paper.on('cell:pointerdblclick', function (cellView, evt, x, y) {
	cellView.model.remove();
	var aa = info.indexOf(cellView.model.id);
	if (aa != -1) {
		info.splice(aa, 1);
		hradla.splice(aa, 1);
	}
	var bb = info_io.indexOf(cellView.model.id);
	if (bb != -1) {
		io.splice(bb, 1);
		info_io.splice(bb, 1);
	}
}
);

var field_wires;
var field_bas_com;
var field_adv_com;
var field_ari;
var field_bas_seq;
var field_adv_seq;
var temporary;
var file_name = "test_circuit";

function fakeItemLoader(a) {
	return "INPUT;OUTPUT;VCC;GND;CLK;BUF;INV-AND;AND3;AND4;OR;NAND;NAND3;NAND4;NOR;NOR3;NOR4;XOR;XNOR-MUX2;MUX4;MUX8;DEC14;DEC18;PRIOCOD42;PRIOCOD83-HALFADDER;FULLADDER;ADD4;MUL8;COMPARELEQ-RS;DL1;DL1AR;JKFF;JKFFAR;JKFFSR;DFF;DFFAR;DFFSR-UPDOWNCOUNTER;ARAM1x16;ARAM4x16;ARAM4x256;RAM1x16;RAM4x16;RAM4x256;DPRAM4x256";
}


function getAllEntities() {
	var posx, posy;
	var items = [];
	for (var i = 0; i < prvky_used.length; i++) {
		posx = prvky_used[i].attributes.position.x;
		posy = prvky_used[i].attributes.position.y;
		items.push(prvky_used[i].attributes.type + ":" + posx + "," + posy);
	}
	return items;
}

/**
 * Naplnění rozevíracího seznamu hradly,...
 * na základě vyhrané kategorie radiobutony (ve verzi toho času)
 * @returns {undefined}
 */
function fill_vars() {
	prvky_all = fakeItemLoader('seznam_prvku.txt');
	casti = prvky_all.split("-");
	field_wires = casti[0].split(";");
	field_bas_com = casti[1].split(";");
	field_adv_com = casti[2].split(";");
	field_ari = casti[3].split(";");
	field_bas_seq = casti[4].split(";");
	field_adv_seq = casti[5].split(";");
	zmen_seznam();

	var val1 = document.getElementById("en_name").value;     //jmeno entity, zjisteni a prirazeni defaultni hodnoty
	if (val1 != "" || val1 != null) {
		var file_name = val1;
	}
}
;

function del_seznam() {
	var x = document.getElementById("prvky");
	var y = x.length;
	for (var j = 0; j < y; j++) {
		x.remove(0);
	}
}
;

function zmen_seznam() {
	del_seznam();
	var selectedValue;
	var radios = document.getElementsByName("gr1");
	for (var i = 0; i < radios.length; i++) {
		if (radios[i].checked)
			selectedValue = radios[i].value;
	}
	switch (selectedValue) {
		case "wires":
			temporary = field_wires;
			break;
		case "bas_com":
			temporary = field_bas_com;
			break;
		case "adv_com":
			temporary = field_adv_com;
			break;
		case "ari":
			temporary = field_ari;
			break;
		case "bas_seq":
			temporary = field_bas_seq;
			break;
		case "adv_seq":
			temporary = field_adv_seq;
			break;
		default:
			temporary = "";
	}

	for (var i = 0; i < temporary.length; i++) {
		var drop_list = document.getElementById("prvky");
		var opt = temporary[i];
		var el = document.createElement("option");
		el.textContent = opt;
		el.value = opt;
		drop_list.appendChild(el);
	}
}

var instances = [];
/**
 * přidání logických členů na plátno (do schéma)
 * @returns {undefined}
 */
function pridej() {

	// vybraný prvek ze seznamu je načete jako string (např: "xor" nebo "INPUT")
	var a = document.getElementById("prvky").value;
	// vytvoření příkazu pro vytvoření prvku n adané výchozí pozici
	var b = "new joint.shapes.mylib." + a + "({position:{x:140,y:67}});";
	// genesis of item
	var x = eval(b);
	instances.push(x);

	// když je to vstup (to je jen jedno hradlo z celého seznau)
	if (a == 'INPUT') {
		x.attr('.label/text', 'X' + poc_input); // přidáme mu nějaký atribut... popisek X + číslo např.: X1, X2 ... autoincrement
		// potom ten vstup pojmenujem stejně jako jeho popisek
		a = 'X' + poc_input;
		// přidáme ho do seznamu vstupů/výstupů
		io.push(a.toLowerCase());
		poc_input++;
		graph.addCell(x); // a přidáme do grafu na canvas
		// info o jeho umístění (asi a nejspíš i něčeho jiného) do pole info_io s infem o vs/výstupech
		info_io.push(graph.getCell(x).id);
	}
	else if (a == 'OUTPUT')
	{
		x.attr('.label/text', 'Z' + poc_output);
		a = 'Z' + poc_output;
		io.push(a.toLowerCase());
		poc_output++;
		graph.addCell(x);
		info_io.push(graph.getCell(x).id);

		// výstup má následující (buffer) navíc oproti vstupu: ... stále nevím proč to je problém
		var e = "buf";
		var d = "new joint.shapes.mylib.BUF({position:{x:50,y:50}});";
		var y = eval(d);
		hradla.push(e);
		graph.addCell(y);
		info.push(graph.getCell(y).id);
	}
	// hodiny
	else if (a == 'CLK') {
		x.attr('.label/text', 'CLK' + poc_clk);
		a = 'CLK' + poc_clk;
		io.push(a.toLowerCase());
		poc_clk++;
		graph.addCell(x);
		info_io.push(graph.getCell(x).id);
	}
	// ostatní prvky gradla KO atp.
	else {
		// název ze seznamu. Bez čísla???
		a = a.toLowerCase();
		hradla.push(a);
		graph.addCell(x);
		info.push(graph.getCell(x).id);
	}
	// vložení do použitých hradel
	prvky_used.push(x);
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
	var signaly = napln_signaly();
	var hr_vv = napln_hradla();
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

	var val1 = document.getElementById("en_name").value;     //jmeno entity, zjisteni a prirazeni defaultni hodnoty
	if (val1 == "" || val1 == null) {
		var c_name_en = "test_circuit";
	} else {
		var c_name_en = val1;
	}

	var val2 = document.getElementById("arch_name").value;   //jmeno architektury, stejne jako entita
	if (val2 == "" || val2 == null) {
		var c_name_arch = "RTL";
	} else {
		var c_name_arch = val2;
	}

	soubor = fileLoader('tb_vzor.vhd');
	soubor = soubor.split("#");

	soubor[1] = c_name_en;       // nazev zacatku entity tb
	soubor[3] = numero;          // pocet vstupu bez clk
	soubor[5] = c_name_en;       // nazev konce entity
	soubor[7] = c_name_arch;     // nazev architektury
	soubor[9] = c_name_en;       // nazev entity architektury
	soubor[11] = c_name_en;      // nazev componenty
	soubor[13] = inouts;  // definice portů
	soubor[15] = c_name_en;      // název konce componenty
	if (clk_en == false) {
		soubor[17] = "";         // enabled if clk
		soubor[26] = "";         // enable if clk
	}
	soubor[19] = aa.join("");             // definice signálů
	soubor[21] = c_name_en;      // nazev instance componenty
	soubor[23] = bb.join(",");             // definice přiřazení portů
	soubor[25] = cc.join("");             // definice přiřazení input stimuli
	soubor[28] = c_name_arch;    // nazev konce architektury

	return soubor.join("");
}

/**
 * Zjištění všech signálů v grafu (repre. spojeními)
 * Ze spojení v grafu (schématu) to zjistí odkud kam vedou a vytvoří to spojení uložená v poli
 * orig. desc: "doplnění informací do souboru pro export"
 * každé spojení má název, id zdroje a cíle a port zdroje a cíle.
 * @returns {Array} pole spojení n x 5
 */
function napln_signaly() {
	var c = graph.getLinks();           //načtení všech linků do promenne c

	var signals = new Array(c.length);  //vytvoření pole signalu o velikosti počtu signálů

	for (var i = 0; i < c.length; i++) {             //uložení informací o signálech do pole
	signals[i] = new Array(5);
			signals[i][0] = "s" + i; //nazev signalu
			signals[i][1] = c[i].get('source').id; //kde signal zacina
			signals[i][2] = c[i].get('target').id; //kde signal konci
			signals[i][3] = c[i].get('source').port; //nazev portu zacatku
			signals[i][4] = c[i].get('target').port;  //nazev portu konce
	}
	return signals;
}


/**
 * Metoda generující obsah vhdl souboru (pro export) z vytvořeného schématu.
 * @returns {obsah|String}
 */
function obsah_sem() {
	var signals = napln_signaly();

//jmeno entity, zjisteni a prirazeni defaultni hodnoty
	var val1 = document.getElementById("en_name").value;
	if (val1 == "" || val1 == null) {
		var c_name_en = "test_circuit";
	} else {
		var c_name_en = val1;
	}

//jmeno architektury, stejne jako entita
	var val2 = document.getElementById("arch_name").value;
	if (val2 == "" || val2 == null) {
		var c_name_arch = "RTL";
	} else {
		var c_name_arch = val2;
	}

// print jednotlivých částí jako VHDL
	var hrd = back_hrd(hradla, signals, info);
	var sig = back_sig(signals);
	var ios = back_ios(io);
	var positions = getAllEntities().join(";");
			// struktura vystupniho souboru - celkové spojení
			obsah = "library IEEE;\r\nuse IEEE.std_logic_1164.all;\r\n\r\nentity " + c_name_en + " is\r\n" +
			"\tport (\r\n" +
			ios +
			"\t);\r\nend entity " + c_name_en + ";\r\n\r\n" +
			"architecture " + c_name_arch + " of " + c_name_en + " is\r\n" +
			sig +
			"\r\n" +
			"begin" +
			hrd +
			"\r\nend architecture " + c_name_arch + ";\r\n" +
			"\r\n --" + positions;

	return obsah;
}


//naplneni pole infa o hradlech i s nazvy (pouze id název a ještě nějaké blbosti)
function full_info() {
	var cis = 0;
	var hradla_info = new Array(hradla.length);
	for (var i = 0; i < hradla.length; i++) {
		hradla_info[i] = new Array(2);
		hradla_info[i][0] = "_";
		hradla_info[i][1] = "_";
	}

	for (var j = 0; j < hradla.length; j++) {
		for (var k = 0; k < hradla_info.length; k++) {
			var tempe = hradla_info[k][1].split("_");
			if (tempe[0] == hradla[j]) {
				cis++;
			}
		}
		hradla_info[j][0] = info[j];
		hradla_info[j][1] = hradla[j] + "_" + cis;
		cis = 0;
	}
	return hradla_info;
}

/**
 * Vypíše jako VHDL signály používané uvnitř architektury entity
 * Vnitřní signály jsou (jako porty) std_logic
 * @param {type} signals
 * @returns {String}
 */
function back_sig(signals) {
	var s = [];
	var t = [];
	var all_hradla = full_info();
	var write = true;
	var write2 = true;
	for (var i = 0; i < signals.length; i++) {
		for (var j = 0; j < all_hradla.length; j++) {
			if (all_hradla[j][0] == signals[i][1]) {
				for (var k = 0; k < s.length; k++) {
					var tm = s[k].split(" ");
					if (tm[1] == all_hradla[j][1]) {
						write = false;
					}
				}
				if (write == true) {
					s.push("\tsignal " + all_hradla[j][1] + "_" + signals[i][3] + " : std_logic;\r\n");
					write = true;
				}
				write = true;
			}
		}
	}
	for (var k = 0; k < s.length; k++) {
		for (var l = k + 1; l <= s.length; l++) {
			if (s[k] == s[l]) {
				write2 = false;
			}
		}
		if (write2 == true) {
			t.push(s[k]);
			write2 = true;
		}
		write2 = true;
	}

	return t.join("");
}


/**
 * It's MAGIC
 * Plní to pole hradly
 * @returns {napln_hradla.naplneno|Array}
 */
function napln_hradla() {
	var naplneno = [];
	var numb = 0;

	for (var i = 0; i < hradla.length; i++) {
		var tmp = hradla[i];
		for (var k = 0; k < naplneno.length; k++) {
			var tmp2 = naplneno[k].split("_");
			if (tmp2[0] == tmp) {
				numb++;
			}
		}
		naplneno.push(tmp + "_" + numb);
		numb = 0;
	}
	return naplneno;
}

/**
 * Převedení hradel v architektuře do VHDL
 *
 * @param {type} hradla
 * @param {type} signals
 * @param {type} info
 * @returns {String}
 */
function back_hrd(hradla, signals, info) {
	var t = [];
	var v = napln_hradla();


	for (var h = 0; h < v.length; h++) {
		var temp = v[h].split("_");
		var sigs = back_sigs(hradla, signals, info, h, v);
		t.push("\r\n\t" + v[h] + " : entity work." + temp[0] + "\r\n\tport map(" + sigs + ");\r\n");
	}
	return t.join("");
}

/**
 * Tisk portů (Vstupů/Výstupů) viditelných zvenčí entity do VHDL
 * Každý vstup a výstup je jednobitový (resp. 3 stavový) std_logic
 * @param {type} ios pole vstupů a výstupů entity (jejich názvy)
 * @returns {String} porty ve VHDL
 */
function back_ios(ios) {
	var v = [];
	for (var b = 0; b < ios.length; b++) {
		if (b == ios.length - 1) {
			if (ios[b].indexOf("z") == 0) {
				v.push("\t\t" + ios[b].toLowerCase() + " : out std_logic\r\n");
			} else {
				v.push("\t\t" + ios[b].toLowerCase() + " : in std_logic\r\n");
			}
		} else {
			if (ios[b].indexOf("z") == 0) {
				v.push("\t\t" + ios[b].toLowerCase() + " : out std_logic;\r\n");
			} else {
				v.push("\t\t" + ios[b].toLowerCase() + " : in std_logic;\r\n");
			}
		}
	}
	return v.join("");
}


/**
 * sestavení port mapy pro jednotlivá hradla
 * potmap ve VHDL
 *
 * @param {string[]} hradla pole hradel v textové podobě
 * @param {type} signals pole signálů - spojení mezi porty hradel
 * @param {type} info
 * @param {int} h počet hradel ve schématu
 * @param {type} v_h
 * @returns {String} port map ve VHDL
 */
function back_sigs(hradla, signals, info, h, v_h) {
	var z = [];
	var prom = "";
	var vse = full_info();

	for (var a = 0; a < signals.length; a++) {
		if (info[h] == signals[a][2]) {
			var tmp = info_io.indexOf(signals[a][1]);
			if (tmp >= 0) {
				var tmp2 = io[tmp];
				z.push(signals[a][4] + " => " + tmp2);
			} else {
				for (var f = 0; f < vse.length; f++) {
					if (vse[f][0] == signals[a][1]) {
						z.push(signals[a][4] + " => " + vse[f][1] + "_" + signals[a][3]);
					}
				}
			}
		}

		if (info[h] == signals[a][1]) {
			var tmp3 = info_io.indexOf(signals[a][2]);
			if (tmp3 != -1) {
				var tmp4 = io[tmp3];
				z.push(signals[a][3] + " => " + tmp4);
			} else {
				for (var g = 0; g < vse.length; g++) {
					if (vse[g][0] == signals[a][1]) {
						var tmp5 = signals[a][3] + " => " + vse[g][1] + "_" + signals[a][3];
						if (z.indexOf(tmp5) == -1) {
							z.push(tmp5);
						}
					}
				}
			}
		}
	}

	return z.join(",");
}

/**
 * Kontrola importovaného VHDL souboru
 * Naivní kontrola zda-li jde o vhd file
 * @param {type} evt
 * @returns {undefined}
 */
function handleFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	var files = evt.dataTransfer.files; // FileList object.
	var reader = new FileReader();
	reader.onload = function (event) {
		import_text = event.target.result;
		var test = import_text.split(";");
		if (test[0] == "library IEEE") {
			importuj(import_text);
			alert("Soubor úspěšně načten!");
		} else {
			alert("Vložen špatný soubor");
		}
	}
	reader.readAsText(files[0], "UTF-8");
}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
}

// Setup the dnd listeners.
var dropZone = document.getElementById('div1');
dropZone.addEventListener('dragover', handleDragOver, false);
dropZone.addEventListener('drop', handleFileSelect, false);

// metoda pro kontrolu možnosti importu
function kontrola() {
	if (window.File && window.FileReader && window.FileList && window.Blob) {
		alert("Upozornění pro uživatele Internet Exploreru:\t\nExport vytvoří výstupní soubory,\t\nznovu načte stránku a schéma smaže!\t\nPro správnou funkci doporučuji stáhnout jiný prohlížeč... ");
	} else {
		alert("Některé z funkcí pro import souboru nemusí fungovat");
	}
}
;

/**
 * Tato metoda importuje schéma z vhdl souboru (by měla)
 * @param {type} import_text
 * @returns {undefined}
 */
function importuj(import_text) {

	//jakože cože? žeby globální proměnné!
	prvky_all;
	prvky_used = [];
	io = [];
	hradla = [];
	poc_input = 1;
	poc_output = 1;
	poc_vcc = 1;
	poc_gnd = 1;
	poc_clk = 1;
	info = [];
	info_io = [];
	graph.clear(); // vyčištění plochy, asi yb se to mělo zeptat pokud tak už něco máš, případně to otepřít v další záložce

	var im_inout = napln_inout(import_text);
	var im_signals = napln_sigy(import_text);
	var im_hradla = napln_hradla(import_text);
	var im_portmap = napln_port_map(import_text);
	var im_hrd_cis = get_hrd_cis(import_text);

	var im_nazev_en = napln_nazev_en(import_text);
	var im_nazev_arch = napln_nazev_arch(import_text);

	// asi to mocné vkládání
	im_insert(im_inout, im_signals, im_hradla, im_portmap, im_hrd_cis);

	function napln_inout(import_text) {
		var imp_in_out = [];

		var porty = import_text.split("(");
		porty = porty[1].split(")");
		porty = porty[0].split(";");

		for (var i = 0; i < porty.length; i++) {
			var temp = porty[i].split(" ");
			imp_in_out.push(temp[0]);
		}

		return imp_in_out;
	}

	function napln_sigy(import_text) {
		var imp_sig = [];

		var sign = import_text.split("is");
		sign = sign[2].split("begin");
		sign = sign[0].split(";");

		for (var i = 0; i < sign.length - 1; i++) {
			var temp = sign[i].split(" ");
			imp_sig.push(temp[1]);
		}
		return imp_sig;
	}
	;

	function napln_hradla(import_text) {
		var imp_hradla = [];

		var hrdl = import_text.split("begin");
		hrdl = hrdl[1].split("end");
		hrdl = hrdl[0].split(";");

		for (var i = 0; i < hrdl.length - 1; i++) {
			var tempor = hrdl[i].split(" ");
			tempor = tempor[0].split("\t");

			var tempor_2 = tempor[1].split("_");

			tempor_2 = tempor_2[0];

			imp_hradla[i] = tempor_2;
		}
		return imp_hradla;
	}
	;

	function get_hrd_cis(import_text) {
		var hrd_cis = [];

		var hrdl = import_text.split("begin");
		hrdl = hrdl[1].split("end");
		hrdl = hrdl[0].split(";");

		for (var i = 0; i < hrdl.length - 1; i++) {
			var tempor = hrdl[i].split(" ");
			tempor = tempor[0].split("\t");

			var psh = tempor[1].split(",");
			hrd_cis.push(psh);
		}
		return hrd_cis;
	}
	;

	function napln_port_map(import_text) {
		var imp_port_map = [];

		var ports = import_text.split("begin");
		ports = ports[1].split("end");
		ports = ports[0].split(";");

		for (var i = 0; i < ports.length - 1; i++) {
			var temp = ports[i].split("(");
			var temp2 = temp[1].split(")");
			imp_port_map.push(temp2[0]);
		}
		return imp_port_map;
	}
	;

	function napln_nazev_en(import_text) {
		var nazev_en;

		var tmp = import_text.split("entity");
		tmp = tmp[1].split("is");
		nazev_en = tmp[0];

		return nazev_en;
	}
	;

	function napln_nazev_arch(import_text) {
		var nazev_arch;

		var tmp = import_text.split("architecture");
		tmp = tmp[1].split("of");
		nazev_arch = tmp[0];

		return nazev_arch;
	}
	;
}


/**
 * Hnusná neznámá funkce co nejspíš něco vkládá
 * @param {type} im_in
 * @param {type} im_si
 * @param {type} im_hr
 * @param {type} im_po
 * @param {type} im_hr_cis
 * @returns {undefined}
 */
function im_insert(im_in, im_si, im_hr, im_po, im_hr_cis) {
	var in_pos_y = 100;
	var out_pos_y = 100;
	var hr_pos_y = 100;
	var hr_pos_x = 280;
	var step = 0;

	for (var i = 0; i < im_in.length; i++) {
		var tmp = im_in[i].split("");
		var a = tmp[4];

		if (a == 'x') {
			a = "INPUT";
		} else if (a == 'z') {
			a = "OUTPUT";
		}
		else if (a == 'c') {
			a = "CLK";
		}

		if (a == 'INPUT') {
			var b = "new joint.shapes.mylib." + a + "({position:{x:140,y:" + in_pos_y + "}});";
			in_pos_y += 70;
			var x = eval(b);

			x.attr('.label/text', 'X' + poc_input);
			a = 'X' + poc_input;
			io.push(a.toLowerCase());
			poc_input++;
			graph.addCell(x);
			info_io.push(graph.getCell(x).id);
		}
		else if (a == 'OUTPUT')
		{
			var b = "new joint.shapes.mylib." + a + "({position:{x:940,y:" + out_pos_y + "}});";
			out_pos_y += 70;
			var x = eval(b);

			x.attr('.label/text', 'Z' + poc_output);
			a = 'Z' + poc_output;
			io.push(a.toLowerCase());
			poc_output++;
			graph.addCell(x);
			info_io.push(graph.getCell(x).id);
		}
		else if (a == 'CLK') {
			var b = "new joint.shapes.mylib." + a + "({position:{x:140,y:" + in_pos_y + "}});";
			in_pos_y += 70;
			var x = eval(b);

			x.attr('.label/text', 'CLK' + poc_clk);
			a = 'CLK' + poc_clk;
			io.push(a.toLowerCase());
			poc_clk++;
			graph.addCell(x);
			info_io.push(graph.getCell(x).id);
		}
	}

	for (var j = 0; j < im_hr.length; j++) {
		var tmp = im_hr[j].split(" ");
		tmp = tmp[0].split("_");
		a = tmp[0].toUpperCase();

		if (a == "GND" || a == "VCC") {
			var b = "new joint.shapes.mylib." + a + "({position:{x:140,y:" + in_pos_y + "}});";
			in_pos_y += 70;
			var x = eval(b);
		}
		else {
			var b = "new joint.shapes.mylib." + a + "({position:{x:" + hr_pos_x + ",y:" + hr_pos_y + "}});";
			if (step >= 1) {
				hr_pos_x += 180;
				hr_pos_y = 100;
				step = 0;
			}
			else {
				step++;
				hr_pos_y += 180;
			}
			var x = eval(b);
		}

		a = a.toLowerCase();
		hradla.push(a);
		graph.addCell(x);
		info.push(graph.getCell(x).id);
	}


	for (var k = 0; k < im_po.length; k++) {
		var aa = im_po[k].split(",");
		for (var l = 0; l < aa.length; l++) {
			var source_id;
			var source_port;
			var target_id;
			var target_port;

			var temp = aa[l].split(" => ");
			target_port = temp[0];
			target_id = info[k];

			var temp2 = temp[1].split("_");
			var control = temp2[0].split("");

			if (control[0] == "x" || control[0] == "c") {
				var cis = io.indexOf(temp2[0]);
				source_id = info_io[cis];
				source_port = "q";
			}
			else if (control[0] == "z") {
				var cis = io.indexOf(temp2[0]);
				source_id = info_io[cis];
				source_port = "a";
			} else {
				var spojeni = temp2[0] + "_" + temp2[1];
				for (var m = 0; m < im_hr_cis.length; m++) {
					if (im_hr_cis[m] == spojeni) {
						source_id = info[m];
					}
				}
				source_port = temp2[2];
			}

			var bb = target_port.split("");
			if ((bb[0] != "q") && (bb[0] != "y") && (bb[0] != "v")) {
				var ln = "new joint.shapes.mylib.Vodic({ source: { id: '" + source_id + "', port: '" + source_port + "' }, target: { id: '" + target_id + "', port: '" + target_port + "' }});";
				var lm = eval(ln);
				graph.addCell(lm);
			} else if (bb[0] == "q" && control[0] == "z") {
				var ln = "new joint.shapes.mylib.Vodic({ source: { id: '" + source_id + "', port: '" + source_port + "' }, target: { id: '" + target_id + "', port: '" + target_port + "' }});";
				var lm = eval(ln);
				graph.addCell(lm);
			}
		}
	}
}


/**
 * metoda pro exportování schematu do vhdl - respektive vytvoření souboru a jeho "stažení"
 * @param element a je tlačítko které vyvolalo akci pro uložení (voláno 2 tl.: TestBenche a Export)
 * @param string what je pro rozlišení mezi tb a exp
 * @param string content je obsah souboru který se má uložit. Je generován funkcí tb_sem() nebo pro tb a obsah_sem() pro exp
 * @returns nothing
 */
function save(a, what, content) {
	var jm_file;
	//jmeno entity, zjisteni a prirazeni defaultni hodnoty
	var val1 = document.getElementById("en_name").value;
	if (val1 == "" || val1 == null) {
		var file_name = "test_circuit";
	} else {
		var file_name = val1;
	}

	contentType = 'data:application/octet-stream,';
	uriContent = contentType + encodeURIComponent(content);
	if (what == 'tb') {
		jm_file = file_name + "_tb.vhd";
	}
	else {
		jm_file = file_name + ".vhd";
	}

	a.setAttribute('href', uriContent);
	a.setAttribute('download', jm_file);
}
/**
 * Stažení/export souboru pro IE - WTF???
 * @returns nothing
 */
function doIt() {
	var val1 = document.getElementById("en_name").value;
	//jmeno entity, zjisteni a prirazeni defaultni hodnoty
	if (val1 == "" || val1 == null) {
		var file_name = "test_circuit";
	} else {
		var file_name = val1;
	}

	var data = obsah_sem();
	var data2 = tb_sem();
	var fileData = [data];
	var fileData2 = [data2];
	blobObject = new Blob(fileData);
	blobObject2 = new Blob(fileData2);
	window.navigator.msSaveOrOpenBlob(blobObject, (file_name + ".vhd"));
	window.navigator.msSaveOrOpenBlob(blobObject2, (file_name + "_tb.vhd"));
}