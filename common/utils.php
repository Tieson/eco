<?php


/**
 * Vypíše JSON objekt s poppisem chyby a odešle ho jako JSON
 * @param $msg
 * @param int $status
 */
function responseError($msg, $status = 400) {
	$app = \Slim\Slim::getInstance();
	$app->response()->setStatus($status);
	$app->response()->headers->set('Content-Type', 'application/json');
	echo json_encode(array(
		'error' => array(
			'text' => $msg
		)
	));
}