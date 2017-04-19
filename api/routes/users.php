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



function users(){
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT *
            FROM user");
		$sth->execute();
		$users = $sth->fetchAll(PDO::FETCH_OBJ);

		if($users) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($users);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}


function user($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT *
            FROM user
            WHERE id = :id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->execute();
		$users = $sth->fetch(PDO::FETCH_OBJ);

		if($users) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($users);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}