<?php


class Util
{

	public static $solutionStatuses = array(
		'waiting' => 'waiting',
		'processing' => 'processing',
		'done' => 'done',
	);

	public static $tasksFiletypes = array(
		'normal' => 'normal',
		'etalon' => 'etalon',
		'test' => 'test'
	);

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

	public static function getJwtData($token)
	{
		$result = array();
		$parts = explode('.', $token);
		if (count($parts)==3){
			$result['header'] = json_decode(base64_decode($parts[0]));
			$result['payload'] = json_decode(base64_decode($parts[1]));
			return $result;
		}else{
			throw new AuthorizationException("Authorization token have invalid length.");
		}
	}

	public static function clearBase64Encoding($data)
	{
		return str_replace('=', '', $data);
	}

	public static function getToken()
	{
		$app = \Slim\Slim::getInstance();
		$token = $app->request->headers->get('Authorization');
		if (!$token || empty($token)){
//			throw new AuthorizationException("No or empty Authorization header in HTTP.");
			$app->halt(403, "No or empty Authorization header in HTTP.");
		}
		return $token;
	}

	public static function validateEmail($email){
//		$email = self::testInput($email);
		if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
//			throw new InvalidArgumentException("Chybný formát e-mailu.");
			return FALSE;
		}
		return TRUE;
	}

	public static function testInput($data)
	{
		$data = trim($data);
		$data = stripslashes($data);
		$data = htmlspecialchars($data);
		return $data;
	}

	public static function hashPassword($data)
	{
		return hash('sha256', $data.Config::getKey('salt'));
	}

	public static function checkPassword($password, $password2)
	{
		if (Util::hashPassword($password) != Util::hashPassword($password2)){
			throw new InvalidArgumentException("Hesla se neshodují.");
		}
		if (Util::hashPassword($password)){
			throw new InvalidArgumentException("Heslo je příliš krátké.");
		}
		return TRUE;
	}

	public static function sendTokenByMail($mail, $name, $token){
		$subject=Config::getKey('activationMail/subject');
		$url = Config::getKey('activationMail/page');
		$mailSender = new Mail();
		$mailSender->addTo($mail, $name)
			->setFrom(Config::getKey('activationMail/from'),Config::getKey('activationMail/fromName'))
			->setSubject($subject)
			->setText(formatMailMessage($subject, self::getValidationTokenUrl($url,$token, 'activateAccount'), $url))
			->sendMail();
	}

	public static function getValidationTokenUrl($url, $token, $route) {
		return $url.$route."?token=".urlencode($token);
	}

}

class AuthorizationException extends Exception
{
	public function __construct($message, $code = 0, Exception $previous = null)
	{
		parent::__construct($message, $code, $previous);
	}
}class AccountActivationException extends Exception
{
	public function __construct($message, $code = 0, Exception $previous = null)
	{
		parent::__construct($message, $code, $previous);
	}
}