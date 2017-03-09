/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* jshint devel: true */
'use strict';


function hideMenu() {
    $('#menu').removeClass('menuShown');
	$('#wrapper').removeClass('menuShown');
}


function initUI() {

	var ribbon_content = $('#ribbon #ribbonContent'),
			ribbon_titles = $("#ribbon .ribbon__menu__item"),
			platno = $('#moje_platno'),
			defaultCart = $('#ribbon .ribbon__menu__item.default'),
			wrapper = $('#canvasWrapper');

	// setCanvasHeight(wrapper);
	selectCategory(defaultCart);

	initNotifications();
	initCharCounting($('.charcount'), $('#ftext'));
	initPopups();


	/* skrytí všech položek rozbalovacího menu */
	$('#usermenu .item .menuitemsContainer').hide();


	/* handler pro přepínání jednotlivých karet ribbonu */
	ribbon_titles.click(ribbonTileClick);


	/*Vybrání kart, která byla naposledy vybrána (při reloadu)*/
	//$('.ribbonTitle[data-cat="' + settings.selCard + '"]').trigger("click");

	/* přepínání zobrazení ribbonu */
	$('#contentToggler').click(function () {
		/*ribbon_content.slideToggle(300, function () {
			// setCanvasHeight(wrapper);
		});*/
		$("#ribbon").toggleClass("ribbon--hidden");
	});

	/*
	$('.toggler').click(function () {
		var ident = $(this).data('cartContentId');
		$(ident).hide();
	});
	*/

	/* zobrazení/skrytí menu */
	$('#menuToggler').click(function () {
		$('#menu').toggleClass('menuShown');
		$('#wrapper').toggleClass('menuShown');
	});

	/* Skrytí menu při kliku mimo menu */
	$('.overlay, #menuCloser').click(hideMenu);



	/*$(window).resize(function () {
		setCanvasHeight(wrapper);
	});*/


	/* kliknutí na položku rozbalovacího menu */
	$('#usermenu .item .menuLabel').click(function () {
		var visClass = 'visible';
		var item = $(this).parent();
		var content = item.find('.menuitemsContainer');
		if (item.hasClass(visClass)) {
			content.slideUp(200);
			content.fadeOut();
			item.removeClass(visClass);
		} else {
			content.slideDown(200);
			item.addClass(visClass);
		}
	});

	function initPopups() {
		$(".popup").fancybox({});
	}

	function initCharCounting($counter, $text) {
		var cc = $counter,
				max = parseInt(cc.data('max')),
				text = $text;
		text.change(function () {
			var len = $(this).val().length;
			cc.text(max - len);
		});
		text.on("keyup", function () {
			var len = $(this).val().length;
			cc.text(max - len);
		});
	}

	function ribbonTileClick() {
		ribbon_titles.removeClass('selected');
		$(this).addClass('selected');
		//zmen_seznam($(this));
		var category = $(this).attr('data-cat');
		$('#ribbonContent .ribbon__contents__item').hide();
		$('#ribbonContent #ribbonCartId' + category).show();

		ribbon_content.slideDown(0, function () {
			// setCanvasHeight(wrapper);
		});
		// setCanvasHeight(wrapper);

		//settings.selCard = category;
		saveSettings();
	}

	function selectCategory(cat) {
		ribbon_titles.removeClass('selected');
		cat.addClass('selected');

		var category = cat.attr('data-cat');

		$('#ribbonContent .ribbonCart').hide();
		$('#ribbonContent #ribbonCartId' + category).show();

		ribbon_content.slideDown(0, function () {
			// setCanvasHeight(wrapper);
		});
		// setCanvasHeight(wrapper);
	}

	function setCanvasHeight(platno) {
		var ribbon = $('#ribbon');
		var top = ribbon.position().top;
		var bot = top + ribbon.height();
		platno.css("top", bot + "px");
	}

	countChars();
}

function countChars() {
	var cc = $('.charcount'),
			max,
			text;

	cc.each(function (index) {
		var ctElem = $(this);
		max = parseInt(ctElem.data('max')),
				text = $(ctElem.data('contentid'));
		if (text.length > 0) {
			text.change(function () {
				var len = $(this).val().length;
				cc.text(max - len);
			});
			text.on("keyup", function () {
				var len = $(this).val().length;
				cc.text(max - len);
			});
		}
	});

}


/**
 * Kontroluje jestli jsou k dispozici potřebné metody pro import dat.
 */
function checkFileImport() {
	if (!(window.File && window.FileReader && window.FileList && window.Blob))
		alert("Některé z funkcí pro import souboru nemusí fungovat!");
}

$(document).ready(initUI);