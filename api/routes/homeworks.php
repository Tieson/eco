<?php

function homework($id) {
	$app = \Slim\Slim::getInstance();

	//TODO: student může zobrazit pouze svoje úkoly

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT hw.id,hw.task_id,hw.student_id,hw.created,hw.deadline,hw.status,t.teacher_id,t.name,t.description
            FROM hw_assigment AS hw
        	JOIN task AS t
         	ON hw.task_id = t.id
            WHERE hw.id = :id");
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
function homeworkSolutionList($id) {
	$app = \Slim\Slim::getInstance();

	//TODO: student může zobrazit pouze svoje úkoly

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT *
            FROM solution AS s
        	JOIN hw_assigment AS hw
         	ON s.homework_id = hw.id
            WHERE hw.id = :id");
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

function homeworkSolutionDetail($id, $hw_id) {
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
