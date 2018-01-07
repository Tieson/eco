<?php
/**
 * Created by Tom on 23.02.2017.
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

	public static function haveEmailDomain($domian, $email){
		if (preg_match('/(@'.$domian.')$/',$email)){
			return TRUE;
		}
		return FALSE;
	}

	public static function registerNew($mail, $name, $password){
		try
		{
			$role = self::haveEmailDomain(Config::getKey('organizationMailDomain'), $mail)?'student':'guest';
			$token = Util::jwtEncode(
				AuthRoute::createJwtHeader(),
				array('created' => time(),
					'mail' => $mail),
				Config::getKey('token/secret')
			);
			$values = array(
				'mail' => $mail,
				'name' => $name,
				'password' => $password,
				'role' => $role,
				'token' => $token
			);
			$db = Database::getDB();
			$sth = $db->prepare("INSERT INTO user (mail, name, type_uctu, password, token) VALUES (:mail, :name, :role, :password, :token)");
			$result = $sth->execute($values);

			if ($result){
				Util::sendTokenByMail($mail,$name,$token);

				$id = $db->lastInsertId();
				$user = self::getUserDetail($id);

				if($user) {
//					Util::response($user);
				} else {
					throw new Exception('Uživatelský účet se nepovedlo vytvořit.');
				}
			}

		} catch(PDOException $ex) {
			throw new Exception('Účet se nepodařilo vytvořit, e-mail je již zaregistrován.' );
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
			$sth = $db->prepare("SELECT name, mail, id, type_uctu FROM user WHERE id = :id");
			$sth->bindParam(':id', $id, PDO::PARAM_INT);
			$sth->execute();
			$user = $sth->fetch(PDO::FETCH_OBJ);

			if ($user) {
				return $user;
			} else {
				throw new PDOException('No records found.');
			}
	}

	public static function getUserByMail($mail) {
			$db = Database::getDB();
			$sth = $db->prepare("SELECT name, mail, id, type_uctu, activated, created, token FROM user WHERE mail = :mail");
			$sth->bindParam(':mail', $mail, PDO::PARAM_INT);
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
	public static function removeUser($id) {
			$db = Database::getDB();
			$sth = $db->prepare("DELETE FROM user WHERE id = :id");
			$sth->bindParam(':id', $id, PDO::PARAM_INT);
			$sth->execute();
	}
	public static function removeUserByMail($mail) {
			$db = Database::getDB();
			$sth = $db->prepare("DELETE FROM user WHERE mail = :mail");
			$sth->bindParam(':mail', $mail, PDO::PARAM_INT);
			$sth->execute();
	}

	public static function isAccountEmpty($email) {
		try {
			$user = Users::getUserByMail($email);
			try {
				$token = Util::getJwtData($user->token);
				$curTime = time();
				$created = $token['payload']->created;
				if (!$user->activated && $curTime - $created > Config::getKey('token/secondsLifetime')) {
					self::removeUser($user->id);
					return TRUE;
				}else{
					return FALSE;
				}
			}catch(AuthorizationException $ex){
				return FALSE;
			}
			catch (PDOException $ex) {
				return FALSE;
			}
		}
		catch (PDOException $ex) {
			return TRUE;
		}
	}

	public static function activateAccount($passed_token)
	{
		try {
			$token = Util::getJwtData($passed_token);
			$curTime = time();
			$created = $token['payload']->created;
			$mail = $token['payload']->mail;
			$user = Users::getUserByMail($mail);

			if ($user->activated) {
				return TRUE;
			}

			if ($user->token == $passed_token) {
				if ($curTime - $created < Config::getKey('token/secondsLifetime')){
					$db = Database::getDB();
					$sth = $db->prepare("UPDATE user SET activated=1 WHERE id = :id");
					$sth->bindParam(':id', $user->id, PDO::PARAM_INT);
					$result = $sth->execute();
					if ($sth->execute()) {
						return TRUE;
					}
				}
			}
		} catch (Exception $ex) {
			return FALSE;
		}
		return FALSE;
	}
}