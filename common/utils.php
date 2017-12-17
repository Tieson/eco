<?php

class Util
{

	public static function responseError($msg, $status = 400)
	{
		$app = \Slim\Slim::getInstance();
		$app->response()->setStatus($status);
		$app->response()->headers->set('Content-Type', 'application/json');
		echo json_encode(array(
			'error' => array(
				'text' => $msg
			)
		));
	}

	public static function response($data, $status = 200)
	{
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
		header('Content-Disposition: attachment; filename=' . $filename);
		header('Content-Transfer-Encoding: binary');
		header('Content-Length: ' . $length);
		header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		header('Expires: 0');
		header('Pragma: public');

		echo $content;
	}

	public static function jwtEncode($header, $payload, $secret)
	{
		$data = base64_encode(json_encode($header)) . '.' . base64_encode(json_encode($payload));
		$clear_data = self::clearBase64Encoding($data);
		$result = hash_hmac('sha256', $clear_data, $secret, TRUE);
		$complete = $clear_data . '.' . self::clearBase64Encoding(base64_encode($result));
		return $complete;
	}

	public static function getJwtData($jwtData)
	{
		$result = array();
		$parts = explode('.', $jwtData);
		$result['header'] = json_decode(base64_decode($parts[0]));
		$result['payload'] = json_decode(base64_decode($parts[1]));

		return $result;
	}

	public static function clearBase64Encoding($data)
	{
		return str_replace('=', '', $data);
	}

	public static function getToken()
	{
		$app = \Slim\Slim::getInstance();
		return $app->request->headers->get('Authorization');
	}
}


/**
 * Vypíše JSON objekt s poppisem chyby a odešle ho jako JSON
 * @param $msg
 * @param int $status
 */
function responseError($msg, $status = 400)
{
	Util::responseError($msg, $status);
}


