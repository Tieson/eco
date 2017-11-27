<?php
/**
 * Created by Tom on 23.02.2017.
 */
/**
 * Created by PhpStorm.
 * User: Tom
 * Date: 23.02.2017
 * Time: 15:23
 */


function teachers() {
	$app = \Slim\Slim::getInstance();

	try {
		$teacher = requestLoggedTeacher();
	}
	catch(Exception $e){
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT teacher.id AS `id`, user.id AS `user_id`, user.mail AS mail, user.name AS name 
            FROM `teacher` JOIN `user` ON user.id = teacher.user_id");
		$sth->execute();
		$items = $sth->fetchAll(PDO::FETCH_OBJ);

		if($items) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($items);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

/**
 * Používá se???
 * @param $id
 */
function teacher($id) {
	$app = \Slim\Slim::getInstance();

	try {
		$teacher = requestLoggedTeacher();
	}
	catch(Exception $e){
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT t.id AS `id`, u.id AS `user_id`, u.mail AS mail, u.name AS name 
            FROM `teacher` AS t JOIN `user` AS u
            ON u.id = t.user_id 
            WHERE t.id = :id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->execute();
		$items = $sth->fetch(PDO::FETCH_OBJ);

		if($items) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($items);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}
function teacherGroups($id) {
	$app = \Slim\Slim::getInstance();

	try {
		$teacher = requestLoggedTeacher();
	}
	catch(Exception $e){
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT group_id, teacher_id, subject, day, weeks, block
            FROM group_teaching AS gt JOIN `group` ON gt.group_id=`group`.id WHERE teacher_id = :id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->execute();
		$items = $sth->fetchAll(PDO::FETCH_OBJ);

		if($items) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($items);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}
function teacherHomeworks($id) {
	$app = \Slim\Slim::getInstance();

	try {
		$teacher = requestLoggedTeacher();
	}
	catch(Exception $e){
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT hw.id as id, t.name as name, hw.status, task_id, hw.student_id, t.teacher_id, deadline, hw.created, u.name AS student_name, u.mail AS student_mail
        	FROM hw_assigment AS hw
        	JOIN task AS t
        	JOIN `user` AS u
         	ON hw.task_id = t.id AND hw.student_id = u.id
            WHERE t.teacher_id = :id ");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->execute();
		$items = $sth->fetchAll(PDO::FETCH_OBJ);

		if($items) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($items);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

/**
 * Zobrazí zadání jiného učitele
 * pouze pro vyučující
 * @param $id
 */
function teacherTasks($id) {
	$app = \Slim\Slim::getInstance();

	try {
		$teacher = requestLoggedTeacher();
	}
	catch(Exception $e){
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT id, teacher_id, name, description, created
            FROM task WHERE teacher_id = :id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->execute();
		$items = $sth->fetchAll(PDO::FETCH_OBJ);

//		if($items) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($items);
			$db = null;
//		} else {
//			throw new PDOException('No records found.');
//		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function showTasks() {
	$app = \Slim\Slim::getInstance();

	try {
		$teacher = requestLoggedTeacher();

	} catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit;
	}
	try
	{

		$db = getDB();
		$sth = $db->prepare("SELECT id, teacher_id, name, description, created
            FROM task WHERE teacher_id = :id");
		$sth->bindParam(':id', $teacher['id'], PDO::PARAM_INT);
		$sth->execute();
		$items = $sth->fetchAll(PDO::FETCH_OBJ);

		if($items) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($items);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit;
	}
}

function task($id) {
	$app = \Slim\Slim::getInstance();

	try {
		$teacher = requestLoggedTeacher();
	}
	catch(Exception $e){
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT id, teacher_id, name, description, created
            FROM task WHERE id = :id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->execute();
		$items = $sth->fetch(PDO::FETCH_OBJ);

		if($items) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($items);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function taskCreate() {
	$app = \Slim\Slim::getInstance();

	try {
		$teacher = requestLoggedTeacher();
	}
	catch(Exception $e){
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	$allPostVars = json_decode($app->request->getBody(), true);
	$values = array(
		"id" => $allPostVars['id'],
		"teacher_id" => $teacher['user_id'],
		"name" => $allPostVars['name'],
		"description" => $allPostVars['description'],
//		"created" => $allPostVars['created'],
//		"etalon_file" => $allPostVars['etalon_file'],
//		"test_file" => $allPostVars['test_file'],
	);

	try
	{
		$db = getDB();
		$sth = $db->prepare("INSERT INTO task (id, teacher_id, name, description)
            VALUES(:id,:teacher_id,:name,:description)");

		$result = $sth->execute($values);

		if ($result){
			$id = $db->lastInsertId();
				$sth = $db->prepare("SELECT * FROM `task` WHERE id = :id");
				$sth->bindParam(":id", $id, PDO::PARAM_INT);
				$sth->execute();

				$item = $sth->fetch(PDO::FETCH_OBJ);

				if($item) {
					$app->response()->setStatus(200);
					$app->response()->headers->set('Content-Type', 'application/json');
					echo json_encode($item);

					$db = null;
				} else {
					throw new PDOException('Getting inserted values was unsuccessful');
				}
		} else {
			throw new PDOException('No task was created.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function taskUpdate($id) {
	$app = \Slim\Slim::getInstance();

	try {
		$teacher = requestLoggedTeacher();

	} catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit;
	}

	$allPostVars = json_decode($app->request->getBody(), true);
	$values = array(
		"name" => $allPostVars['name'],
		"description" => $allPostVars['description'],
		"id" => $id,
		"teacher_id" => $teacher['user_id'],
//		"etalon_file" => $allPostVars['etalon_file'],
//		"test_file" => $allPostVars['test_file'],
	);
	try
	{
		$db = getDB();
		$request = $db->prepare("UPDATE task SET name=:name, description=:description, teacher_id=:teacher_id WHERE id=:id AND teacher_id=:teacher_id");

		if ($request->execute($values)){
			$app->response()->setStatus(200);
			echo json_encode(array( 'response' => 'success' ));
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function taskDelete($id) {
	$app = \Slim\Slim::getInstance();

	//TODO: kontrola oprávnění (skupina a student)

	try {
		$teacher = requestLoggedTeacher();

	} catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit;
	}

	try
	{
		$db = getDB();
//		$prepare = $db->prepare("DELETE FROM `group_assigment` WHERE group_id=:group_id");
		$prepare = $db->prepare("DELETE FROM `task` WHERE id=:id AND teacher_id=:teacher_id");
		$prepare->bindParam(':id', $id, PDO::PARAM_INT);
		$prepare->bindParam(':teacher_id', $teacher['user_id'], PDO::PARAM_INT);
		$result = $prepare->execute();

		if ($result) {
			$app->response()->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode(array( 'response' => 'success' ));

			$db = null;
		} else {
			throw new PDOException('No group was deleted.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}
