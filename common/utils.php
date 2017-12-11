<?php

class Util {

	public static function responseError($msg, $status = 400){
		$app = \Slim\Slim::getInstance();
		$app->response()->setStatus($status);
		$app->response()->headers->set('Content-Type', 'application/json');
		echo json_encode(array(
			'error' => array(
				'text' => $msg
			)
		));
	}
	public static function response($data, $status = 200){
		$app = \Slim\Slim::getInstance();
		$app->response()->setStatus($status);
		$app->response()->headers->set('Content-Type', 'application/json');
		echo json_encode($data);
	}

	public static function serveFile($filename, $content)
	{
		$length = strlen($content);

		header('Content-Description: File Transfer');
		header('Content-Type: text/plain');
		header('Content-Disposition: attachment; filename='.$filename);
		header('Content-Transfer-Encoding: binary');
		header('Content-Length: ' . $length);
		header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		header('Expires: 0');
		header('Pragma: public');

		echo $content;
	}
}


/**
 * Vypíše JSON objekt s poppisem chyby a odešle ho jako JSON
 * @param $msg
 * @param int $status
 */
function responseError($msg, $status = 400) {
	Util::responseError($msg, $status);
}


