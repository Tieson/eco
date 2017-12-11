<?php
/**
 * Created by Tom on 23.02.2017.
 */
/**
 * Created by PhpStorm.
 * User: Tom
 * Date: 23.02.2017
 * Time: 15:20
 */

function schemas() {
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
		$sth = $db->prepare("SELECT id AS id, user_id AS user_id, name, architecture, created 
            FROM schema_base WHERE user_id=:user_id AND deleted IS NULL");
		$sth->bindParam(":user_id", $user['user_id'], PDO::PARAM_INT);

		$sth->execute();
		$schemas = $sth->fetchAll(PDO::FETCH_OBJ);

		if($schemas) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($schemas);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}
function schemaCreate() {
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

	$allPostVars = json_decode($app->request->getBody(), true);
	$values = array(
		"name" => $allPostVars['name'],
		"architecture" => $allPostVars['architecture'],
		"user_id" => $user['user_id'],
	);

	try
	{
		$result = $db->prepare("INSERT INTO schema_base (user_id, name, architecture, created) VALUES (:user_id,:name,:architecture, NOW())")->execute($values);

		if ($result){
			$id = $db->lastInsertId();
			$sth = $db->prepare("SELECT * FROM schema_base WHERE id = :id");
			$sth->bindParam(":id", $id, PDO::PARAM_INT);
			$sth->execute();

			$schema = $sth->fetch(PDO::FETCH_OBJ);

			if($schema) {
				$app->response()->setStatus(200);
				$app->response()->headers->set('Content-Type', 'application/json');
				echo json_encode($schema);
				$db = null;
			} else {
				throw new PDOException('No record was created.');
			}
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}
function schemaUpdate($id) {
	//TODO: dodělat oprávnění
	$app = \Slim\Slim::getInstance();

	$allPostVars = json_decode($app->request->getBody(), true);
	$values = array(
		"name" => $allPostVars['name'],
		"architecture" => $allPostVars['architecture'],
		"id" => $allPostVars['id']
	);
	try
	{
		$db = Database::getDB();
		$request = $db->prepare("UPDATE schema_base SET name=:name, architecture=:architecture WHERE id=:id");

		if ($request->execute($values)){
			$app->response()->setStatus(200);
//			echo '{"result":"Update ok"}}';
			echo '[]';
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}
function schemaDelete($id) {
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
		$sth = $db->prepare("SELECT id AS id, user_id AS user_id, name, architecture, created 
            FROM schema_base 
            WHERE id = :id AND user_id = :user_id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':user_id', $user['user_id'], PDO::PARAM_INT);

	}else if(isTeacher($user)){
		//Učitel může vidět schémata všech studentů
		$sth = $db->prepare("SELECT id AS id, user_id AS user_id, name, architecture, created 
            FROM schema_base
            WHERE id = :id AND (user_id = :user_id OR user_id IN (SELECT DISTINCT user_id FROM user WHERE type_uctu='student'))");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':user_id', $user['user_id'], PDO::PARAM_INT);
	}

	$schema = $sth->execute();
	if ($schema) {
		try {
			$exists = $db->prepare("SELECT count(*) AS count FROM schema_base WHERE id = :id");
			$exists->bindParam(":id", $id, PDO::PARAM_INT);

			if ($exists->execute()) {
				$count = $exists->fetch(PDO::FETCH_OBJ);
				if ($count->count == 0) {
					$app->response()->setStatus(404);
					$app->response()->header('X-Status-Reason', "Item was not found.");
				} else {
//					$prepared = $db->prepare("DELETE FROM schema_base WHERE id = :id");
					$prepared = $db->prepare("UPDATE schema_base SET deleted=NOW() WHERE id = :id");
					$prepared->bindParam(":id", $id, PDO::PARAM_INT);
					if ($prepared->execute()) {
						echo '{"result":{"text":"Item was deleted"}}';
					}
				}
			} else {
				echo '{"result":{"text":"Something went wrong.", "type": "error"}}';
			}

		} catch (PDOException $e) {
			$app->response()->setStatus(404);
			$app->response()->header('X-Status-Reason', $e->getMessage());
			echo '{"error":{"text":' . $e->getMessage() . '}}';
		}
	} else {
		$app->response()->setStatus(401);
		echo '{"error":{"text":"Nemáte potřebná oprávnění."}}';
	}
}
function schemaDetail($id) {
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
		$sth = $db->prepare("SELECT id AS id, user_id AS user_id, name, architecture, created 
            FROM schema_base
            WHERE id = :id AND user_id = :user_id AND deleted IS NULL");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':user_id', $user['user_id'], PDO::PARAM_INT);
		$sth->execute();

		$schema = $sth->fetch(PDO::FETCH_OBJ);

	}else if(isTeacher($user)){
		//Učitel může vidět schémata všech studentů
		$sth = $db->prepare("SELECT id AS id, user_id AS user_id, name, architecture, created 
            FROM schema_base
            WHERE id = :id AND (user_id = :user_id  OR user_id IN (SELECT DISTINCT user_id FROM user WHERE type_uctu='student'))");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':user_id', $user['user_id'], PDO::PARAM_INT);
		$sth->execute();

		$schema = $sth->fetch(PDO::FETCH_OBJ);
	}

	try
	{
		if($schema) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($schema);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function schemaData($id) {
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

		$sth = $db->prepare("SELECT schema_data.id data, schema_data.created, edited, schema_id, typ, name, user_id, architecture, base.created AS schema_created
            FROM schema_data
            JOIN schema_base AS base 
            ON  schema_id = base.id
            WHERE schema_id = :id AND user_id = :user_id
            ORDER BY schema_data.id DESC");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':user_id', $user['user_id'], PDO::PARAM_INT);

	}else if(isTeacher($user)){
		//Učitel může vidět schémata všech studentů

		$sth = $db->prepare("SELECT schema_data.id data, schema_data.created, edited, schema_id, typ, name, user_id, architecture, base.created AS schema_created
            FROM schema_data
            JOIN schema_base AS base 
            ON  schema_id = base.id
            WHERE schema_id = :id AND (user_id = :user_id OR user_id IN (SELECT DISTINCT user_id FROM user WHERE type_uctu='student'))
            ORDER BY schema_data.id DESC");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':user_id', $user['user_id'], PDO::PARAM_INT);
	}

	try
	{
		$sth->execute();

		$schema = $sth->fetchAll(PDO::FETCH_OBJ);

		if($schema) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($schema);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function schemaDataCreate($id) {
	$app = \Slim\Slim::getInstance();

	$allPostVars = json_decode($app->request->getBody(), true);
	$values = array(
		"data" => $allPostVars['data'],
//		"schema_id" => $allPostVars['schema_id'],
	);

	$db = Database::getDB();
	try {
		$user = requestLoggedAny();
	}
	catch(Exception $e){
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit();
	}

//	if (isStudent($user)){
	$schema = $db->prepare("SELECT sb.id
            FROM schema_base AS sb
            WHERE id = :schema_id AND user_id = :user_id 
            LIMIT 1");
	$schema->bindParam(":schema_id", $id, PDO::PARAM_INT);
	$schema->bindParam(":user_id", $user['user_id'], PDO::PARAM_INT);

	if ($schema->execute()) {

		$sch = $schema->fetch(PDO::FETCH_ASSOC);
		if ($sch){
			try {
				$request = $db->prepare("INSERT INTO schema_data (data, schema_id, created) VALUES (:data,:schema_id, NOW())");
				$request->bindParam(":schema_id", $id, PDO::PARAM_INT);
				$request->bindParam(":data", $values['data'], PDO::PARAM_STR);

				if ($request->execute()) {
					$app->response()->setStatus(200);
					echo '[]';
				}

			} catch (PDOException $e) {
				$app->response()->setStatus(400);
				echo '{"error":{"text":' . $e->getMessage() . '}}';
			}
		}else{
			$app->response()->setStatus(404);
			echo '{"error":{"text": "Schéma nebylo nalezeno."}}';
		}
	}else{
		$app->response()->setStatus(401);
		echo '{"error":{"text": "Schéma není vaše."}}';
	}
}

function schemaDataUpdate($schema_id) {
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

	$allPostVars = json_decode($app->request->getBody(), true);
	$values = array(
		"data" => $allPostVars['data'],
		"id" => $allPostVars['id'],
	);

//	if (isStudent($user)){
		$schema = $db->prepare("SELECT sb.id
            FROM schema_base AS sb
            JOIN schema_data AS sd
            ON  sd.schema_id = sb.id
            WHERE schema_id = :schema_id AND user_id = :user_id");
		$schema->bindParam(":schema_id", $schema_id, PDO::PARAM_INT);
		$schema->bindParam(":user_id", $user['user_id'], PDO::PARAM_INT);
//	} else if (isTeacher($user)) {
//		$schema = $db->prepare("SELECT id
//            FROM schema_base AS sb
//            JOIN schema_data AS sd
//            ON  sd.schema_id = sb.id
//            WHERE schema_id = :schema_id AND (user_id = :user_id OR user_id IN (SELECT DISTINCT user_id FROM student))");
//		$schema->bindParam(":schema_id", $schema_id, PDO::PARAM_INT);
//		$schema->bindParam(':user_id', $user['user_id'], PDO::PARAM_INT);
//	}

	if ($schema->execute()) {
		$sch = $schema->fetch(PDO::FETCH_ASSOC);
		if ($sch['id']) {
			try {
				$request = $db->prepare("UPDATE schema_data SET data=:data, edited=NOW() WHERE schema_id=:schema_id AND id=:id");
				$request->bindParam(":data", $values['data'], PDO::PARAM_STR);
				$request->bindParam(":id", $values['id'], PDO::PARAM_INT);
				$request->bindParam(":schema_id", $schema_id, PDO::PARAM_INT);

				if ($request->execute()) {
					$app->response()->setStatus(200);
					//			echo '{"result":"Update ok"}}';
					echo '[]';
				}

			} catch (PDOException $e) {
				$app->response()->setStatus(400);
				echo '{"error":{"text":' . $e->getMessage() . '}}';
			}
		} else {
			$app->response()->setStatus(401);
			echo '{"error":{"text": "Nemáte oprávnění k uložení schéma"}}';
		}
	} else {
		$app->response()->setStatus(401);
		echo '{"error":{"text": "Nemáte oprávnění k uložení schéma"}}';
	}
}
function schemaDataLast($id) {
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

		$sth = $db->prepare("SELECT sd.id, sd.data, sd.created, sd.edited, sd.schema_id, sd.typ
            FROM schema_data AS sd
            JOIN schema_base AS base 
            ON  schema_id = base.id
            WHERE schema_id = :id AND user_id = :user_id
            ORDER BY sd.id DESC
			LIMIT 1");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':user_id', $user['user_id'], PDO::PARAM_INT);

	}else if(isTeacher($user)){
		//Učitel může vidět schémata všech studentů

		$sth = $db->prepare("SELECT sd.id, sd.data, sd.created, sd.edited, sd.schema_id, sd.typ
            FROM schema_data AS sd
            JOIN schema_base AS base 
            ON  schema_id = base.id
            WHERE schema_id = :id AND (user_id = :user_id OR user_id IN (SELECT DISTINCT user_id FROM user WHERE type_uctu='student'))
            ORDER BY sd.id DESC
			LIMIT 1");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->bindParam(':user_id', $user['user_id'], PDO::PARAM_INT);
	}

	try
	{
		$sth->execute();

		$schema = $sth->fetch(PDO::FETCH_OBJ);

		if($schema) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($schema);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}