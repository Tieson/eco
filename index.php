
<?php
session_cache_limiter(false);
session_start();

require_once('./config/config.php');
require_once './vendor/autoload.php';
require_once './common/database.php';
require_once './common/utils.php';
require_once './common/Mail.class.php';
require_once './templates/mail.php';
require_once './api/routes/auth.php';
require_once './api/routes/users.php';

$config = Config::getConfig();


$slim_config = array(
	'displayErrorDetails' => true,
	'addContentLengthHeader' => false,
	'cookies.encrypt' => true,
);

$app = new \Slim\Slim(array("settings" => $slim_config));

$authenticate = function ($app) {
	return function () use ($app) {
		$basedir = Config::getKey('projectDir');
		if (!isset($_SESSION['user_id'])) {
			$_SESSION['urlRedirect'] = $basedir.$app->request()->getPathInfo();
//			$app->flash('error', 'Login required');
			$app->redirect($basedir.'/login');
		}
	};
};

$authenticateTeacher = function ($app) {
	return function () use ($app) {
		$basedir = Config::getKey('projectDir');
		if (isset($_SESSION['user_id']) && isset($_SESSION['user_role']) && $_SESSION['user_role']=='teacher') {

		} else {
			$_SESSION['urlRedirect'] = $basedir.$app->request()->getPathInfo();
//			$app->flash('error', 'Login required');
			$app->redirect($basedir.'/login');
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

	$basedir = Config::getKey('projectDir');

	$app->view()->setData('projectDir', $basedir); //TODO: toto implementovat v masteru
});

$app->get('/', function() use($app) {
	$app->response->setStatus(200);
	$app->render('homepage.php');
});

$app->get("/login", function () use ($app) {
	$basedir = Config::getKey('projectDir');

	$app->response->setStatus(200);
	$flash = $app->view()->getData('flash');
	$error = '';
	if (isset($flash['error'])) {
		$error = $flash['error'];
	}
	$urlRedirect = $basedir.'/';
	if ($app->request()->get('r') && $app->request()->get('r') != $basedir.'/logout' && $app->request()->get('r') != $basedir.'/login') {
		$_SESSION['urlRedirect'] = $app->request()->get('r');
	}
	if (isset($_SESSION['urlRedirect'])) {
		$urlRedirect = $_SESSION['urlRedirect'];
	}
	$email_value = $email_error = $password_error = $success_message = NULL;
	if (isset($flash['email'])) {
		$email_value = $flash['email'];
	}
	if (isset($flash['errors']['email'])) {
		$email_error = $flash['errors']['email'];
	}
	if (isset($flash['errors']['password'])) {
		$password_error = $flash['errors']['password'];
	}
	if (isset($flash['success_message'])) {
		$success_message = $flash['success_message'];
	}
	$app->render('login.php', array(
		'error' => $error,
		'email_value' => $email_value,
		'email_error' => $email_error,
		'password_error' => $password_error,
		'urlRedirect' => $urlRedirect,
		'basedir' => $basedir,
		'success_message' => $success_message
	));
});

$app->post("/login", function () use ($app) {
	$basedir = Config::getKey('projectDir');
	$email = $app->request()->post('email');
	$password = $app->request()->post('password');

	$password_hash = Util::hashPassword($password);

	$db = Database::getDB();

	$user_prepare = $db->prepare("SELECT * FROM user WHERE mail = :mail AND (password = :password OR password IS NULL) LIMIT 1");
	$user_prepare->bindParam(':mail', $email, PDO::PARAM_STR);
	$user_prepare->bindParam(':password', $password_hash, PDO::PARAM_STR);

	$user_prepare->execute();
	$user = $user_prepare->fetchObject();

	if ($user){
		try {
			$token = Util::getJwtData($user->token);
			$curTime = time();
			$created = $token['payload']->created;
			if (!$user->activated) {
				if (($curTime - $created) < Config::getKey('token/secondsLifetime')) {
					$app->flash('errors', array('email'=>'E-mail je registrován, ale není ověřen. Oveřte prosím svůj e-mail.'));
					$app->redirect($basedir.'/login');
				}else{
					$app->flash('errors', array('email'=>'Vypršel limit pro ověření e-mailu, prosím znovu se registrujte.'));
					$app->redirect($basedir.'/register');
				}
			}
		}catch(AuthorizationException $ex){

		}
		$_SESSION['user_name'] = $user->name;
		$_SESSION['user_id'] = $user->id;
		$_SESSION['user_role'] = $user->type_uctu;
		$_SESSION['user_activated'] = $user->activated;
		$_SESSION['user_logged'] = TRUE;

		if (isset($_SESSION['urlRedirect'])) {
			$tmp = $_SESSION['urlRedirect'];
			unset($_SESSION['urlRedirect']);
			$app->redirect($tmp);
		}
		$app->redirect($basedir.'/');
	}else {
		$app->flash('errors', array('email'=>'Přihlašovací jméno nebo heslo není správné.'));
		$app->flash('email', $email);
		$app->redirect($basedir.'/login');
	}
});

$app->get("/logout", function () use ($app) {
	setNullDataToViewAndUnset($app, array(
		'user_id',
		'user_name',
		'user_role',
		'user_logged',
	));
//	$app->render('homepage.php');
	$basedir = Config::getKey('projectDir');
	$app->redirect($basedir.'/login');
});

$app->get("/profile", function () use ($app) {

	$basedir = Config::getKey('projectDir');
	$user = Users::getUser($_SESSION['user_id']);

	$app->render('profile.php', array(
		'error' => NULL,
		'email_value' => $user->mail,
		'email_error' => NULL,
		'password_error' => NULL,
		'basedir' => $basedir,
		'password_length_error' => NULL,
	));
});
$app->post("/profile", function () use ($app) {

	$user = Users::getUser($_SESSION['user_id']);

	$password = $app->request()->post('password');
	$password2 = $app->request()->post('password2');

	$ok = TRUE;
	$success = NULL;
	$error = NULL;
	$email_error = NULL;
	$password_error = NULL;
	$password_length_error = NULL;

	if (Util::hashPassword($password) != Util::hashPassword($password2)){
		$password_error = "Hesla se neshodují";
		$ok = FALSE;
	}

	if (strlen($password) < 6) {
		$password_length_error = "Heslo je příliš krátké, musí mít alespoň 6 znaků.";
		$ok = FALSE;
	}
	try {
		if ($ok) {
			Users::changePassword($_SESSION['user_id'], Util::hashPassword($password));
			$success = "Heslo bylo úspěšně změněno.";
		}
	}catch (Exception $ex){
		$password_error = $ex->getMessage();
	}
	$basedir = Config::getKey('projectDir');

	$app->render('profile.php', array(
		'success' => $success,
		'error' => $error,
		'email_value' => '',
		'email_error' => $email_error,
		'password_error' => $password_error,
		'password_length_error' => $password_length_error,
		'basedir' => $basedir,
	));
});

$app->get("/activateAccount", function () use ($app) {
	$passed_token = $app->request->get('token');

	$basedir = Config::getKey('projectDir');
	if (Users::activateAccount($passed_token)) {
		$app->flash('success_message', 'E-mail byl ověřen. Nyní se můžete přihlásit.');
		$app->redirect($basedir.'/login');
	}else{
		$app->flash('errors', array('email'=>'Vypršel časový limit pro ověření e-mailu. prosím opakujte registraci.'));
		$app->redirect($basedir.'/register');
	}
});

$app->get("/register", function () use ($app) {
	$basedir = Config::getKey('projectDir');
	$error = NULL;
	$email_error = NULL;
	$email_value = NULL;
	$password_error = NULL;
	$success_message = NULL;
	$flash = $app->view()->getData('flash');
	if (isset($flash['email'])) {
		$email_value = $flash['email'];
	}
	if (isset($flash['errors']['email'])) {
		$email_error = $flash['errors']['email'];
	}
	if (isset($flash['errors']['password'])) {
		$password_error = $flash['errors']['password'];
	}
	if (isset($flash['success_message'])) {
		$success_message = $flash['success_message'];
	}
	$app->render('register.php', array(
		'error' => $error,
		'email_value' => $email_value,
		'email_error' => $email_error,
		'password_error' => $password_error,
		'success_message' => $success_message,
		'basedir' => $basedir,
		'password_length_error' => NULL,
	));
});

$app->post("/register", function () use ($app) {
	$basedir = Config::getKey('projectDir');
	$email = $app->request()->post('email');
	$password = $app->request()->post('password');
	$password2 = $app->request()->post('password2');

	$error = NULL;
	$email_error = NULL;
	$password_error = NULL;
	$password_length_error = NULL;

	$ok = TRUE;

	if (!Util::validateEmail($email)){
		$email_error = 'Chybný formát e-mailu.';
		$ok = FALSE;
	}

	if (Util::hashPassword($password) != Util::hashPassword($password2)){
		$password_error = "Hesla se neshodují";
		$ok = FALSE;
	}


	if (strlen($password) < 6) {
		$password_length_error = "Heslo je příliš krátké, musí mít alespoň 6 znaků.";
		$ok = FALSE;
	}
	try {
		if ($ok) {
			if (Users::isAccountEmpty($email)) {
				Users::registerNew($email, $email, Util::hashPassword($password));
			}
		}
	}catch (Exception $ex){
		$email_error = $ex->getMessage();
		$ok = FALSE;
	}

	if ($ok){
		$app->redirect($basedir.'/login');
	}

	$app->render('register.php', array(
		'error' => $error,
		'email_value' => $email,
		'email_error' => $email_error,
		'password_error' => $password_error,
		'password_length_error' => $password_length_error,
		'basedir' => $basedir
	));

});

//$app->get("/student", $authenticate($app), function () use ($app) {
//	$app->render('student.php');
//});
$app->get("/teacher", $authenticateTeacher($app), function () use ($app) {
	$app->render('teacher.php');
});


$app->run();
