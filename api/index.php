<?php
session_cache_limiter(false);
session_start();
date_default_timezone_set('Europe/Berlin');

require_once '../vendor/autoload.php';
require_once '../config/config.php';
require_once '../common/utils.php';
require_once '../common/database.php';
require_once '../common/task_validation.php';

$config = Config::getConfig();

$basedir = Config::getKey('projectDir');

$slim_config = array(
	'debug' => true,
	'displayErrorDetails' => true,
	'addContentLengthHeader' => true,
//	'cookies.lifetime' => '20 minutes'
);




$app = new \Slim\Slim(array("settings" => $slim_config));

$app->get('/', function() use($app) {
	$app->response->setStatus(200);
	?>
<h1>ECO (Editor Cislicovych Obvodu) API</h1>
	<h2>Public API</h2>
	<table>
		<thead>
		<tr>
			<th>Url</th>
			<th>Description</th>
		</tr>
		</thead>
		<tbody>
		<tr>
			<td><a href="students" target="_blank">api/students</a></td>
			<td>List of registered students</td>
		</tr>
		<tr>
			<td><a href="students/:id" target="_blank">api/students/:id</a></td>
			<td>Detail of student with the :id</td>
		</tr>
		<tr>
			<td><a href="students/:id/hw" target="_blank">api/students/:id/hw</a></td>
			<td>List of homeworks of the student</td>
		</tr>
		</tbody>
	</table>
<?php
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

$app->get('/foo', AuthRoute::authenticateForRole('admin'), function () {
	//Display admin control panel
});


$app->group('/students', function () use ($app){
	$app->get('', 'students'); //seznam všech studentů
	$app->get('/hw', 'studentsHomeworks'); //seznam úkolů pro studenta
	$app->get('/hw/id', 'studentHomeworkDetail'); //detail úkolu studenta
	$app->get('/groups', 'studentGroupList');
	$app->get('/:id', 'student'); //informace o konkrétním uživateli - asi není potřeba
	$app->get('/:id/hw', 'studentHomeworkList'); //seznam úkolů konkrétního studentas
	$app->get('/:id/hw/:hw_id', 'studentHomeworkDetail');
    //$app->get('/:id/groups', 'studentGroupList');
	$app->delete('/students/:id', 'student');
});


//Pomocné - měli by být neveřejné
$app->get('/users', 'users');
$app->get('/users/:id', 'user');


//pro studenta

$app->group('/homework', function () use ($app) {
	$app->post('', 'assignHomework'); //seznam úkolů konkrétního studentas
	$app->get('/:id', 'homework');
	$app->delete('/:id', 'homeworkDelete');
	$app->get('/:id/solutions', 'homeworkSolutionList');
	$app->post('/:id/solutions', 'homeworkSolutionCreate');
	$app->delete('/:hw_id/solutions/:id', 'homeworkSolutionDelete');
});

$app->group('/schemas', function () use ($app) {
	$app->get('', 'schemas');
	$app->post('', 'schemaCreate');
	$app->put('/:id', 'schemaUpdate');
	$app->delete('/:id', 'schemaDelete');
	$app->get('/:id', 'schemaDetail');
	$app->get('/:id/vhdls', 'schemaData');
	$app->post('/:id/vhdls', 'schemaDataCreate');
	$app->put('/:id/vhdls', 'schemaDataUpdate');
	$app->get('/:id/vhdls/last', 'schemaDataLast');
});

$app->group('/groups', function () use ($app) {
	$app->get('', 'groups'); //seznam skupin
	$app->post('', 'groupCreate'); //vytvoření skupiny
	$app->get('/:id', 'group'); //detail skupiny
	$app->put('/:id', 'groupEdit'); //uravit skupinu
	$app->get('/:id/students', 'groupStudents'); //studenti skupiny
	$app->get('/:id/homeworks', 'groupHomeworks'); //studenti skupiny
	$app->post('/:id/students', 'groupAddStudent'); // přidání studenta do skupiny
    //$app->post('/:id/students/:student_id', 'groupAddStudent'); // přidání studenta do skupiny
	$app->delete('/:id', 'groupDelete'); // odebrání skupiny
	$app->delete('/:group_id/students/:student_id', 'groupRemoveStudent'); // odebrání studenta ze skupiny
});

$app->group('/teachers', function () use ($app) {
	$app->get('', 'teachers');
	$app->get('/:id', 'teacher');
	$app->get('/:id/groups', 'teacherGroups');
	$app->get('/:id/hw', 'teacherHomeworks');
	$app->get('/:id/tasks', 'teacherTasks');
});

$app->group('/tasks', function () use ($app) {
	$app->get('', 'showTasks');
	$app->get('/valid', 'showValidTasks');
	$app->post('', 'taskCreate');
	$app->get('/:id', 'task');
	$app->put('/:id', 'taskUpdate');
	$app->delete('/:id', 'taskDelete');

	$app->get('/:id/files', 'tasksFiles'); //získá seznam souborů pro dané zadání
	$app->get('/:id/files_normal', 'taskFilesStudent'); //získá seznam souborů pro dané zadání
	$app->put('/:id/files', 'addTaskFile'); //Přidá soubor k zadání
});

$app->group('/files', function () use ($app) {
	$app->get('', 'filesList'); //Zobrazí všechny soubory //TODO: omezit práva
	$app->get('/:id', 'fileDetail'); //Vrátí pouze konkrétní subor
	$app->get('/:id/download', 'fileDownload'); //Vrátí pouze konkrétní subor
	$app->delete('/:id', 'fileDelete');
	$app->post('', 'uploadFile');
});

$app->run();