/* jshint devel: true */
'use strict';


var messageType = {
	INFO: 'info', //'Informační text',
	VARN: 'varning', //'Varovná zpráva',
	ERROR: 'error', //'Chybová zpráva',
	OK: 'ok'		//'pozitivní zpráva'
};

/**
 *
 * @param {string} msg
 * @param {messageType} msgType
 * @returns {undefined}
 */
function pushNotification(msg, msgType) {
	var ntf = $('<div/>', {class: 'item ' + msgType, text: msg});
	addNotificationHandlers(ntf);
	$('#notificationMessages').append(ntf);
}

function initNotifications() {
	addNotificationHandlers($('#notificationMessages .item'));
}

function addNotificationHandlers(notif) {
	notif.click(function () {
		$(this).remove();
	});
	notif.delay(7000).fadeOut(500, function () {
		$(this).remove();
	});
}