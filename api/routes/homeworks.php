<?php

/**
 * Načte Jeden úkol odpovídající jeho ID se všemy potřebnými daty ze zadání
 * @param $id Identifikátor úkolu
 */
function homework($id) {
	$app = \Slim\Slim::getInstance();

	try {
		$student = requestLoggedStudent();
	}
	catch(Exception $e){
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT hw.id,hw.task_id,hw.student_id,hw.created,hw.deadline,hw.status,t.teacher_id,t.name,t.description
            FROM hw_assigment AS hw
        	JOIN task AS t
         	ON hw.task_id = t.id
            WHERE hw.id = :id AND hw.student_id = :student_id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':student_id', $student['id'], PDO::PARAM_INT);
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

	try {
		$student = requestLoggedStudent();
	}
	catch(Exception $e){
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT s.homework_id, s.created, s.status, s.test_result, s.test_message,
			sch.name, sch.architecture
            FROM solution AS s
        	JOIN hw_assigment AS hw
        	JOIN schema_base AS sch
         	ON s.homework_id = hw.id AND s.schema_id=sch.id
            WHERE hw.id = :id AND hw.student_id = :student_id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':student_id', $student['id'], PDO::PARAM_INT);
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
 *          2) načíst data ze schéma
 *          3) naklonovat data schéma
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
		'status' => $allPostVars['status'],
		'vhdl' => $allPostVars['vhdl'],
		'name' => $allPostVars['name'],
		'architecture' => $allPostVars['architecture'],
	);

	try
	{
		$db = getDB();
		$homework = $db->prepare("SELECT id 
			FROM hw_assigment WHERE id=:hw_id AND student_id=:student_id");
		$homework->bindParam(":hw_id", $id, PDO::PARAM_INT);
		$homework->bindParam(":student_id", $student['id'], PDO::PARAM_INT);

		if($homework->execute()){
			//načtení dat

			$sth = $db->prepare("SELECT * 
            FROM schema_data
            WHERE schema_id = :id
            ORDER BY edited DESC
			LIMIT 1");

			$sth->bindParam(':id', $allPostVars['schema_id'], PDO::PARAM_INT);
			$sth->execute();

			$schema_data = $sth->fetch(PDO::FETCH_OBJ);

			//Zkopírování dat
			$request = $db->prepare("INSERT INTO schema_data (data, schema_id) VALUES (:data,:schema_id)");
			$request->bindParam(":schema_id", $allPostVars['schema_id'], PDO::PARAM_INT);
			$request->bindParam(":data", $schema_data[data], PDO::PARAM_INT);

			//TODO:  rozpracováno


			//OK úkol existuje a studenta
			$sth = $db->prepare("INSERT INTO solution 
			(homework_id,schema_id,created,status)
			VALUES(:homework_id,:schema_id,NOW(),:status)");
			$result = $sth->execute($values);

			if ($result){
				$id = $db->lastInsertId();

				$sth = $db->prepare("SELECT s.homework_id, s.schema_data_id, s.created, s.status, s.test_result, s.test_message,
			sch.name, sch.architecture
            FROM solution AS s
        	JOIN hw_assigment AS hw
        	JOIN schema_base AS sch
         	ON s.homework_id = hw.id AND s.schema_id=sch.id
            WHERE hw.id = :id AND hw.student_id = :student_id");
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