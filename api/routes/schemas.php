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

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT id AS id, user_id AS user_id, name, architecture, created 
            FROM schema_base WHERE user_id=:user_id");


		$sth->bindParam(":user_id", $_SESSION['user_id'], PDO::PARAM_INT);

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

	$allPostVars = json_decode($app->request->getBody(), true);
	$values = array(
		"name" => $allPostVars['name'],
		"architecture" => $allPostVars['architecture'],
		"user_id" => 1
	);

	try
	{
		$db = getDB();
		$result = $db->prepare("INSERT INTO schema_base (user_id, name, architecture) VALUES (:user_id,:name,:architecture)")->execute($values);

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
	$app = \Slim\Slim::getInstance();

	$allPostVars = json_decode($app->request->getBody(), true);
	$values = array(
		"name" => $allPostVars['name'],
		"architecture" => $allPostVars['architecture'],
		"id" => $allPostVars['id']
	);
	try
	{
		$db = getDB();
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

	try {
		$db = getDB();
		$exists = $db->prepare("SELECT count(*) AS count FROM schema_base WHERE id = :id");
		$exists->bindParam(":id", $id, PDO::PARAM_INT);
		if ($exists->execute()) {
			$count = $exists->fetch(PDO::FETCH_OBJ);
			if ($count->count == 0) {
				$app->response()->setStatus(404);
				$app->response()->header('X-Status-Reason', "Item was not found.");
			} else {
				$prepared = $db->prepare("DELETE FROM schema_base WHERE id = :id");
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
}
function schemaDetail($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();

		$sth = $db->prepare("SELECT id AS id, user_id AS user_id, name, architecture, created 
            FROM schema_base
            WHERE id = :id");

		$sth->bindParam(':id', $id, PDO::PARAM_INT);
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

function schemaData($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();

		$sth = $db->prepare("SELECT * 
            FROM schema_data
            WHERE schema_id = :id
            ORDER BY id DESC");

		$sth->bindParam(':id', $id, PDO::PARAM_INT);
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

	try
	{
		$db = getDB();
		$request = $db->prepare("INSERT INTO schema_data (data, schema_id) VALUES (:data,:schema_id)");
		$request->bindParam(":schema_id", $id, PDO::PARAM_INT);
		$request->bindParam(":data", $values['data'], PDO::PARAM_STR);

		if ($request->execute()){
			$app->response()->setStatus(200);
//			echo '{"result":"Creating ok"}}';
			echo '[]';
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}
function schemaDataUpdate($schema_id) {
	$app = \Slim\Slim::getInstance();

	$allPostVars = json_decode($app->request->getBody(), true);
	$values = array(
		"data" => $allPostVars['data'],
		"id" => $allPostVars['id'],
	);

	try
	{
		$db = getDB();
		$request = $db->prepare("UPDATE schema_data SET data=:data, edited=NOW() WHERE schema_id=:schema_id AND id=:id");
		$request->bindParam(":data", $values['data'], PDO::PARAM_STR);
		$request->bindParam(":id", $values['id'], PDO::PARAM_INT);
		$request->bindParam(":schema_id", $schema_id, PDO::PARAM_INT);

		if ($request->execute()){
			$app->response()->setStatus(200);
//			echo '{"result":"Update ok"}}';
			echo '[]';
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}
function schemaDataLast($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();

		$sth = $db->prepare("SELECT * 
            FROM schema_data
            WHERE schema_id = :id
            ORDER BY edited DESC
			LIMIT 1");

		$sth->bindParam(':id', $id, PDO::PARAM_INT);
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