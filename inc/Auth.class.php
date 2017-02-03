<?php
/* 
    Author     : Tomáš Václavík <tomas.vaclavik at hotmail.com>
*/
namespace TV\inc;

class Auth {

	private static $instance = null;
	private $messageHandler, $mysqli;

	private function __construct($mysqli, $messageHandler) {
		$this->mysqli = $mysqli;
		$this->messageHandler = $messageHandler;
	}

	public static function getInstance($mysqli = null, $messageHandler = null) {
		if (Auth::$instance == null) {
			if ($mysqli != null && $messageHandler != null) {
				Auth::$instance = new Auth($mysqli, $messageHandler);
			}
		}
		return Auth::$instance;
	}

	public function setMysqliConnection($mysqli) {
		$this->mysqli = $mysqli;
	}

	public function setMessageHandler($messageHandler) {
		$this->messageHandler = $messageHandler;
	}

	public function autentizace() {
		if (isset($_SESSION["prihlaseni"]) && $_SESSION["prihlaseni"] === true) {
			return true;
		}
		return false;
	}

	public function getName() {
		if (isset($_SESSION["jmeno"]) && isset($_SESSION["prijmeni"])) {
			return array(
				'name' => $_SESSION["jmeno"],
				'surname' => $_SESSION["prijmeni"],
			);
		} else {
			return array(
				'name' => '',
				'surname' => '',
			);
		}
	}

	public function logout() {
		if (isset($_GET['logout'])) {
			$_SESSION["prihlaseni"] = false;
			unset($_SESSION["prihlaseni"]);
			unset($_SESSION["jmeno"]);
			unset($_SESSION["prijmeni"]);
			unset($_SESSION["login"]);
			$this->messageHandler->addMessage('Právě jste byli odhlášeni.');
			header('location:./');
			exit();
		}
	}

	private static function isRequiredExist($required) {
		if ($_SERVER["REQUEST_METHOD"] == "POST") {
			for ($i = 0; $i < count($required); $i++) {
				if (!isset($_POST[$required[$i]])) {
					return false;
				}
			}
			return true;
		}
		return false;
	}

	private static function isRequiredNoEmpty($required) {
		if ($_SERVER["REQUEST_METHOD"] == "POST") {
			for ($i = 0; $i < count($required); $i++) {
				if (!isset($_POST[$required[$i]]) || empty($_POST[$required[$i]])) {
					return false;
				}
			}
			return true;
		}
		return false;
	}

	/**
	 * Kontrola jména, ale bez diakritity, puze a-Z a mezera
	 * @param type $name
	 * @return boolean
	 */
	private function checkName($name) {
		if (empty($name)) {
			return false;
		} else {
			$name = $this->mysqli->real_escape_string(htmlspecialchars(trim($name)));
			return $name;
			// check if name only contains letters and whitespace
//			if (!preg_match("/^[a-zA-Z ]*$/", $name)) {
//				return false;
//			}
		}
	}

