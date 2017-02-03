<?php

/*
  Author     : Tomáš Václavík <tomas.vaclavik at hotmail.com>
 */

//namespace TV\inc;

class SchemaDbMapper {

	private static $instance = null;
	private $messageHandler, $mysqli;

	private function __construct($mysqli, $messageHandler) {
		$this->mysqli = $mysqli;
		$this->messageHandler = $messageHandler;
	}

	public static function getInstance($mysqli, $messageHandler) {
		if (SchemaDbMapper::$instance == null) {
			SchemaDbMapper::$instance = new SchemaDbMapper($mysqli, $messageHandler);
		}
		return SchemaDbMapper::$instance;
	}

	public function setMysqliConnection($mysqli) {
		$this->mysqli = $mysqli;
	}

	public function setMessageHandler($messageHandler) {
		$this->messageHandler = $messageHandler;
	}

	public function addMessage($msg) {
		$this->messageHandler->addMessage($msg);
	}

	private function testId($id){
		return (is_numeric($id) && is_int((int)$id));
	}
	/**
	 * Načte informace požadovaného schéma z DB.
	 * Netestuje přístupová oprávnění uživatele k danému schéma!!!
	 * @param string $loginMail Přihlašovací e-mail identifikující uživatele
	 * @param int $id ID schéma
	 * @return array Asociativní pole s vlastnostmi jednoho schéma (jeden záznam).
	 * @throws \Exception
	 */
	public function getSchema($loginMail, $id) {
		if (!$this->testId($id)) {
			throw new \Exception('Nevalidní ID.');
		}
		$login = $this->mysqli->real_escape_string($loginMail);
		$query = "SELECT * FROM entity_schema WHERE mail='$login' AND id_schema=$id";
		$schemas = array();

		if (($result = $this->mysqli->query($query)) !== false) {

			if ($result->num_rows > 0) {
				while (($row = $result->fetch_assoc()) != false) {
					$schemas = array(
						'id' => $row['id_schema'],
						'entity' => $row['name'],
						'arch' => $row['architecture'],
						'mail' => $row['mail'],
						'title' => $row['title'],
						'creation_time' => $row['creation_time'],
						'last_update' => $row['last_update'],
						'graph' => $row['json_data'],
					);
				}
			}
		}
		return $schemas;
	}

	/**
	 * Načte základní informace všech schémat daného uživatele.
	 * Netestuje přístupová oprávnění uživatele k danému schéma!!!
	 * @param string $loginMail Přihlašovací e-mail identifikující uživatele
	 * @return array Pole schémat
	 */
	public function getSchemaList($loginMail) {
		$login = $this->mysqli->real_escape_string($loginMail);
		$query = "SELECT * FROM entity_schema WHERE mail='$login'";
		$schemas = array();

		if (($result = $this->mysqli->query($query)) !== false) {

			if ($result->num_rows > 0) {
				while (($row = $result->fetch_assoc()) != false) {
					$schemas[$row['id_schema']] = array(
						'id' => $row['id_schema'],
						'entity' => $row['name'],
						'arch' => $row['architecture'],
						'mail' => $row['mail'],
						'title' => $row['title'],
						'creation_time' => $row['creation_time'],
						'last_update' => $row['last_update'],
					);
				}
			}
		}
		return $schemas;
	}

	/**
	 * Uložení schéma v DB, s ošetřením vstupů!?
	 * @param string $nameSchema Název schéma
	 * @param string $archSchema Název architektury
	 * @param string $titleSchema Krátký popis schéma (max 100 znaků).
	 * @return array Data právě vytvořeného schéma.
	 * @throws Exception Nepovedený DB dotaz.
	 */
	public function createSchema($nameSchema, $archSchema, $titleSchema) {
		$name = $this->mysqli->real_escape_string($nameSchema);
		$arch = $this->mysqli->real_escape_string($archSchema);
		$title = $this->mysqli->real_escape_string($titleSchema);
		$query = "INSERT INTO entity_schema (mail, name, architecture, title) VALUES('" . $_SESSION['login'] . "','$name','$arch', '$title');";
		if (!$this->mysqli->query($query)) {
			throw new Exception("Chyba při ukládání do DB. Schéma nebylo vytvořeno! " + $this->mysqli->error);
		}
		return $this->getSchema($_SESSION['login'], $this->mysqli->insert_id);
	}

	/**
	 * Uloží JSON data schéma do DB.
	 * @param int $id ID schéma (remote ID), které se má uložit.
	 * @param string|json $json JSON reprezentace schéma (joint.js grafu)
	 * @return boolean
	 * @throws \Exception
	 */
	public function saveSchema($id, $json) {
		if (!$this->testId($id)) {
			throw new \Exception('Nevalidní ID schéma.');
		}
		$schemaData = $this->mysqli->real_escape_string($json);
		$query = "UPDATE entity_schema SET json_data='$schemaData', last_update=NOW() WHERE mail='" . $_SESSION['login'] . "' and id_schema=" . $id . ";";
		if (!$this->mysqli->query($query)) {
			throw new \Exception('Schéma se nepodařilo uložit do DB. : \n'.$id);
		} else {
			return $this->getSchema($_SESSION['login'], $id);
		}
	}

