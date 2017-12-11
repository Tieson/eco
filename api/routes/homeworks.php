<?php

/**
 * Načte Jeden úkol odpovídající jeho ID se všemy potřebnými daty ze zadání
 * @param $id Identifikátor úkolu
 */
function homework($id) {
	$app = \Slim\Slim::getInstance();


	$db = Database::getDB();
	try {
		$user = requestLoggedAny();
	}
	catch(Exception $e){
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	if (isStudent($user)){
		$sth = $db->prepare("SELECT hw.id,hw.task_id,hw.student_id,hw.created,hw.deadline,hw.status,t.teacher_id,t.name,t.description, t.entity, t.valid
            FROM hw_assigment AS hw
        	JOIN task AS t
         	ON hw.task_id = t.id
            WHERE hw.id = :id AND hw.student_id = :student_id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':student_id', $user['user_id'], PDO::PARAM_INT);
	}else if(isTeacher($user)){
		$sth = $db->prepare("SELECT hw.id,hw.task_id,hw.student_id,hw.created,hw.deadline,hw.status,t.teacher_id,t.name,t.description, u.name AS student_name, t.entity, t.valid
            FROM hw_assigment AS hw
        	JOIN task AS t
        	JOIN user AS u
         	ON hw.task_id = t.id AND hw.student_id = u.id
            WHERE hw.id = :id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
	}

	try
	{
		$sth->execute();
		$items = $sth->fetchObject();

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


function studentsHomeworks(){
	$app = \Slim\Slim::getInstance();

//	$id = 9;
	$db = Database::getDB();
	try {
		$student = requestLoggedStudent();
		$sth = $db->prepare("SELECT hw.id,hw.task_id,hw.student_id,hw.created,hw.deadline,hw.status,t.teacher_id,t.name,t.description, g.subject, g.day, g.weeks, g.block, t.valid
            FROM hw_assigment AS hw
            JOIN task AS t
            JOIN groups AS g
            ON hw.task_id = t.id AND g.id=hw.group_id
            WHERE student_id = :id AND t.valid=1");
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
	$db = Database::getDB();

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
			$sth = $db->prepare("SELECT s.id, s.homework_id, s.created, s.status, s.test_result, s.test_message, s.schema_id, s.vhdl, g.subject, g.day, g.weeks, g.block, sch.name, sch.architecture, s.name AS entity
            FROM solution AS s
        	LEFT JOIN schema_base AS sch
            ON s.schema_id=sch.id
        	JOIN hw_assigment AS hw
            ON s.homework_id = hw.id
            JOIN groups AS g
         	ON g.id=hw.group_id
            WHERE hw.id = :id AND hw.student_id = :student_id ORDER BY s.id DESC");
			$sth->bindParam(':id', $id, PDO::PARAM_INT);
			$sth->bindParam(':student_id', $user['id'], PDO::PARAM_INT);
		} else if (isTeacher($user)) {
			$sth = $db->prepare("SELECT s.id, s.homework_id, s.created, s.status, s.test_result, s.test_message, s.schema_id, s.vhdl, g.subject, g.day, g.weeks, g.block, sch.name, sch.architecture
            FROM solution AS s
        	LEFT JOIN schema_base AS sch
            ON s.schema_id=sch.id
        	JOIN hw_assigment AS hw
            ON s.homework_id = hw.id
            JOIN groups AS g
         	ON g.id=hw.group_id
            WHERE hw.id = :id ORDER BY s.id DESC");
			$sth->bindParam(':id', $id, PDO::PARAM_INT);
		}

		$sth->execute();
		$items = $sth->fetchAll(PDO::FETCH_OBJ);

			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($items);
			$db = null;

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
		$db = Database::getDB();
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


/**
 * Test jestli je řešení u úkolu správné a úkol je tak kompletně a správně odevzdán
 * @param $id ID zadaného úkolu
 * @return bool
 */
function isHomeworkDone($hw){
//	$db = Database::getDB();
//	$isDoneQuery = $db->prepare("SELECT status FROM hw_assigment WHERE id=:hw_id");
//	$isDoneQuery->bindParam(":hw_id", $id, PDO::PARAM_INT);
//	if ($isDoneQuery->execute()) {
//		$hw = $isDoneQuery->fetchObject();
//		if ($hw->status == "done") {
//			return true;
//		}
//	}
	return $hw->status == 'done';
}


function isAfterDeadline($hw){
	return $hw->deadline <= date('Y-m-d H:i:s');
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
		responseError($e->getMessage());
		return;
	}

	try
	{
		$db = Database::getDB();

		$isDoneQuery = $db->prepare("SELECT status, deadline, created, task_id, student_id, group_id FROM hw_assigment WHERE id=:hw_id");
		$isDoneQuery->bindParam(":hw_id", $id, PDO::PARAM_INT);
		if($isDoneQuery->execute()){
			$hw = $isDoneQuery->fetchObject();

			/**
			 * Kontrola jestli je úkol již úspěšně odevzdán
			 */
			if (Config::getKey('settings/check/isHomeworkDone') && isHomeworkDone($hw)){
				responseError("Řešení k úkol nelze odevzdat, protože úkol je již úspěšně odevzdaný.");
				return;
			}

			/**
			 * Kontrola jestli je úkol po deadlinu
			 */
			if (Config::getKey('settings/check/disableAfterDeadline') && isAfterDeadline($hw)){
				responseError("Vypršel termín pro odevzdání ukolu.");
				return;
			}

			/*
			 * Kontrola maximálního počtu čekajících řešení
			 */
			$pocetReseni = Config::getKey('settings/limits/maxWaitingSolutions');
			if(Config::getKey('settings/check/checkSolutionsLimit') && getWaitingCount($student['id'])>=$pocetReseni) {
				responseError("Překročili jste max. $pocetReseni čekajících řešení.", 429);
				return;
			}
		}else{
			responseError("Úkol nebly nalezen.");
			return;
		}


		// Kontrola jestli úkol patří studentovi!
		$homework = $db->prepare("SELECT id 
			FROM hw_assigment WHERE id=:hw_id AND student_id=:student_id");
		$homework->bindParam(":hw_id", $id, PDO::PARAM_INT);
		$homework->bindParam(":student_id", $student['id'], PDO::PARAM_INT);

		if($homework->execute()){
			//OK úkol existuje a je studenta

			$allPostVars = json_decode($app->request->getBody(), true);
			$values = array(
				'homework_id' => $allPostVars['homework_id'],
				'schema_id' => $allPostVars['schema_id'],
				'name' => $allPostVars['name'],
				'architecture' => $allPostVars['architecture'],
				'vhdl' => $allPostVars['vhdl'],
				'student_id' => $student['id'],
			);


			$sth = $db->prepare("INSERT INTO solution 
				  (homework_id, schema_id, user_id, created, `name`, architecture, vhdl )
			VALUES(:homework_id, :schema_id, :student_id, NOW(), :name, :architecture, :vhdl)");
			$result = $sth->execute($values);

			if ($result){
				$id = $db->lastInsertId();

				$sth = $db->prepare("SELECT s.id, s.homework_id, s.created, s.status, s.test_result, s.test_message
			  , sch.name, sch.architecture
            FROM solution AS s
        	LEFT JOIN schema_base AS sch
        	ON s.schema_id=sch.id
            WHERE s.id = :id AND s.user_id = :student_id");
				$sth->bindParam(":id", $id, PDO::PARAM_INT);
				$sth->bindParam(":student_id", $student['id'], PDO::PARAM_INT);
				$sth->execute();
				$responseResult = $sth->fetch(PDO::FETCH_OBJ);
				if ($responseResult) {
					$app->response()->setStatus(200);
					$app->response()->headers->set('Content-Type', 'application/json');
					echo json_encode($responseResult);


					$descriptorspec = array(
						array('pipe', 'r'),               // stdin
						array('file', 'test.log.txt', 'a'), // stdout
						array('pipe', 'w'),               // stderr
					);

					// spuštění testování schéma
					$proc = proc_open('php ../common/test.php &', $descriptorspec, $pipes);

//					exec("php ../test.php > test.log.txt 2>&1 &");
//					shell_exec("../cgi-bin/test.sh $");
//					json_encode($output);
//					require('../test.php');


				} else {
					throw new PDOException('Getting inserted values was unsuccessful');
				}
			} else {
				throw new PDOException('Nepodařilo se uložit řešení do databáze.');
			}
		} else {
			throw new PDOException('Nelze přidávat řešení k cizímu úkolu. Tento úkol vám patrně nepatří.');
		}
		$db = null;

	} catch (Exception $e) {
		Util::responseError($e->getMessage());
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
		'group_id' => $allPostVars['group_id'],
	);

	try
	{
		$db = Database::getDB();

			$sth = $db->prepare("INSERT INTO `hw_assigment` 
			(`task_id`,`student_id`,`created`,`deadline`,`status`,`group_id`)
			VALUES(:task_id, :student_id, NOW(), :deadline, :status, :group_id )");

			$result = $sth->execute($values);

			if ($result){
					$app->response()->setStatus(200);
					$app->response()->headers->set('Content-Type', 'application/json');
					echo json_encode(array('result'=>'OK'));
			} else {
				throw new PDOException('Creating homework was unsuccessful');
			}
		$db = null;
	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
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
		$db = Database::getDB();

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
		$db = Database::getDB();

		// Kontrola jestli schéma patří studentovi!
		$homework = $db->prepare("SELECT id 
			FROM hw_assigment WHERE id=(SELECT homework_id FROM solution WHERE homework_id=:id) AND student_id=:student_id");
		$homework->bindParam(":id", $id, PDO::PARAM_INT);
		$homework->bindParam(":student_id", $student['id'], PDO::PARAM_INT);

		if($homework->execute()) {
			$prepare = $db->prepare("DELETE FROM `solution` WHERE id=:id AND status='waiting'");
			$prepare->bindParam(':id', $id, PDO::PARAM_INT);
			$result = $prepare->execute();

			if ($result && $prepare->rowCount()>0) {
				$app->response()->setStatus(200);
				$app->response()->headers->set('Content-Type', 'application/json');
				echo json_encode(array('response' => 'success'));

				$db = null;
			} else {
				throw new PDOException('No solution was deleted.');
			}
		}else {
			throw new PDOException('No solution was deleted.');
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

	$db = Database::getDB();
	try
	{
		$sth = $db->prepare("SELECT hw.id,hw.task_id,hw.student_id,hw.created,hw.deadline,hw.status,t.teacher_id,t.name,t.description, u.name AS u_name, u.mail, hw.group_id, hw.status, g.subject, g.day, g.weeks, g.block
				,(SELECT COUNT(*) FROM solution WHERE homework_id=hw.id) AS solutions_count, t.valid
            FROM hw_assigment AS hw
            JOIN task AS t
            JOIN `user` AS u
            JOIN groups AS g
            ON hw.task_id = t.id AND u.id = hw.student_id AND g.id=hw.group_id
            WHERE hw.group_id = :id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		if ($sth->execute()) {
			$items = $sth->fetchAll(PDO::FETCH_OBJ);

//			if ($items) {
				$app->response->setStatus(200);
				$app->response()->headers->set('Content-Type', 'application/json');
				echo json_encode($items);
				$db = null;
//			} else {
//				throw new PDOException('No records found.');
//			}
		}
	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}