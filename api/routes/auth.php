<?php


class AuthRoute extends \Slim\Route
{
	public static function formatPayload($userId)
	{
		$user = Users::getUserDetail($userId);
		return array(
			'id' => $user['id'],
			'name' => $user['name'],
			'email' => $user['mail'],
			'role' => $user['type_uctu'],
		);
	}

	public static function createJwtHeader()
	{
		return array(
			'alg' => 'HS256',
			"typ" => "JWT"
		);
	}

	public static function testToken()
	{
		$app = \Slim\Slim::getInstance();
		$token = Util::getToken();
		var_dump($token);
		$app->stop();
	}

	public static function validateToken($new_payload)
	{
		//$token, $user_id, $password
		$token = Util::getToken();
		$data = Util::getJwtData($token);
//		$payload = $data['payload'];

//		var_dump($payload);

		$header = AuthRoute::createJwtHeader();
		$payload = self::formatPayload($data['payload']['id']); //AuthRoute::formatPayload($user['name'],$user['id'],$user['mail'],$user['type_uctu']);

		$correctToken = Util::jwtEncode($header,$payload,Config::getKey('token/secret'));

		if (!empty($token) && $token!==FALSE && $token === $correctToken) {
			return $token;
		}
		return FALSE;
	}

	public static function authenticateForRole($role = 'guest', $andSuperRoles = TRUE)
	{
		return function ($route = NULL) use ($role) {
//			$route->get('');
			$app = \Slim\Slim::getInstance();
//			if (self::isLogged()) {
//				if (self::hasRole($role)){
//
//				}
//			}
			try {
				AuthRoute::requestLogged($role);
			} catch (AuthorizationException $ex) {
//				$app->flash('error', 'Login required');
//				$projectDir = Config::getKey('projectDir');
//				$app->redirect($projectDir.'/login');
				Util::responseError($ex->getMessage(), 401);
				$app->stop();
			}
		};
	}

	public static function hasRole($role, $user = NULL)
	{
		if ($role==NULL){
			return TRUE;
		}
		if ($user==NULL) {
			return ($role != FALSE && ($_SESSION['user_role'] === $role || (is_array($role) && in_array($_SESSION['user_role'], $role))));
		}else {
			return ($role != FALSE && ($user['role'] === $role || (is_array($role) && in_array($user['role'], $role))));
		}
	}

	public static function isLogged(){
		$user = null;
		if (isset($_SESSION['user_role']) && isset($_SESSION['user_id'])){
			$user = array(
				"user_id" => $_SESSION['user_id'],
				"name" => $_SESSION['user_name'],
				"role" => $_SESSION['user_role'],
				"id" => $_SESSION['user_id'],
			);
		}else {
			return FALSE;
		}
		return $user;
	}

	public static function requestLogged($role){
		$teacher = null;
		if (isset($_SESSION['user_role']) && AuthRoute::hasRole($role)){
			$teacher = array(
				"user_id" => $_SESSION['user_id'],
				"name" => $_SESSION['user_name'],
				"role" => $_SESSION['user_role'],
				"id" => $_SESSION['user_id'],
			);
		}else {
			throw new AuthorizationException('Nemáte potřebné oprávnění!');
		}
		return $teacher;
	}

	public static function loginAdmin(){
			$user = array(
				'name'=> Config::getKey('admin/name'),
				'id'=> 0,
				'type_uctu'=> 'admin',
				'activated'=> 1,
			);
			return json_decode(json_encode($user), FALSE);
	}

	public static function login($email, $password)
	{
		if ($email === Config::getKey('admin/login') && $password === Config::getKey('admin/password')) {
			return self::loginAdmin();
		} else {
			$db = Database::getDB();
			$password_hash = Util::hashPassword($password);
			$user_prepare = $db->prepare("SELECT * FROM user WHERE mail = :mail AND (password = :password OR password IS NULL) LIMIT 1");
			$user_prepare->bindParam(':mail', $email, PDO::PARAM_STR);
			$user_prepare->bindParam(':password', $password_hash, PDO::PARAM_STR);

			$user_prepare->execute();
			$user = $user_prepare->fetchObject();

			if ($user) {
				try {
					if (!$user->activated) {
						$token = Util::getJwtData($user->token);
						$curTime = time();
						$created = $token['payload']->created;
						if (($curTime - $created) < Config::getKey('token/secondsLifetime')) {
							throw new AccountActivationException('E-mail nebyl ověřen. Oveřte prosím svůj e-mail pomocí odkazu zaslaného do vašeho e-mailu.');
						} else {
							throw new AccountActivationException('Vypršel limit pro ověření e-mailu, prosím znovu se registrujte.');
						}
					}
				} catch (AuthorizationException $ex) {
				}
				return $user;
			}
		}
		throw new AuthorizationException('Přihlašovací jméno nebo heslo není správné.');
	}

	const DEFINED_SESSIONS = array(
		'name' => 'user_name',
		'id' => 'user_id',
		'role' => 'user_role',
		'activated' => 'user_activated',
		'logged' => 'user_logged',
	);

	public static function setUserLogged($user){
		$_SESSION[self::DEFINED_SESSIONS['name']] = $user->name;
		$_SESSION[self::DEFINED_SESSIONS['id']] = $user->id;
		$_SESSION[self::DEFINED_SESSIONS['role']] = $user->type_uctu;
		$_SESSION[self::DEFINED_SESSIONS['activated']] = $user->activated;
		$_SESSION[self::DEFINED_SESSIONS['logged']] = TRUE;
	}

	public static function setUserUnlogged(){
		foreach (self::DEFINED_SESSIONS as $key => $name){
			unset($_SESSION[$name]);
		}
	}

}

function requestLoggedTeacher(){
	return AuthRoute::requestLogged('teacher');
}

function requestLoggedStudent(){
	return AuthRoute::requestLogged('student');
}

function requestLoggedAny(){
	return AuthRoute::requestLogged(NULL);
}

function isStudent($user){
	return AuthRoute::hasRole('student', $user);
}
function isTeacher($user){
	return AuthRoute::hasRole('teacher', $user);
}
function isGuest($user){
	return AuthRoute::hasRole('guest', $user);
}