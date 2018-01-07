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


<table>
	<tr><td>get       </td><td><a href="/api/students">/students</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/students/hw">/students/hw</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/students/groups">/students/groups</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/students/:id">/students/:id</a>  </td></tr>
	<tr><td>post      </td><td><a href="/api/homework">/homework</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/homework/:id">/homework/:id</a>  </td></tr>
	<tr><td>delete    </td><td><a href="/api/homework/:id">/homework/:id</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/homework/:id/solutions">/homework/:id/solutions</a>  </td></tr>
	<tr><td>post      </td><td><a href="/api/homework/:id/solutions">/homework/:id/solutions</a>  </td></tr>
	<tr><td>delete    </td><td><a href="/api/homework/:hw_id/solutions/:id">/homework/:hw_id/solutions/:id</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/schemas">/schemas</a>  </td></tr>
	<tr><td>post      </td><td><a href="/api/schemas">/schemas</a>  </td></tr>
	<tr><td>put       </td><td><a href="/api/schemas/:id">/schemas/:id</a>  </td></tr>
	<tr><td>delete    </td><td><a href="/api/schemas/:id">/schemas/:id</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/schemas/:id">/schemas/:id</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/schemas/:id/vhdls">/schemas/:id/vhdls</a>  </td></tr>
	<tr><td>post      </td><td><a href="/api/schemas/:id/vhdls">/schemas/:id/vhdls</a>  </td></tr>
	<tr><td>put       </td><td><a href="/api/schemas/:id/vhdls">/schemas/:id/vhdls</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/schemas/:id/vhdls/last">/schemas/:id/vhdls/last</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/groups">/groups</a>  </td></tr>
	<tr><td>post      </td><td><a href="/api/groups">/groups</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/groups/:id">/groups/:id</a>  </td></tr>
	<tr><td>put       </td><td><a href="/api/groups/:id">/groups/:id</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/groups/:id/students">/groups/:id/students</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/groups/:id/homeworks">/groups/:id/homeworks</a>  </td></tr>
	<tr><td>post      </td><td><a href="/api/groups/:id/students">/groups/:id/students</a>  </td></tr>
	<tr><td>delete    </td><td><a href="/api/groups/:id">/groups/:id</a>  </td></tr>
	<tr><td>delete    </td><td><a href="/api/groups/:group_id/students/:student_id">/groups/:group_id/students/:student_id</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/teachers">/teachers</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/teachers/:id">/teachers/:id</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/teachers/:id/groups">/teachers/:id/groups</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/teachers/:id/hw">/teachers/:id/hw</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/teachers/:id/tasks">/teachers/:id/tasks</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/tasks">/tasks</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/tasks/valid">/tasks/valid</a>  </td></tr>
	<tr><td>post      </td><td><a href="/api/tasks">/tasks</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/tasks/:id">/tasks/:id</a>  </td></tr>
	<tr><td>put       </td><td><a href="/api/tasks/:id">/tasks/:id</a>  </td></tr>
	<tr><td>delete    </td><td><a href="/api/tasks/:id">/tasks/:id</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/tasks/:id/files">/tasks/:id/files</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/tasks/:id/files_normal">/tasks/:id/files_normal</a>  </td></tr>
	<tr><td>put       </td><td><a href="/api/tasks/:id/files">/tasks/:id/files</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/files/:id">/files/:id</a>  </td></tr>
	<tr><td>get       </td><td><a href="/api/files/:id/download">/files/:id/download</a>  </td></tr>
	<tr><td>delete    </td><td><a href="/api/files/:id">/files/:id</a>  </td></tr>
	<tr><td>post      </td><td><a href="/api/files">/files</a>  </td></tr>
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


$app->group('/students', function () use ($app){
	$app->get('', AuthRoute::authenticateForRole('teacher'), 'studentsCandidates'); //seznam všech studentů
	$app->get('/hw', AuthRoute::authenticateForRole('student'),'studentsHomeworks'); //seznam úkolů pro studenta
	$app->get('/groups', AuthRoute::authenticateForRole('student'), 'studentGroupList');
	$app->get('/:id', AuthRoute::authenticateForRole('student'), 'student'); //informace o konkrétním uživateli - asi není potřeba
});

