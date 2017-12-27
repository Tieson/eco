<?php

//$app->map('/login', function () use ($app) {
//
//// Test for Post & make a cheap security check, to get avoid from bots
//	if ($app->request()->isPost() && sizeof($app->request()->post()) > 2) {
//// Don't forget to set the correct attributes in your form (name="user" + name="password")
//		$post = (object)$app->request()->post();
//
//		if (isset($post->user) && isset($post->passwort)) {
//			$app->setEncryptedCookie('my_cookie', $post->password);
//			$app->redirect('admin');
//		} else {
//			$app->redirect('login');
//		}
//	}
//// render login
//	$app->render('default.tpl');
//
//})->via('GET', 'POST')->name('login');


class AuthRoute extends \Slim\Route
{
	public static function formatPayload($username, $user_id, $email, $role = 'guest')
	{
		return array(
			'id' => $user_id,
			'name' => $username,
			'email' => $email,
			'role' => $role,
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

	public static function validateToken()
	{
		//$token, $user_id, $password
		$token = Util::getToken();
		$data = Util::getJwtData($token);
		$payload = $data['payload'];

//		var_dump($payload);
		$user = Users::getUserDetail($payload['id']);

		$header = AuthRoute::createJwtHeader();
		$payload = AuthRoute::formatPayload($user['name'],$user['id'],$user['mail'],$user['type_uctu']);

		$correctToken = Util::jwtEncode($header,$payload,Config::getKey('secret'));

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
			return ($role != FALSE && ($_SESSION['user_role'] === $role || (is_array($user['role']) && in_array($role, $_SESSION['user_role']))));
		}else {
			return ($role != FALSE && ($user['role'] === $role || (is_array($user['role']) && in_array($role, $user['role']))));
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
			throw new AuthorizationException('Nemáte potřebné oprávnění ('.$role.').');
		}
		return $teacher;
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