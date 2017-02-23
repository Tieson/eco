<?php

require '../vendor/autoload.php';

$config['displayErrorDetails'] = true;
$config['addContentLengthHeader'] = false;

$config['db']['host']   = "127.0.0.1";
$config['db']['user']   = "root";
$config['db']['pass']   = "";
$config['db']['dbname'] = "editorobvodu";


function getDB()
{
	$dbhost = "127.0.0.1";
	$dbuser = "root";
	$dbpass = "";
	$dbname = "editorobvodu";

	$mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname;charset=utf8";
	$dbConnection = new PDO($mysql_conn_string, $dbuser, $dbpass);
	$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbConnection;
}


$app = new \Slim\Slim(["settings" => $config]);

$app->get('/', function() use($app) {
	$app->response->setStatus(200);
	echo "Welcome to Slim 3.0 based API";
});


require_once 'routes/schemas.php';
require_once 'routes/users.php';
require_once 'routes/students.php';
require_once 'routes/users.php';

$app->run();