$app->get('/users', AuthRoute::authenticateForRole(array('admin')), 'Users::allUsers');
$app->get('/users/:id', AuthRoute::authenticateForRole(array('admin')), 'Users::getUserDetail');
$app->put('/users/:id', AuthRoute::authenticateForRole(array('admin')), 'Users::updateUser');

//pro studenta
$app->group('/homework', function () use ($app) {
	$app->post('', AuthRoute::authenticateForRole(array('teacher')), 'assignHomework');
	$app->get('/:id', AuthRoute::authenticateForRole(array('teacher', 'student')), 'homework');
	$app->delete('/:id', AuthRoute::authenticateForRole(array('teacher')), 'homeworkDelete');
	$app->get('/:id/solutions', AuthRoute::authenticateForRole(array('teacher', 'student')), 'homeworkSolutionList');
	$app->post('/:id/solutions', AuthRoute::authenticateForRole(array('student')),'homeworkSolutionCreate');
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
	$app->get('', AuthRoute::authenticateForRole('teacher'), 'groups'); //seznam skupin
	$app->post('', AuthRoute::authenticateForRole('teacher'), 'groupCreate'); //vytvoření skupiny
	$app->get('/:id', AuthRoute::authenticateForRole('teacher'),'group'); //detail skupiny
	$app->put('/:id', AuthRoute::authenticateForRole('teacher'), 'groupEdit'); //uravit skupinu
	$app->get('/:id/students', AuthRoute::authenticateForRole(array('teacher', 'student')), 'groupStudents'); //studenti skupiny
	$app->get('/:id/homeworks', AuthRoute::authenticateForRole('teacher'), 'groupHomeworks'); //úkoly skupiny
	$app->post('/:id/students', AuthRoute::authenticateForRole('teacher'), 'groupAddStudent'); // přidání studenta do skupiny
	$app->delete('/:id', AuthRoute::authenticateForRole('teacher'),'groupDelete'); // odebrání skupiny
	$app->delete('/:group_id/students/:student_id', AuthRoute::authenticateForRole('teacher'), 'groupRemoveStudent'); // odebrání studenta ze skupiny
});

$app->group('/teachers', function () use ($app) {
	$app->get('', AuthRoute::authenticateForRole('teacher'),'teachers');
	$app->get('/:id', AuthRoute::authenticateForRole('teacher'),'teacher');
	$app->get('/:id/groups', AuthRoute::authenticateForRole('teacher'), 'teacherGroups');
	$app->get('/:id/hw', AuthRoute::authenticateForRole('teacher'), 'teacherHomeworks');
	$app->get('/:id/tasks', AuthRoute::authenticateForRole('teacher'), 'teacherTasks');
});

$app->group('/tasks', function () use ($app) {
	$app->get('', AuthRoute::authenticateForRole('teacher'), 'showTasks');
	$app->get('/valid', AuthRoute::authenticateForRole('teacher'), 'showValidTasks');
	$app->post('', AuthRoute::authenticateForRole('teacher'), 'taskCreate');
	$app->get('/:id', AuthRoute::authenticateForRole('teacher'), 'task');
	$app->put('/:id', AuthRoute::authenticateForRole('teacher'), 'taskUpdate');
	$app->delete('/:id', AuthRoute::authenticateForRole('teacher'), 'taskDelete');

	$app->get('/:id/files', AuthRoute::authenticateForRole('teacher'), 'tasksFiles'); //získá seznam souborů pro dané zadání
	$app->get('/:id/files_normal', AuthRoute::authenticateForRole(array('teacher', 'student')), 'taskFilesStudent'); //získá seznam souborů pro dané zadání
	$app->put('/:id/files', AuthRoute::authenticateForRole(array('teacher')), 'addTaskFile'); //Přidá soubor k zadání
});

$app->group('/files', function () use ($app) {
	$app->get('/:id', AuthRoute::authenticateForRole(array('teacher', 'student')), 'fileDetail'); //Vrátí pouze konkrétní subor
	$app->get('/:id/download', AuthRoute::authenticateForRole(array('teacher')),'fileDownload'); //Vrátí pouze konkrétní subor
	$app->delete('/:id', AuthRoute::authenticateForRole(array('teacher')), 'fileDelete');
	$app->post('', AuthRoute::authenticateForRole(array('teacher')),'uploadFile');
});

$app->run();

?>