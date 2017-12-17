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
	public static function formatPayload($username, $user_id, $email, $role = array('user'))
	{
		return array(
			'id' => $user_id,
			'name' => $username,
			'email' => $email,
			'role' => $role,
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

		var_dump($payload);
//		$user = user($payload['id']);
//		if ($user) {
//			var_dump($user);
//			echo '<br>';
//			var_dump($payload);
//		}

	}

	public static function authenticateForRole($role = 'member')
	{
//		$app = \Slim\Slim::getInstance();
//		$token = Util::getToken();



		return function () use ($role) {
			AuthRoute::validateToken();

//			$app = \Slim\Slim::getInstance();
//			$user = User::fetchFromDatabaseSomehow();
//			if ($user->belongsToRole($role) === false) {
//				$app->flash('error', 'Login required');
//				$app->redirect('/login');
//			}
		};
	}

}


function requestLoggedTeacher(){
//	$app = \Slim\Slim::getInstance();
	$teacher = null;
	if (isset($_SESSION['user_role']) && $_SESSION['user_role']=='teacher'){
		$teacher = array(
			"user_id" => $_SESSION['user_id'],
			"name" => $_SESSION['user_name'],
			"role" => $_SESSION['user_role'],
			"id" => $_SESSION['user_id'],
		);
	}else {
		throw new Exception('Nemáte potřebné oprávnění vyučujícího.');
	}
	return $teacher;
}

//function requestLoggedTeacher(){
////	$app = \Slim\Slim::getInstance();
//	$teacher = null;
//	if (isset($_SESSION['user_role']) && $_SESSION['user_role']=='teacher'){
//		$teacher = array(
//			"user_id" => $_SESSION['user_id'],
//			"name" => $_SESSION['user_name'],
//			"role" => $_SESSION['user_role'],
//			"id" => $_SESSION['user_id'],
//		);
//	}else {
//		throw new Exception('Nemáte potřebné oprávnění vyučujícího.');
//	}
//	return $teacher;
//}

function requestLoggedStudent(){
	$student = null;
	if (isset($_SESSION['user_role']) && $_SESSION['user_role']=='student'){
		$student = array(
			"user_id" => $_SESSION['user_id'],
			"name" => $_SESSION['user_name'],
			"role" => $_SESSION['user_role'],
			"id" => $_SESSION['user_id'],
		);
	}else {
		throw new Exception('Nemáte potřebné oprávnění studenta.');
//		echo "Nemáte potřebné oprávnění!";
//		exit();
	}
	return $student;
}
function requestLoggedAny(){
	$app = \Slim\Slim::getInstance();
	$user = null;
	if (isset($_SESSION['user_role']) && isset($_SESSION['user_id'])){
		$user = array(
			"user_id" => $_SESSION['user_id'],
			"name" => $_SESSION['user_name'],
			"role" => $_SESSION['user_role'],
			"id" => $_SESSION['user_id'],
		);
	}else {
		throw new Exception('Nemáte potřebné oprávnění.');
	}
	return $user;
}

function isStudent($user){
	return $user['role']==='student';
}
function isTeacher($user){
	return $user['role']==='teacher';
}