<?php
/* 
    Author     : Tomáš Václavík <tomas.vaclavik at hotmail.com>
*/

session_start();

define('BASE_DIR', __DIR__ . '/');
define('SMARTY_DIR', BASE_DIR . '/includes/Smarty-3.1.21/libs/');

require_once(SMARTY_DIR . 'Smarty.class.php');
$smarty = new Smarty();
$smarty->setTemplateDir(BASE_DIR . 'templates');
$smarty->setCompileDir(BASE_DIR . 'templates_c');
$smarty->setConfigDir(BASE_DIR . 'configs');
$smarty->setCacheDir(BASE_DIR . 'cache');

//$smarty->testInstall();

require_once BASE_DIR . 'inc/debugger.php';
$debugger = TV\inc\DebuggerVoid::getInstance();

/* onnector přidává proměnnou $mysqli */
require_once BASE_DIR . 'inc/Connector.class.php';
require_once BASE_DIR . 'inc/Auth.class.php';
require_once BASE_DIR . 'inc/Message.class.php';
require_once BASE_DIR . 'inc/Entities.class.php';

$mysqli = Connector::getLocalhostConnection();
$messages = new TV\inc\Message($debugger, 'messages');
$autenticator = TV\inc\Auth::getInstance($mysqli, $messages);

$autenticator->logout();

$err_regback = $autenticator->mysql_registration($mysqli);
if ($err_regback === true) {
	header("location:index.php");
}
$err_loginback = $autenticator->mysql_login($mysqli);
if ($err_loginback === true) {
	header("location:index.php");
}


if ($autenticator->autentizace()){
	$smarty->assign('userEntities', TV\inc\Entities::getUserEntities($mysqli, $_SESSION['login']));
}

$smarty->assign("messgs", $messages->getMessages());
$messages->clear();

$smarty->assign('categories', TV\inc\Entities::getEntityCategories($mysqli));
$smarty->assign('entities', TV\inc\Entities::getEntities($mysqli));

$smarty->assign('name', $autenticator->getName());
$smarty->assign('title', 'Editor číslicových obvodů');
$smarty->assign('contentFile', 'content.tpl');
$smarty->assign('isIdentified', $autenticator->autentizace());

$smarty->assign('formdata', array('name' => $err_regback[0], 'surname' => $err_regback[1], 'mail' => $err_regback[0]));


//** un-comment the following line to show the debug console
$smarty->debugging = true;
//$smarty->error_reporting = 12;

$smarty->display('index.tpl');

function alert($prom = null) {
	if ($prom != null) {
		var_dump($prom);
	}
}
