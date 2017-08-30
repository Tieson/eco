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


/**
 * Seznam všech studentů spojených s uživatelem
 */
function students() {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT student.id AS `id`, user.id AS `user_id`, user.mail AS mail, user.name AS name 
            FROM `student` JOIN `user` ON user.id = student.user_id");
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
//		echo '{"error":{"text":'. $e->getMessage() .'}}';
		echo '[]';
	}
}
function student($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT student.id AS `id`, user.id AS `user_id`, user.mail AS mail, user.name AS name 
            FROM `student` 
            JOIN `user` 
            ON user.id = student.user_id 
            WHERE student.id = :id LIMIT 1");
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



/**
 * @param $idZobrazí seznam úkolů pro studenta a učitele podle jejich oprávnění pouze patřičné úkoly
 */
function studentHomeworkList($id) {
	$app = \Slim\Slim::getInstance();

	$db = getDB();
	try {
		$teacher = requestLoggedTeacher();

		$sth = $db->prepare("SELECT hw.id,hw.task_id,hw.student_id,hw.created,hw.deadline,hw.status,t.teacher_id,t.name,t.description
            FROM hw_assigment AS hw
        	JOIN task AS t
         	ON hw.task_id = t.id
            WHERE student_id = :id AND t.teacher_id=:teacher_id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':teacher_id', $teacher['id'], PDO::PARAM_INT);
	}catch (Exception $e){
		try {
			$student = requestLoggedStudent();
			if ($student['id']==$id){
				$sth = $db->prepare("SELECT hw.id,hw.task_id,hw.student_id,hw.created,hw.deadline,hw.status,t.teacher_id,t.name,t.description
	            FROM hw_assigment AS hw
	            JOIN task AS t
	            ON hw.task_id = t.id
	            WHERE student_id = :id");
				$sth->bindParam(':id', $id, PDO::PARAM_INT);
			}else {
				throw new Exception('Nemáte potřebné oprávnění.');
			}
		}catch (Exception $e){
			$app->response()->setStatus(401);
			echo '{"error":{"text":'. $e->getMessage() .'}}';
			exit();
		}
	}

	try
	{
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

function studentHomeworkDetail($id, $hw_id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT hw.id,hw.task_id,hw.student_id,hw.created,hw.deadline,hw.status,t.teacher_id,t.name,t.description
            FROM hw_assigment AS hw 
            JOIN task AS t
            ON hw.task_id = t.id 
            WHERE student_id = :id 
            AND hw.id = :hw_id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':hw_id', $hw_id, PDO::PARAM_INT);
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

function studentGroupList($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT ga.group_id, ga.student_id, ga.entered, ga.approved, 
			g.subject, g.`day`, g.weeks, g.block, u.name, u.mail 
            FROM group_assigment AS ga 
            JOIN `groups` AS g 
            JOIN teacher AS t 
            JOIN `user` AS u 
            ON ga.group_id = g.id AND t.id = g.teacher AND t.user_id = u.id
            WHERE student_id = :id");
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