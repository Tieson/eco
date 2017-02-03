<?php

/*
  Author     : Tomáš Václavík <tomas.vaclavik at hotmail.com>
 */
session_start();
header('Content-Type: application/json');
define('BASE_DIR', __DIR__ . '/');

require_once BASE_DIR . 'inc/debugger.php';
$debugger = TV\inc\DebuggerVoid::getInstance();

require_once BASE_DIR . 'inc/Connector.class.php';
require_once BASE_DIR . 'inc/Auth.class.php';
require_once BASE_DIR . 'inc/Message.class.php';
require_once BASE_DIR . 'inc/SchemaDbMapper.class.php';
require_once BASE_DIR . 'inc/Entities.class.php';

$mysqli = Connector::getLocalhostConnection();

$messages = new TV\inc\Message($debugger, 'messages');

$autenticator = TV\inc\Auth::getInstance($mysqli, $messages);
$schemaAPI = SchemaDbMapper::getInstance($mysqli, $messages);

/* předělat na REST API */

if (is_ajax()) {
	if (isset($_POST["action"]) && !empty($_POST["action"])) { //Check if action value exists
		$action = $_POST["action"];

		switch ($action) { //Switch case for value of action
			case "getUserSchemas":
				if (autenticate($autenticator)) {
					getUserSchemas($schemaAPI, $_POST);
				}
				break;
			case "getSchema":
				if (autenticate($autenticator)) {
					getSchema($schemaAPI, $_POST);
				}
				break;
			case "createNewSchema":
				if (autenticate($autenticator)) {
					createNewSchema($schemaAPI, $_POST);
				}
				break;
			case "schemaUpdateInfo":
				if (autenticate($autenticator)) {
					schemaUpdateInfo($schemaAPI, $_POST);
				}
				break;
			case "schemaSave":
				if (autenticate($autenticator)) {
					saveSchema($schemaAPI, $_POST);
				}
				break;
			case 'deleteSchema':
				if (autenticate($autenticator)) {
					deleteSchema($schemaAPI, $_POST);
				}
				break;
			case "logout":
				if ($autenticator->autentizace()) {
					$autenticator->logout();
				}
				break;
			case "login":
				$autenticator->mysql_login();
				break;
		}
	}
} else {
	if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
		$action = $_POST["action"];
		switch ($action) { //Switch case for value of action
			case "logout":
				if ($autenticator->autentizace()) {
					$autenticator->logout();
				}
				break;
			case "login":
				$autenticator->mysql_login();
				break;
		}
	}
	header('location: ./');
}

function jsonEncodeAndPrint($obj) {
	echo json_encode($obj);
}

function autenticate($autenticator) {
	if ($autenticator->autentizace()) {
		return true;
	} else {
		$result = array();
		jsonEncodeAndPrint($result['status'] = "auth failed");
		return false;
	}
}

/**
 * Funkce otestuje jestli je požadavek od AJAXu a není to obyčejné zobrazení stránky
 * @return type
 */
