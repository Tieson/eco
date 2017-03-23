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


$app->get('/schemas', function () {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT id AS id, user_id AS user_id, name, architecture, description, created 
            FROM vhdl_schema");

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
});

$app->post('/schemas', function () {
	$app = \Slim\Slim::getInstance();

	$allPostVars = json_decode($app->request->getBody(), true);
	$allPostVars['user_id'] = 1;

	try
	{
		$db = getDB();
		$result = $db->prepare("INSERT INTO vhdl_schema (user_id, name, architecture, description) VALUES (:user_id,:name,:architecture, :description)")->execute($allPostVars);


		if ($result){
			$app->response()->setStatus(201);
			echo '{"result":{"insertedId":'.$db->lastInsertId().'}}';
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
});

$app->delete('/schemas/:id', function ($id) {
	$app = \Slim\Slim::getInstance();

	try {
		$db = getDB();
		$exists = $db->prepare("SELECT count(*) AS count FROM vhdl_schema WHERE id = :id");
		$exists->bindParam(":id", $id, PDO::PARAM_INT);
		if ($exists->execute()) {
			$count = $exists->fetch(PDO::FETCH_OBJ);
			if ($count->count == 0) {
				$app->response()->setStatus(404);
				$app->response()->header('X-Status-Reason', "Item was not found.");
			} else {
				$prepared = $db->prepare("DELETE FROM vhdl_schema WHERE id = :id");
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
});

$app->get('/schemas/:id', function ($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();

		$sth = $db->prepare("SELECT id AS id, user_id AS user_id, name, architecture, description, created 
            FROM vhdl_schema
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
});


$app->get('/schemas/:id/vhdls', function ($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();

		$sth = $db->prepare("SELECT * 
            FROM vhdl
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
});

$app->get('/schemas/:id/vhdls/last', function ($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();

		$sth = $db->prepare("SELECT * 
            FROM vhdl
            WHERE schema_id = :id
            ORDER BY id DESC
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
});