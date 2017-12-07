<?php

//function getUsedUserSimulations($user_id, $second = 3600, $deleteTimespan = 3600) {
//	$db = getDB();
//	$query_delete = $db->prepare("DELETE FROM `user_limits` WHERE time < NOW() - ?;");
//	$query_delete->bindParam(1, $deleteTimespan, PDO::PARAM_INT);
//	$query_delete->execute();
//
//	$query = $db->prepare("SELECT COUNT(*) AS pocet FROM user_limits WHERE user_id=? AND time >= NOW() - ?;");
//	$query->bindParam(1, $user_id, PDO::PARAM_INT);
//	$query->bindParam(2, $second, PDO::PARAM_INT);
//	$query->execute();
//	$result = $query->fetchObject();
//	$db = null;
//	return $result->pocet;
//}

function getWaitingCount($user_id) {
	$db = getDB();
	$query = $db->prepare("SELECT COUNT(*) AS pocet FROM solution WHERE user_id=:user_id AND status='waiting'");
	$query->bindParam('user_id', $user_id, PDO::PARAM_INT);
	$query->execute();
	$result = $query->fetchObject();
	return $result->pocet;
}

function isTaskValid($id, $absoluthPathBase = "")
{
	$require_etalon = FALSE;
	$require_test = FALSE;

	try {
		$db = getDB();
		$sth = $db->prepare("SELECT file, type, count(type) AS count FROM `task_files` WHERE task_id=:id GROUP BY type");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->execute();
		$items = $sth->fetchAll(PDO::FETCH_ASSOC);

		foreach ($items as $key => $value) {
			if ($value['type'] == 'etalon' && $value['count'] == 1) {
				$require_etalon = $value['file'];
			} else if ($value['type'] == 'test' && $value['count'] == 1) {
				$require_test = $value['file'];
			}
		}

		//test jestli je přidát soubor se správným řešením
		if ($require_etalon === FALSE) {
			throw new Exception("There is no required etalon file for simulation.");
		}
		//test jestli je přidán testbench
		if ($require_test === FALSE) {
			throw new Exception("There is no required testbench file for simulation.");
		}

		// zjištění názvu entity a jestli je obsažěna v testbenchi
		$sth = $db->prepare("SELECT entity FROM `task` WHERE id=:id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->execute();
		$result = $sth->fetch(PDO::FETCH_OBJ);
		$entity = $result->entity;

		$fullPath_etalon =  $absoluthPathBase.$require_etalon;

		$etalonVhdl = file_get_contents($fullPath_etalon);
		if ($etalonVhdl === FALSE) {
			throw new Exception("Can not read etalon file: ".$fullPath_etalon);
		}
		$fullPath_test =  $absoluthPathBase.$require_test;
		$testVhdl = file_get_contents($fullPath_test);
		if ($testVhdl === FALSE) {
			throw new Exception("Can not read testbench file.");
		}
		//Test jestli testbench obsahuje entitu uvedenou v testbenchi
		$entityCorrect = strpos($testVhdl, $entity);
		if ($entityCorrect === FALSE) {
			throw new Exception("Uvedená entita nebyla nalezena v souboru " . basename($require_test));
		}

		return TRUE;

	} catch (PDOException $e) {
		return array("error"=>$e->getMessage());
	} catch (Exception $e) {
		return array("error"=>$e->getMessage());
	}

}