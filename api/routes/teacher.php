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
function teacher($id) {
	$app = \Slim\Slim::getInstance();

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
function techerGroups($id) {
	$app = \Slim\Slim::getInstance();

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
function teacherTasks($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT id, teacher_id, name, description, created, etalon_file, test_file
            FROM task WHERE teacher_id = :id");
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
