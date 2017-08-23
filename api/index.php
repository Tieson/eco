<?php
session_cache_limiter(false);
session_start();

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

/**
 * TODO: přihlášení a identifikace uživatele
 */
$_SESSION['teacher_id'] = 9;
$_SESSION['student_id'] = 9;


require_once 'routes/schemas.php';
require_once 'routes/users.php';
require_once 'routes/files.php';
require_once 'routes/students.php';
require_once 'routes/groups.php';
require_once 'routes/teacher.php';
require_once 'routes/users.php';
require_once 'routes/entities.php';
require_once 'routes/homeworks.php';

//$app->post('/file', 'uploadFile');

$app->get('/users', 'users');
$app->get('/users/:id', 'user');

$app->get('/students', 'students'); //401, 403, 404
$app->get('/students/:id', 'student'); //401, 403, 404
$app->get('/students/:id/hw', 'studentHomeworkList'); //401, 403
$app->get('/students/:id/hw/:hw_id', 'studentHomeworkDetail');
$app->get('/students/:id/hw/:hw_id/solutions', 'studentHomeworkSolutionList');
$app->get('/students/:id/groups', 'studentGroupList');
$app->delete('/students/:id', 'student');

$app->get('/homework/:id', 'homework');
$app->get('/homework/:id/solutions', 'homeworkSolutionList');

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
$app->get('/groups/:id', 'group'); //detail skupiny
$app->get('/groups/:id/students', 'groupStudents'); //studenti skupiny
$app->post('/groups', 'groupCreate'); //vytvoření skupiny
$app->post('/groups/:id/students/:student_id', 'groupAddStudent'); // přidání studenta do skupiny
$app->delete('/groups/:id', 'groupDelete'); // odebrání skupiny
$app->delete('/groups/:group_id/students/:student_id', 'groupRemoveStudent'); // odebrání studenta ze skupiny

$app->get('/teachers', 'teachers');
$app->get('/teachers/:id', 'teacher');
$app->get('/teachers/:id/groups', 'teacherGroups');
$app->get('/teachers/:id/hw', 'teacherHomeworks');
$app->get('/teachers/:id/tasks', 'teacherTasks');

//$app->get('/tasks', 'tasks');
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