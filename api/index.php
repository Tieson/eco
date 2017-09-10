<?php
session_cache_limiter(false);
session_start();

$config = require('./config/config.php');
$basedir = $config['basepath'];

require $config['vendor'].'/autoload.php';

$slim_config['displayErrorDetails'] = true;
$slim_config['addContentLengthHeader'] = false;

function getDB()
{
	global $config;
	$dbhost = $config['db']['host'];
	$dbuser = $config['db']['user'];
	$dbpass = $config['db']['password'];
	$dbname = $config['db']['database'];

	$mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname;charset=utf8";
	$dbConnection = new PDO($mysql_conn_string, $dbuser, $dbpass);
	$dbConnection->exec("set names utf8");
	$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbConnection;
}

$authenticate = function ($app) {
	return function () use ($app) {
		if (!isset($_SESSION['user.id'])) {
			$_SESSION['urlRedirect'] = $app->request()->getPathInfo();
			$app->flash('error', 'Login required');
			$app->redirect('/login');
		}
	};
};


$app = new \Slim\Slim(array("settings" => $slim_config));

$app->get('/', function() use($app) {
	$app->response->setStatus(200);
	echo "Welcome to Slim 3.0 based API";
});


require_once './routes/auth.php';
require_once './routes/schemas.php';
require_once './routes/users.php';
require_once './routes/files.php';
require_once './routes/students.php';
require_once './routes/groups.php';
require_once './routes/teacher.php';
require_once './routes/users.php';
require_once './routes/entities.php';
require_once './routes/homeworks.php';

//$app->post('/file', 'uploadFile');

$app->get("/private", $authenticate($app), function () use ($app) {
	$app->render('privateAbout.php');
});


$app->get('/students', 'students'); //seznam všech studentů
$app->get('/students/hw', 'studentsHomeworks'); //seznam úkolů pro studenta
$app->get('/students/hw/id', 'studentHomeworkDetail'); //detail úkolu studenta
$app->get('/students/groups', 'studentGroupList');
$app->get('/students/:id', 'student'); //informace o konkrétním uživateli - asi není potřeba
$app->get('/students/:id/hw', 'studentHomeworkList'); //seznam úkolů konkrétního studentas
$app->get('/students/:id/hw/:hw_id', 'studentHomeworkDetail');
//$app->get('/students/:id/groups', 'studentGroupList');
$app->delete('/students/:id', 'student');


//Pomocné - měli by být neveřejné
$app->get('/users', 'users');
$app->get('/users/:id', 'user');


//pro studenta

$app->post('/homework', 'assignHomework'); //seznam úkolů konkrétního studentas
$app->get('/homework/:id', 'homework');
$app->delete('/homework/:id', 'homeworkDelete');
$app->get('/homework/:id/solutions', 'homeworkSolutionList');
$app->post('/homework/:id/solutions', 'homeworkSolutionCreate');
$app->delete('/homework/:hw_id/solutions/:id', 'homeworkSolutionDelete');

$app->get('/schemas', 'schemas');
$app->post('/schemas', 'schemaCreate');
$app->put('/schemas/:id', 'schemaUpdate');
$app->delete('/schemas/:id', 'schemaDelete');
$app->get('/schemas/:id', 'schemaDetail');
$app->get('/schemas/:id/vhdls', 'schemaData');
$app->post('/schemas/:id/vhdls', 'schemaDataCreate');
$app->put('/schemas/:schema_id/vhdls', 'schemaDataUpdate');
$app->get('/schemas/:id/vhdls/last', 'schemaDataLast');

$app->get('/groups', 'groups'); //seznam skupin
$app->post('/groups', 'groupCreate'); //vytvoření skupiny
$app->get('/groups/:id', 'group'); //detail skupiny
$app->get('/groups/:id/students', 'groupStudents'); //studenti skupiny
$app->get('/groups/:id/homeworks', 'groupHomeworks'); //studenti skupiny
$app->post('/groups/:id/students', 'groupAddStudent'); // přidání studenta do skupiny
//$app->post('/groups/:id/students/:student_id', 'groupAddStudent'); // přidání studenta do skupiny
$app->delete('/groups/:id', 'groupDelete'); // odebrání skupiny
$app->delete('/groups/:group_id/students/:student_id', 'groupRemoveStudent'); // odebrání studenta ze skupiny

$app->get('/teachers', 'teachers');
$app->get('/teachers/:id', 'teacher');
$app->get('/teachers/:id/groups', 'teacherGroups');
$app->get('/teachers/:id/hw', 'teacherHomeworks');
$app->get('/teachers/:id/tasks', 'teacherTasks');

$app->get('/tasks', 'showTasks');
$app->post('/tasks', 'taskCreate');
$app->get('/tasks/:id', 'task');
$app->put('/tasks/:id', 'taskUpdate');
$app->delete('/tasks/:id', 'taskDelete');

$app->get('/tasks/:id/files', 'tasksFiles'); //získá seznam souborů pro dané zadání
$app->put('/tasks/:id/files', 'addTaskFile'); //Přidá soubor k zadání

$app->get('/files', 'filesList'); //Zobrazí všechny soubory //TODO: omezit práva
$app->get('/files/:id', 'filesDetail'); //Vrátí pouze konkrétní subor
$app->delete('/files/:id', 'fileDelete');
$app->post('/files', 'uploadFile');

$app->run();