<?php
session_start();

define('BASE_DIR', __DIR__ . '/');

require_once BASE_DIR . 'inc/debugger.php';
$debugger = TV\inc\DebuggerVoid::getInstance();

require_once BASE_DIR . 'inc/Connector.class.php';
require_once BASE_DIR . 'inc/Auth.class.php';
require_once BASE_DIR . 'inc/Message.class.php';
require_once BASE_DIR . 'inc/SchemaDbMapper.class.php';


$messages = new TV\inc\Message($debugger, 'messages');

$mysqli = TV\inc\Connector::getLocalhostConnection();
$autenticator = TV\inc\Auth::getInstance($mysqli, $messages);
$schemaAPI = TV\inc\Schema::getInstance($mysqli, $messages);



if (is_ajax()) {
	if (isset($_POST["action"]) && !empty($_POST["action"])) { //Checks if action value exists
		$action = $_POST["action"];
		
		switch ($action) { //Switch case for value of action
			case "getUserSchemas":
				if ($autenticator->autentizace()) {
					getUserSchemas($schemaAPI);
				}
				break;
			case "createNewSchema":
				if ($autenticator->autentizace()) {
					createNewSchema($schemaAPI);
				}
			case "schemaUpdateInfo":
				if ($autenticator->autentizace()) {
					schemaUpdateInfo($schemaAPI);
				}
			case "schemaSave":
				if ($autenticator->autentizace()) {
					saveSchema($schemaAPI);
				}
			case "schemaSaveAs":
				if ($autenticator->autentizace()) {
					schemaSaveAs($schemaAPI);
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

/**
 * Funkce otestuje jestli je požadavek od AJAXu a není to obyčejné zobrazení stránky
 * @return type
 */
function is_ajax() {
	return isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest';
}

/**
 * Vrací {arch, entity, mail, title}
 * @param type $schemas
 */
function getUserSchemas($schemas) {
	$return = $_POST;

	$data = $schemas->getSchemaList($_SESSION["login"]);
	$return["json"] = $data;
	echo json_encode($return);
}

function createNewSchema($schemaApi) {
	$data = $_POST;

	if (isset($data['schema'])) {
		$schema = $data['schema'];
		if (!testSchemaParams($schema)) {
			$return['resultStatus'] = false;
			//$return['resultMsg'] = 'Zadali jste chybně hodnoty entity (název, architek., popisek)';
		} else {
			if ($schemaApi->createSchema($schema)) {
				//$return["schema"] = $schema;
				$return['resultStatus'] = true;
			} else {
				$return['resultStatus'] = false;
			}
		}
	}

	//$return["schema"] = $schema;
	echo json_encode($return);
}

/**
 * Aktualizuje informace o schématu (jméno, architekturu a titulek)
 * @param type $schemaApi
 */
function schemaUpdateInfo($schemaApi) {
	$data = $_POST;

	if (isset($data['schema'])) {
		$schema = $data['schema'];
		if ($schemaApi->updateSchemaInfo($schema)) {
			$return['errorStatus'] = 0;
		} else {
			$return['errorStatus'] = 1;
		}
	}
	$return["result"] = $schema;

	echo json_encode($return);
}

/**
 * Aktualizuje informace o schématu (jméno, architekturu a titulek)
 * @param type $schemaApi
 */
function saveSchema($schemaApi) {
	$data = $_POST;

	if (isset($data['schema'])) {
		$schema = $data['schema'];
		if ($schemaApi->saveSchema($schema)) {
			$return['errorStatus'] = 0;
		} else {
			$return['errorStatus'] = 1;
		}
	}
	$return["result"] = $schema;

	echo json_encode($return);
}

function schemaSaveAs($schemaApi) {
	$data = $_POST;

	if (isset($data['schema'])) {
		$schema = $data['schema'];
		$newSchema = $data['newSchema'];
		if ($schemaApi->saveAs($schema, $newSchema)) {
			$return['resultStatus'] = true;
		} else {
			$return['resultStatus'] = false;
		}
	}
	$return["result"] = array('schema' => $schema, 'status' => 1);

	echo json_encode($return);
}

/**
 * Testuje povolený formát. Pouze znaky bez diakritiky, čísla a podtržítko.
 * nesmí být 2 podtržítka vedle sebe a první nesmí být číslo ani podtržítko, to nesmí být ani na konci
 * @param type $name
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
 * @param type $schema
 */
function testSchemaParams($schema) {
	//trimming
	$schema['name'] = trim($schema['name']);
	$schema['arch'] = trim($schema['arch']);
	$schema['title'] = trim($schema['title']);
	if (testName($schema['name']) && testName($schema['arch'])) {
		return true;
	}
	return false;
}


/**
 * Funkce získá všechny entity z  dané kategorie a naformátuje je do json podoby
 * @param type $category
 */
function getEntities(){
	$return = $_POST;

	$data = $schemas->getSchemaList($_SESSION["login"]);
	$return["json"] = $data;
	echo json_encode($return);
}