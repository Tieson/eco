<?php
/**
 * Created by Tom on 07.04.2017.
 */
/**
 * Created by PhpStorm.
 * User: Tom
 * Date: 07.04.2017
 * Time: 16:04
 */


function groups() {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT g.id, g.subject, g.day, g.weeks, g.block, g.created, g.teacher AS teacher_id, u.name AS name, u.mail, t.user_id
            FROM `groups` AS g
            JOIN teacher AS t
            JOIN `user` AS u
            ON t.id = g.teacher AND t.user_id = u.id");
//		$sth->bindParam(':id', $id, PDO::PARAM_INT);
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
function group($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT g.id AS id, g.subject, g.day, g.weeks, g.block, g.created, g.teacher AS teacher_id, u.name AS name, u.mail, t.user_id
            FROM `groups` AS g
            JOIN teacher AS t
            JOIN `user` AS u
            ON t.id = g.teacher AND t.user_id = u.id
            WHERE g.id=:id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->execute();
		$items = $sth->fetchObject();

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
function groupStudents($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT s.id AS id, s.user_id, group_id, ga.entered AS group_entered, mail, name, approved
            FROM student AS s JOIN group_assigment AS ga JOIN user AS u ON s.id=ga.student_id AND s.user_id=u.id
            WHERE group_id=:id");
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


function groupCreate() {
	$app = \Slim\Slim::getInstance();

	try {
		$teacher = requestLoggedTeacher();
	}catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	$allPostVars = json_decode($app->request->getBody(), true);
	$values = array(
		"subject" => $allPostVars['subject'],
		"day" => $allPostVars['day'],
		"block" => $allPostVars['block'],
		"weeks" => $allPostVars['weeks'],
		"teacher" => $teacher['id'],
	);

	//TODO: kontrola oprávnění - může jen vyučující

	try
	{
		$db = getDB();
		$result = $db->prepare("INSERT INTO `groups` (subject, day, weeks, block, teacher) VALUES (:subject, :day, :weeks, :block, :teacher)")
			->execute($values);

		if ($result){
			$id = $db->lastInsertId();

			$sth = $db->prepare("SELECT g.id AS id, g.subject, g.day, g.weeks, g.block, g.created, g.teacher AS teacher_id, u.name AS name, u.mail, t.user_id
            FROM `groups` AS g
            JOIN teacher AS t
            JOIN `user` AS u
            ON t.id = g.teacher AND t.user_id = u.id
            WHERE g.id=:id");
			$sth->bindParam(":id", $id, PDO::PARAM_INT);
			$sth->execute();
			$group = $sth->fetch(PDO::FETCH_OBJ);
			if ($group) {
				$app->response()->setStatus(200);
				$app->response()->headers->set('Content-Type', 'application/json');
				echo json_encode($group);
			} else {
				throw new PDOException('Getting inserted values was unsuccessful');
			}
		} else {
			throw new PDOException('No group was created.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
	finally {
		$db = null;
	}
}

function groupAddStudent($id) {
	$app = \Slim\Slim::getInstance();

	$allPostVars = json_decode($app->request->getBody(), true);

	//TODO: kontrola oprávnění

	try
	{
		$db = getDB();
		$prepare = $db->prepare("INSERT INTO `group_assigment` (student_id, group_id) VALUES (:student_id, :id)");
		$prepare->bindParam(':id', $id, PDO::PARAM_INT);
		$prepare->bindParam(':student_id', $allPostVars['student_id'], PDO::PARAM_INT);
		$result = $prepare->execute();

		if ($result) {
			$app->response()->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo '{"status": "ok"}';

			$db = null;
		} else {
			throw new PDOException('No student was added to group.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}


function groupRemoveStudent($group_id, $student_id) {
	$app = \Slim\Slim::getInstance();

	//TODO: kontrola oprávnění (skupina a student)

	try
	{
		$db = getDB();
		$prepare = $db->prepare("DELETE FROM `group_assigment` WHERE student_id=:student_id AND group_id=:group_id");
		$prepare->bindParam(':group_id', $group_id, PDO::PARAM_INT);
		$prepare->bindParam(':student_id', $student_id, PDO::PARAM_INT);
		$result = $prepare->execute();

		if ($result) {
			$app->response()->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo '{"status": "ok"}';

			$db = null;
		} else {
			throw new PDOException('No student was removed.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}


function groupDelete($id) {
	$app = \Slim\Slim::getInstance();

	//TODO: kontrola oprávnění (skupina a student)

	try
	{
		$db = getDB();
//		$prepare = $db->prepare("DELETE FROM `group_assigment` WHERE group_id=:group_id");
		$prepare = $db->prepare("DELETE FROM `groups` WHERE id=:id");
		$prepare->bindParam(':id', $id, PDO::PARAM_INT);
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