	private function mailCheck($mail) {
		if (empty($mail)) {
			return false; /* mail není vyplněn */
		} else {
			// check if e-mail address is well-formed
			$email = trim($mail);
			if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
				return false;
			}
			return $email;
		}
	}

	private $loginRequiredInputs = array('f_mail', 'f_passwd');

	public function mysql_login() {
		if (Auth::isRequiredNoEmpty($this->loginRequiredInputs)) {
			if (($mail = Auth::mailCheck($_POST["f_mail"])) === FALSE) {
				$this->messageHandler->addMessage('Zadaný e-mail nemá správný formát.');
				return false;
			}
			if (($result = $this->mysqli->query("SELECT * FROM users WHERE mail='$mail'")) !== false) {
				if ($result->num_rows === 1) {
					$row = $result->fetch_assoc();
					if (Auth::verifyPassword($_POST["f_passwd"], $row['password'])) {
						$_SESSION["prihlaseni"] = true;
						$_SESSION["login"] = $row["mail"];
						$_SESSION["jmeno"] = $row["name"];
						$_SESSION["prijmeni"] = $row["surname"];
						$this->messageHandler->addMessage('Přihlášení bylo úspěšné.<br>Přihlášeni jako: ' . $row['name'] . " " . $row['surname']);
						return true;
					} else {
						$_SESSION["prihlaseni"] = false;
						$_SESSION["login"] = "";
						$_SESSION["jmeno"] = "";
						$_SESSION["prijmeni"] = "";
						$this->messageHandler->addMessage('Přihlášení se nezdařilo');
					}
				}
			}
			return array('mail' => htmlspecialchars($_POST["f_mail"]));
		}
		return false;
	}

	public function testUserExist($mail) {
		$query = "SELECT name FROM `users` WHERE mail=" . $this->mysqli->real_escape_string($mail) . ' LIMIT 1';
		if (($result = $this->mysqli->query($query)) !== false) {
			if ($result->num_rows === 1) {
				return true;
			}
		}
		return false;
	}

	private $regRequiredInputs = array('f_mail', 'f_name', 'f_surname', 'f_passwd1', 'f_passwd2');

	public function mysql_registration() {
		if (Auth::isRequiredNoEmpty($this->regRequiredInputs)) {
			if (($mail = Auth::mailCheck($_POST["f_mail"])) === FALSE) {
				return false;
			}
			$name = Auth::checkName($_POST["f_name"]);
			$surname = Auth::checkName($_POST["f_surname"]);
			$pass1 = Auth::hash($_POST["f_passwd1"]);
			$pass2 = Auth::hash($_POST["f_passwd2"]);
			if ($pass1 === $pass2) {
				return array($mail, $name, $surname);
			}

			if (!Auth::testUserExist($mail)) {
				$query = "INSERT INTO `users` (`mail`, `password`, `name`, `surname`, `reg_date`) VALUES('$mail', '$pass1', '$name', '$surname', NOW())";
				if (($result = $this->mysqli->query($query)) !== false) {
					return true;
				} else {
					
				}
			} else {
				$this->messageHandler->addMessage("Uživatel s tímto e-mailem již existuje!");
			}
		}
		return false;
	}

	public function mysqli_changePassword() {
		if (!$this->autentizace()) {
			$this->messageHandler->addMessage('Nejste přihlášeni. Pro změnu heslase nejprve přihlašte.');
			throw new \Exception('Nejste přihlášeni. Pro změnu hesla se nejprve přihlašte.');
			return false;
		}
		if (Auth::isRequiredNoEmpty(array('f_passwd1', 'f_passwd2', 'f_passwdOld'))) {

			$pass1 = Auth::hash($_POST["f_passwd1"]);
			$pass2 = Auth::hash($_POST["f_passwd2"]);
			if ($pass1 !== $pass2) {
				return false;
			}

			$mail = $_SESSION["login"];

			if (($result = $this->mysqli->query("SELECT * FROM users WHERE mail='$mail'")) !== false) {
				if ($result->num_rows === 1) {
					$row = $result->fetch_assoc();
					if (Auth::verifyPassword($_POST["f_passwdOld"], $row['password'])) {
						if ($this->mysqli->query("UPDATE users SET password='" . $pass1 . "' WHERE mail='$mail'")) {
							$this->messageHandler->addMessage('Heslo bylo úspěšně změněno.');
							$result->close();
							return true;
						} else {
							$this->messageHandler->addMessage('Heslo se nepodařilo změnit.');
							$result->close();
							return false;
						}
					} else {
						$this->messageHandler->addMessage('Původní heslo se neshoduje s heslem uživatele.');
						$result->close();
						return false;
					}
				}
				$result->close();
			}
		}
		return false;
	}


	public static function hash($text) {
		return password_hash($text, PASSWORD_DEFAULT);
	}

	public static function verifyPassword($password, $hash) {
		return password_verify($password, $hash);
	}

}
