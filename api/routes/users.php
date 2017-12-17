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
	try
	{
		$db = Database::getDB();
		$sth = $db->prepare("SELECT * FROM user");
		$sth->execute();
		$users = $sth->fetchAll(PDO::FETCH_OBJ);

		if($users) {
			Util::response($users);
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		Util::responseError($e->getMessage(), 404);
	}
}


function user($id) {
	try
	{
		$db = Database::getDB();
		$sth = $db->prepare("SELECT * FROM user WHERE id = :id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->execute();
		$user = $sth->fetch(PDO::FETCH_OBJ);

		if($user) {
			Util::response($user);
		} else {
			throw new PDOException('No records found.');
		}
		return $user;

	} catch(PDOException $e) {
		Util::responseError($e->getMessage(), 404);
		return FALSE;
	}
}