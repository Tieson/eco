<?php


function groups() {
	$app = \Slim\Slim::getInstance();

	$db = getDB();
	try {
		$teacher = requestLoggedTeacher();
	}catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	try
	{
		$sth = $db->prepare("SELECT g.id, g.subject, g.day, g.weeks, g.block, g.created, g.teacher_id, u.name AS name, u.mail
            FROM `groups` AS g
            JOIN `user` AS u
            ON g.teacher_id = u.id WHERE g.teacher_id = :id");
		$sth->bindParam(':id', $teacher['user_id'], PDO::PARAM_INT);
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
function group($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT g.id AS id, g.subject, g.day, g.weeks, g.block, g.created, g.teacher_id, u.name AS name, u.mail
            FROM `groups` AS g
            JOIN `user` AS u
            ON g.teacher_id = u.id
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
		$sth = $db->prepare("SELECT u.id AS id, group_id, ga.entered AS group_entered, mail, name, approved
            FROM `user` AS u 
            JOIN group_assigment AS ga 
            ON u.id=ga.student_id
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
		"teacher_id" => $teacher['user_id'],
	);

	try
	{
		$db = getDB();
		$result = $db->prepare("INSERT INTO `groups` (subject, day, weeks, block, teacher_id) VALUES (:subject, :day, :weeks, :block, :teacher_id)")
			->execute($values);

		if ($result){
			$id = $db->lastInsertId();

			$sth = $db->prepare("SELECT g.id AS id, g.subject, g.day, g.weeks, g.block, g.created, g.teacher_id, u.name AS name, u.mail
            FROM `groups` AS g
            JOIN `user` AS u
            ON g.teacher_id = u.id
            WHERE g.id=:id LIMIT 1");
			$sth->bindParam(":id", $id, PDO::PARAM_INT);
			$sth->execute();
			$group = $sth->fetchObject();
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
		$db = null;

	} catch(PDOException $e) {
		$db = null;
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function groupAddStudent($id) {
	$app = \Slim\Slim::getInstance();

	try {
		$teacher = requestLoggedTeacher();
	} catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	$allPostVars = json_decode($app->request->getBody(), true);
//	$values = array(
//		"student_id" => $allPostVars['student_id'],
//		"day" => $allPostVars['day'],
//		"block" => $allPostVars['block'],
//		"weeks" => $allPostVars['weeks'],
//		"teacher" => $teacher['id'],
//	);

	//TODO: kontrola oprávnění

	try
	{
		$db = getDB();
		$prepare = $db->prepare("INSERT INTO `group_assigment` (student_id, group_id) VALUES (:student_id, :id)");
		$prepare->bindParam(':id', $id, PDO::PARAM_INT);
		$prepare->bindParam(':student_id', $allPostVars['student_id'], PDO::PARAM_INT);
		$result = $prepare->execute();

		if ($result) {
//			$insert_id = $db->lastInsertId();
			$sth = $db->prepare("SELECT id AS `id`, id AS `user_id`, user.mail AS mail, user.name AS name 
            FROM `user` 
            WHERE user.id = :id LIMIT 1");
			$sth->bindParam(":id", $allPostVars['student_id'], PDO::PARAM_INT);
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
			throw new PDOException('No student was added to group.');
		}
		$db = null;

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		$db = null;
	}
}


function groupRemoveStudent($group_id, $student_id) {
	$app = \Slim\Slim::getInstance();

	//TODO: kontrola oprávnění (skupina a student)
	try {
		$teacher = requestLoggedTeacher();
	} catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

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
	try {
		$teacher = requestLoggedTeacher();
	} catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	try
	{
		$db = getDB();
//		$prepare = $db->prepare("DELETE FROM `group_assigment` WHERE group_id=:group_id");
		$prepare = $db->prepare("DELETE FROM `groups` WHERE id=:id AND teacher_id = :teacher_id");
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
