
<?php
session_cache_limiter(false);
session_start();

$config = require('./config/config.php');

$basedir = $config['basepath'];

require $basedir.$config['vendor'].'autoload.php';

$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;
//$config['cookies.encrypt'] = true;

function getDB()
{
	global $config;
	$dbhost = $config['db']['host'];
	$dbuser = $config['db']['user'];
	$dbpass = $config['db']['password'];
	$dbname = $config['db']['database'];

	$mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname;charset=utf8";
	$dbConnection = new PDO($mysql_conn_string, $dbuser, $dbpass);
	$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbConnection;
}
$app = new \Slim\Slim(["settings" => $config]);

$authenticate = function ($app) {
	return function () use ($app) {
		if (!isset($_SESSION['user_id'])) {
			$_SESSION['urlRedirect'] = $app->request()->getPathInfo();
//			$app->flash('error', 'Login required');
			$app->redirect('/login');
		}
	};
};

$authenticateTeacher = function ($app) {
	return function () use ($app) {
		if (isset($_SESSION['user_id']) && isset($_SESSION['user_role']) && $_SESSION['user_role']=='teacher') {

		} else {
			$_SESSION['urlRedirect'] = $app->request()->getPathInfo();
//			$app->flash('error', 'Login required');
			$app->redirect('/login');
		}
	};
};


function setSessionDataToView($app, $collection){
	foreach ($collection as $key){
		$value = null;
		if(isset($_SESSION[$key])){
			$value = $_SESSION[$key];
		}
		$app->view()->setData($key, $value);
	}
}
function setNullDataToViewAndUnset($app, $collection){
	foreach ($collection as $key){
		unset($_SESSION[$key]);
		$app->view()->setData($key, null);
	}
}

$app->hook('slim.before.dispatch', function() use ($app) {
	setSessionDataToView($app, array(
		'user_id',
		'user_name',
		'user_role',
		'user_logged',
	));
});

$app->get('/', function() use($app) {
	$app->response->setStatus(200);
	$app->render('homepage.php');
});

$app->get("/login", function () use ($app) {
	$app->response->setStatus(200);
	$flash = $app->view()->getData('flash');
	$error = '';
	if (isset($flash['error'])) {
		$error = $flash['error'];
	}
	$urlRedirect = '/';
	if ($app->request()->get('r') && $app->request()->get('r') != '/logout' && $app->request()->get('r') != '/login') {
		$_SESSION['urlRedirect'] = $app->request()->get('r');
	}
	if (isset($_SESSION['urlRedirect'])) {
		$urlRedirect = $_SESSION['urlRedirect'];
	}
	$email_value = $email_error = $password_error = '';
	if (isset($flash['email'])) {
		$email_value = $flash['email'];
	}
	if (isset($flash['errors']['email'])) {
		$email_error = $flash['errors']['email'];
	}
	if (isset($flash['errors']['password'])) {
		$password_error = $flash['errors']['password'];
	}
	$app->render('login.php', array(
		'error' => $error,
		'email_value' => $email_value,
		'email_error' => $email_error,
		'password_error' => $password_error,
		'urlRedirect' => $urlRedirect
	));
});

$app->post("/login", function () use ($app) {
	$email = $app->request()->post('email');
	$password = $app->request()->post('password');
	$errors = array();
	if ($email != "brian@nesbot.com") {
		$errors['email'] = "Email is not found.";
	} else if ($password != "aaaa") {
//		$app->flash('email', $email);
		$errors['password'] = "Password does not match.";
	}
	if (count($errors) > 0) {
		$app->flash('errors', $errors);
		$app->redirect('/login');
	}

	$_SESSION['user_name'] = $email;
	$_SESSION['user_id'] = 1;
	$_SESSION['user_role'] = "teacher";
	$_SESSION['user_logged'] = TRUE;

	if (isset($_SESSION['urlRedirect'])) {
		$tmp = $_SESSION['urlRedirect'];
		unset($_SESSION['urlRedirect']);
		$app->redirect($tmp);
	}
	$app->redirect('/');
});

$app->get("/logout", function () use ($app) {
	setNullDataToViewAndUnset($app, array(
		'user_id',
		'user_name',
		'user_role',
		'user_logged',
	));
	$app->render('homepage.php');
});

$app->get("/student", $authenticate($app), function () use ($app) {
	$app->render('student.php');
});
$app->get("/teacher", $authenticateTeacher($app), function () use ($app) {
	$app->render('teacher.php');
});
$app->get("/schemas", $authenticate($app), function () use ($app) {
	$app->render('homepage.php');
});


$app->run();
