<?php

/**
 * Načte Jeden úkol odpovídající jeho ID se všemy potřebnými daty ze zadání
 * @param $id Identifikátor úkolu
 */
function homework($id) {
	$app = \Slim\Slim::getInstance();


	$db = getDB();
	try {
		$user = requestLoggedAny();
	}
	catch(Exception $e){
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	if (isStudent($user)){
		$sth = $db->prepare("SELECT hw.id,hw.task_id,hw.student_id,hw.created,hw.deadline,hw.status,t.teacher_id,t.name,t.description
            FROM hw_assigment AS hw
        	JOIN task AS t
         	ON hw.task_id = t.id
            WHERE hw.id = :id AND hw.student_id = :student_id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':student_id', $user['id'], PDO::PARAM_INT);
	}else if(isTeacher($user)){
		$sth = $db->prepare("SELECT hw.id,hw.task_id,hw.student_id,hw.created,hw.deadline,hw.status,t.teacher_id,t.name,t.description, u.name AS student_name 
            FROM hw_assigment AS hw
        	JOIN task AS t
        	JOIN student AS s
        	JOIN user AS u
         	ON hw.task_id = t.id AND s.user_id = u.id AND hw.student_id = s.id
            WHERE hw.id = :id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
	}

	try
	{
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


function studentsHomeworks(){
	$app = \Slim\Slim::getInstance();

//	$id = 9;
	$db = getDB();
	try {
		$student = requestLoggedStudent();
		$sth = $db->prepare("SELECT hw.id,hw.task_id,hw.student_id,hw.created,hw.deadline,hw.status,t.teacher_id,t.name,t.description
            FROM hw_assigment AS hw
            JOIN task AS t
            ON hw.task_id = t.id
            WHERE student_id = :id");
		$sth->bindParam(':id', $student['id'], PDO::PARAM_INT);
	} catch (Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text!!":' . $e->getMessage() . '}}';
		exit();
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
//		echo '{"error":{"text":'. $e->getMessage() .'}}';
		echo '[]';
	}
}

/**
 * Načte řešení pro daný úkol
 * @param $id
 */
function homeworkSolutionList($id) {
	$app = \Slim\Slim::getInstance();
	$db = getDB();

	try {
		$user = requestLoggedAny();
	}
	catch(Exception $e){
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	try
	{
		if (isStudent($user)) {
			$sth = $db->prepare("SELECT s.id, s.homework_id, s.created, s.status, s.test_result, s.test_message, s.schema_id,
			sch.name, sch.architecture
            FROM solution AS s
        	JOIN hw_assigment AS hw
        	JOIN schema_base AS sch
         	ON s.homework_id = hw.id AND s.schema_id=sch.id
            WHERE hw.id = :id AND hw.student_id = :student_id");
			$sth->bindParam(':id', $id, PDO::PARAM_INT);
			$sth->bindParam(':student_id', $user['id'], PDO::PARAM_INT);
		} else if (isTeacher($user)) {
			$sth = $db->prepare("SELECT s.id, s.homework_id, s.created, s.status, s.test_result, s.test_message, s.schema_id,
			sch.name, sch.architecture
            FROM solution AS s
        	JOIN hw_assigment AS hw
        	JOIN schema_base AS sch
         	ON s.homework_id = hw.id AND s.schema_id=sch.id
            WHERE hw.id = :id");
			$sth->bindParam(':id', $id, PDO::PARAM_INT);
		}
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
//		echo '[]';
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


/**
 * Přidá řešení (odevzdá úkol) k úkolu
 * Korky:   1) zjistit jestli je úkol studenta a získat schéma
 *          4) vytvořit řešení
 *          5) vrátit komplet řešení
 * @param $id
 */
function homeworkSolutionCreate($id) {
	$app = \Slim\Slim::getInstance();

	try {
		$student = requestLoggedStudent();
	}catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	$allPostVars = json_decode($app->request->getBody(), true);
	$values = array(
		'homework_id' => $allPostVars['homework_id'],
		'schema_id' => $allPostVars['schema_id'],
		'name' => $allPostVars['name'],
		'architecture' => $allPostVars['architecture'],
		'vhdl' => $allPostVars['vhdl'],
	);

	try
	{
		$db = getDB();

		// Kontrola jestli schéma patří studentovi!
		$homework = $db->prepare("SELECT id 
			FROM hw_assigment WHERE id=:hw_id AND student_id=:student_id");
		$homework->bindParam(":hw_id", $id, PDO::PARAM_INT);
		$homework->bindParam(":student_id", $student['id'], PDO::PARAM_INT);

		if($homework->execute()){
			//OK úkol existuje a je studenta

			$sth = $db->prepare("INSERT INTO solution 
			(homework_id,schema_id,created, `name`, architecture, vhdl)
			VALUES(:homework_id, :schema_id, NOW(), :name, :architecture, :vhdl)");
			$result = $sth->execute($values);

			if ($result){
				$id = $db->lastInsertId();

				$sth = $db->prepare("SELECT s.id, s.homework_id, s.created, s.status, s.test_result, s.test_message,
			sch.name, sch.architecture
            FROM solution AS s
        	JOIN hw_assigment AS hw
        	JOIN schema_base AS sch
         	ON s.homework_id = hw.id AND s.schema_id=sch.id
            WHERE s.id = :id AND hw.student_id = :student_id");
				$sth->bindParam(":id", $id, PDO::PARAM_INT);
				$sth->bindParam(":student_id", $student['id'], PDO::PARAM_INT);
				$sth->execute();
				$responseResult = $sth->fetch(PDO::FETCH_OBJ);
				if ($responseResult) {
					$app->response()->setStatus(200);
					$app->response()->headers->set('Content-Type', 'application/json');
					echo json_encode($responseResult);
				} else {
					throw new PDOException('Getting inserted values was unsuccessful');
				}
			} else {
				throw new PDOException('Inserting new Values was unsuccessful');
			}
		} else {
			throw new PDOException('Adding solution was unsuccessful. You do not own requested homework.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
	finally {
		$db = null;
	}

}

function assignHomework() {
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
		'task_id' => $allPostVars['task_id'],
		'student_id' => $allPostVars['student_id'],
		'deadline' => $allPostVars['deadline'],
		'status' => $allPostVars['status'],
	);

	try
	{
		$db = getDB();

			$sth = $db->prepare("INSERT INTO `hw_assigment` 
			(`task_id`,`student_id`,`created`,`deadline`,`status`)
			VALUES(:task_id, :student_id, NOW(), :deadline, :status )");

			$result = $sth->execute($values);

			if ($result){
					$app->response()->setStatus(200);
					$app->response()->headers->set('Content-Type', 'application/json');
					echo json_encode(array('result'=>'OK'));
			} else {
				throw new PDOException('Creating homework was unsuccessful');
			}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
	finally {
		$db = null;
	}

}

function homeworkDelete($id){
	$app = \Slim\Slim::getInstance();

	try {
		$teacher = requestLoggedTeacher();
	}catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	try
	{
		$db = getDB();

			$prepare = $db->prepare("DELETE FROM `hw_assigment` WHERE id=:id");
			$prepare->bindParam(':id', $id, PDO::PARAM_INT);
			$result = $prepare->execute();

			if ($result) {
				$app->response()->setStatus(200);
				$app->response()->headers->set('Content-Type', 'application/json');
				echo json_encode(array('response' => 'success'));

				$db = null;
			} else {
				throw new PDOException('No group was deleted.');
			}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function homeworkSolutionDelete($hw_id,$id) {
	$app = \Slim\Slim::getInstance();

	try {
		$student = requestLoggedStudent();
	}catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	try
	{
		$db = getDB();

		// Kontrola jestli schéma patří studentovi!
		$homework = $db->prepare("SELECT id 
			FROM hw_assigment WHERE id=(SELECT homework_id FROM solution WHERE homework_id=:id) AND student_id=:student_id");
		$homework->bindParam(":id", $id, PDO::PARAM_INT);
		$homework->bindParam(":student_id", $student['id'], PDO::PARAM_INT);

		if($homework->execute()) {
			$prepare = $db->prepare("DELETE FROM `solution` WHERE id=:id AND status='waiting'");
			$prepare->bindParam(':id', $id, PDO::PARAM_INT);
			$result = $prepare->execute();

			if ($result) {
				$app->response()->setStatus(200);
				$app->response()->headers->set('Content-Type', 'application/json');
				echo json_encode(array('response' => 'success'));

				$db = null;
			} else {
				throw new PDOException('No group was deleted.');
			}
		}else {

		}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}


function groupHomeworks($id){
	$app = \Slim\Slim::getInstance();

	try {
		$teacher = requestLoggedTeacher();
	}catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	$db = getDB();
	try
	{
		$sth = $db->prepare("SELECT hw.id,hw.task_id,hw.student_id,hw.created,hw.deadline,hw.status,t.teacher_id,t.name,t.description, u.name AS u_name, u.mail, ga.group_id, hw.status
            FROM hw_assigment AS hw
            JOIN task AS t
            JOIN student AS s
            JOIN user AS u
            JOIN group_assigment AS ga
            ON hw.task_id = t.id AND ga.student_id = hw.student_id AND s.id = hw.student_id AND u.id = s.user_id
            WHERE ga.group_id = :id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		if ($sth->execute()) {
			$items = $sth->fetchAll(PDO::FETCH_OBJ);

			if ($items) {
				$app->response->setStatus(200);
				$app->response()->headers->set('Content-Type', 'application/json');
				echo json_encode($items);
				$db = null;
			} else {
				throw new PDOException('No records found.');
			}
		}
	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '[]';
	}
}