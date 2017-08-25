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


function requestLoggedTeacher(){
//	$app = \Slim\Slim::getInstance();
	$teacher = null;
	if (isset($_SESSION['user_role']) && $_SESSION['user_role']=='teacher'){
		$teacher = array(
			"user_id" => $_SESSION['user_id'],
			"name" => $_SESSION['user_name'],
			"role" => $_SESSION['user_role'],
			"id" => 9,
		);
	}else {
		throw new Exception('Nemáte potřebné oprávnění vyučujícího.');
	}
	return $teacher;
}