	/**
	 * Aktualizuje data zadaného schéma v DB.
	 * @param string $login Email uživatele
	 * @param int $id ID schéma
	 * @param string $schemaName Název Schéma
	 * @param string $schemaArch Název architektury
	 * @param string $schemaTitle Krátký popis (max. 100 znaků).
	 * @return array Data právě upraveného schéma z DB v asoc. poli.
	 * @throws Exception
	 */
	public function updateSchemaInfo($login, $id, $schemaName, $schemaArch, $schemaTitle) {
		if (!$this->testId($id)) {
			throw new Exception("Chybné zadané ID ($id). Schéma nebylo uloženo!");
		}
		$name = $this->mysqli->real_escape_string($schemaName);
		$arch = $this->mysqli->real_escape_string($schemaArch);
		$title = $this->mysqli->real_escape_string($schemaTitle);
		// zde je důležité v podmínce mít i e-mail uživatele, aby mohl upravovat pouze svá schémata.
		$query = "UPDATE entity_schema SET title='$title', name='$name', architecture='$arch' WHERE mail='$login' and id_schema=$id;";
		if (!$this->mysqli->query($query)) {
			throw new Exception("Chyba při ukládání do DB. Schéma nebylo uloženo! " . $this->mysqli->error);
		} else {
			return $this->getSchema($login, $id);
		}
	}
	
	/**
	 * Aktualizuje data zadaného schéma v DB.
	 * @param string $login Email uživatele - není uvnitř ošetřen pro DB
	 * @param int $id ID schéma
	 * @param string $schemaName Název Schéma
	 * @param string $schemaArch Název architektury
	 * @param string $schemaTitle Krátký popis (max. 100 znaků).
	 * @param string|json $json JSON reprezentace schéma (joint.js grafu)
	 * @return array Data právě upraveného schéma z DB v asoc. poli.
	 * @throws Exception
	 */
	public function updateSchema($login, $id, $schemaName, $schemaArch, $schemaTitle, $json) {
		if (!$this->testId($id)) {
			throw new Exception("Chybné zadané ID. Schéma nebylo uloženo!");
		}
		$schemaData = $this->mysqli->real_escape_string($json);
		$name = $this->mysqli->real_escape_string($schemaName);
		$arch = $this->mysqli->real_escape_string($schemaArch);
		$title = $this->mysqli->real_escape_string($schemaTitle);
		// zde je důležité v podmínce mít i e-mail uživatele, aby mohl upravovat pouze svá schémata.
		$query = "UPDATE entity_schema SET json_data='$schemaData', last_update=NOW(), title='$title', name='$name', architecture='$arch', last_update=NOW() WHERE mail='$login' and id_schema=$id;";
		if (!$this->mysqli->query($query)) {
			throw new Exception("Chyba při ukládání do DB. Schéma nebylo uloženo!");
		} else {
			return $this->getSchema($login, $id);
		}
	}
	
	public function deleteSchema($mail, $id){
		if (!$this->testId($id)) {
			throw new Exception("Chybné zadané ID. Schéma nebylo odstraněno!");
		}
		//$login = $this->mysqli->real_escape_string($mail);
		// zde je důležité v podmínce mít i e-mail uživatele, aby mohl upravovat pouze svá schémata.
		$query = "DELETE FROM entity_schema WHERE mail='$mail' and id_schema=$id;";
		if (!$this->mysqli->query($query)) {
			throw new Exception("Chyba při mazání schéma z DB. Schéma nebylo odstraněno!");
		} else {
			return true;
		}
	}

	/**
	 * Uloží kopii schéma z DB stejnému nebo jinému uživateli.
	 * @param string $loginMail E-mail uživatele kterému patří zadané schéma
	 * @param int $idFrom Id kopírovaného schéma
	 * @param string $loginMailTo E-mail Uživatele kterému bude schéma kopírováno. Pokud má hodnotu NULL je kopie uložena původnímu uživateli
	 * @return boolean
	 * @throws \Exceptio
	 */
	public function saveAs($loginMail, $idFrom, $loginMailTo = NULL) {
		$loginFrom = $this->mysqli->real_escape_string($loginMail);
		if (!$this->testId($idFrom)) {
			throw new \Exceptio('Nevalidní ID.');
		}
		if ($loginMailTo === NULL) {
			$loginTo = $loginFrom;
		} else {
			$loginTo = $this->mysqli->real_escape_string($loginMailTo);
		}
		$q1 = "SELECT * FROM entity_schema WHERE mail='$loginFrom' and id_schema=$idFrom;";
		if (($result = $this->mysqli->query($q1)) !== false) {
			$row = $result->fetch_assoc();
			$name = $this->mysqli->real_escape_string($row['name']);
			$arch = $this->mysqli->real_escape_string($row['architecture']);
			$title = $this->mysqli->real_escape_string($row['title']);
			$schemaData = $this->mysqli->real_escape_string($row['json_data']);
			$query = "INSERT INTO entity_schema (mail, name, architecture, title, json_data) VALUES('$loginTo','$name','$arch','$title','$schemaData');";
			if (!$this->mysqli->query($query)) {
				throw new \Exception('Kopii se nepodařilo uložit v DB.');
			} else {
				return $this->mysqli->insert_id;
			}
		} else {
			throw new \Exception('Kopírované schéma v DB neexistuje.');
		}
	}

}