function is_ajax() {
	return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

/**
 * Vrací pole objektů typu: {'id', 'entity', 'arch', 'mail, 'title', 'creation_time','last_update'}
 * @param SchemaDbMapper $schemaDbMapper
 */
function getUserSchemas($schemaDbMapper, $post) {
	$return = array();
	$result = $schemaDbMapper->getSchemaList($_SESSION["login"]);
	$return["schemas"] = $result;
	echo json_encode($return);
}

/**
 * 
 * @param SchemaDbMapper $schemaDbMapper
 * @param POST $data
 */
function getSchema($schemaDbMapper, $data) {
	$result = array();

	if (isset($data['remoteId'])) {
		$id = $data['remoteId'];

		$result['schema'] = $schemaDbMapper->getSchema($_SESSION["login"], $id);
	}
	echo json_encode($result);
}

/**
 * 
 * @param SchemaDbMapper $schemaDbMapper
 * @param string|json $data
 */
function createNewSchema($schemaDbMapper, $data) {
	$result = array();
	$result['function'] = 'createNewSchema';
	$result['status'] = 'no data';

	if (isset($data['schemaInfo'])) {
		$info = $data['schemaInfo'];
		$result['schemaInfo'] = $info;

		if (!testSchemaParams($info)) {
			$result['status'] = 'invalid schema info';
		} else {
			try {
				$newSchema = $schemaDbMapper->createSchema($info['name'], $info['arch'], $info['title']);
				$result['schema'] = $newSchema;
				$result['status'] = 'ok';
			} catch (\Exception $ex) {
				$result['status'] = $ex->getMessage();
				;
			}
		}
	}
	echo json_encode($result);
}

/**
 * Aktualizuje informace o schématu (jméno, architekturu a titulek)
 * @param SchemaDbMapper $schemaDbMapper
 * @param string|json $data Data získaná pomocí AJAX dotazu
 */
function schemaUpdateInfo($schemaDbMapper, $data) {
	$result = array();
	$result['function'] = 'schemaUpdateInfo';
	$result['status'] = 'Invalid input data.';
	if (isset($data['schemaInfo'])) {
		$info = $data['schemaInfo'];
		$result["schemaInfo"] = $info;
		try {
			$newSchema = $schemaDbMapper->updateSchemaInfo($_SESSION['login'], (int) $info['remoteId'], $info['name'], $info['arch'], $info['title']);
			$result['schema'] = $newSchema;
			$result['status'] = 'ok';
		} catch (Exception $ex) {
			$result['status'] = 'Error: ' . $ex->getMessage();
		}
	} else {
		$result['status'] = 'Invalid input data!';
	}

	echo json_encode($result);
}

/**
 * Uloží schéma (JSON data)
 * @param SchemaDbMapper $schemaDbMapper
 * @param string|json $data Data získaná pomocí AJAX dotazu
 */
function saveSchema($schemaDbMapper, $data) {
	$result = array();
	$result['function'] = 'schemaSave';
	$result['status'] = 'Invalid input data.';
	if (isset($data['schema']) && isset($data['schema']['graph']) && isset($data['schema']['schemaInfo'])) {
		$schema = $data['schema'];
		$result["schemaInfo"] = $schema['schemaInfo'];
		$graph = $schema['graph'];
		try {
			$result['schema'] = $schemaDbMapper->saveSchema((int) $schema['schemaInfo']['remoteId'], $graph);
			$result['status'] = 'ok';
		} catch (Exception $ex) {
			$result['status'] = $ex->getMessage();
		}
	}
	echo json_encode($result);
}

/**
 * 
 * @param type $schemaDbMapper
 * @param type $data
 */
function deleteSchema($schemaDbMapper, $data) {
	$result = array();
	$result['function'] = 'deleteSchema';
	$result['status'] = 'Invalid input data.';
	if (isset($data['schemaInfo']) && isset($data['schemaInfo']['remoteId'])) {
		try {
			$schemaDbMapper->deleteSchema($_SESSION['login'], (int) $data['schemaInfo']['remoteId']);
			$result['status'] = 'ok';
		} catch (Exception $ex) {
			$result['status'] = $ex->getMessage();
		}
	}
	echo json_encode($result);
}

//function schemaSaveAs($schemaApi, $data) {
//	$return = array();
//	if (isset($data['schema'])) {
//		$schema = $data['schema'];
//		$newSchema = $data['newSchema'];
//		if ($schemaApi->saveAs($schema, $newSchema)) {
//			$return['resultStatus'] = true;
//		} else {
//			$return['resultStatus'] = false;
//		}
//		$return["result"] = array('schema' => $schema, 'status' => 1);
//	}
//	$return['resultStatus'] = false;
//
//	echo json_encode($return);
//}

/**
 * Testuje povolený formát. Pouze znaky bez diakritiky, čísla a podtržítko.
 * nesmí být 2 podtržítka vedle sebe a první nesmí být číslo ani podtržítko, to nesmí být ani na konci
 * @param string $name
 * @return boolean
 */
function testName($name) {
	if (preg_match('/^[a-zA-Z](_?[a-zA-Z0-9])*[a-zA-Z0-9]*$/i', $name)) {
		return true;
	}
	return false;
}

/**
 * Schéma má mít podobu {name, arch, title}
 * @param array $info
 * @return boolean
 */
function testSchemaParams($info) {
	//trimming
	$info['title'] = trim($info['title']);
	if (testName($info['name']) && testName($info['arch'])) {
		return true;
	}
	return false;
}
