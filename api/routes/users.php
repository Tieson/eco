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


class Users{

	public static function allUsers(){
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

	public static function registerNew($mail, $name, $password){
		try
		{
			$values = array(
				'mail' => $mail,
				'name' => $name,
				'password' => $password,
			);
			$db = Database::getDB();
			$sth = $db->prepare("INSERT INTO user (mail, name, type_uctu, password) VALUES (:mail, :name, 'guest', :password)");
			$result = $sth->execute($values);

			if ($result){
				$id = $db->lastInsertId();
				$user = self::getUserDetail($id);

				if($user) {
//					Util::response($user);
				} else {
					throw new Exception('Uživatelský účet se nepovedlo vytvořit.');
				}
			}

		} catch(PDOException $ex) {
			throw new Exception('Účet se nepodařilo vytvořit, e-mail je již zaregistrován.');
//			Util::responseError($ex->getMessage(), 404);
		}
	}
	public static function changePassword($id, $password){
		try
		{
			$values = array(
				'id' => $id,
				'password' => $password,
			);
			$db = Database::getDB();
			$sth = $db->prepare("UPDATE user SET password=:password WHERE id=:id");
			$result = $sth->execute($values);

			if ($result){
				$user = self::getUserDetail($id);

				if($user) {
//					Util::response($user);
				} else {
					throw new Exception('Uživatelský účet se nepovedlo vytvořit.');
				}
			}

		} catch(PDOException $ex) {
			throw new Exception($ex->getMessage());
//			Util::responseError($ex->getMessage(), 404);
		}
	}


	public static function getUserDetail($id) {
			$db = Database::getDB();
			$sth = $db->prepare("SELECT name, mail, id FROM user WHERE id = :id");
			$sth->bindParam(':id', $id, PDO::PARAM_INT);
			$sth->execute();
			$user = $sth->fetch(PDO::FETCH_OBJ);

			if ($user) {
				return $user;
			} else {
				throw new PDOException('No records found.');
			}
	}
	public static function getUser($id) {
			$db = Database::getDB();
			$sth = $db->prepare("SELECT * FROM user WHERE id = :id");
			$sth->bindParam(':id', $id, PDO::PARAM_INT);
			$sth->execute();
			$user = $sth->fetch(PDO::FETCH_OBJ);

			if($user) {
				return $user;
			} else {
				throw new PDOException('No records found.');
			}
	}
}