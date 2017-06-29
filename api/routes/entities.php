<?php
/**
 * Created by Tom on 23.02.2017.
 */
/**
 * Created by PhpStorm.
 * User: Tom
 * Date: 23.02.2017
 * Time: 22:37
 */


$app->get('/categories', function () {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT id_cat AS id, name
            FROM entity_cat");

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

$app->get('/entities', function () {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT id_entity AS id, id_cat AS id_category, name, label, architecture, vhdl, inputs_count FROM entities");
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

$app->get('/categories/:id/entities', function ($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT id_entity AS id, id_cat AS id_category, name, label, architecture, vhdl, inputs_count
            FROM entities WHERE id_cat = :id");

		$sth->bindParam(':id', $id, PDO::PARAM_INT);
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