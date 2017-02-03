<?php
/* 
    Author     : Tomáš Václavík <tomas.vaclavik at hotmail.com>
*/

namespace TV\inc;

/**
 * Třída poskytuje funkce pro získání entit a jejich kategorií, které lze umístit do schéma.
 * Funkce se pro data dotazují do DB
 */
class Entities {

	/**
	 * Funkce získá seznam všech kategorií entit uložených v DB
	 * @param mysqli $mysqli spojení s DB
	 * @return array tabulka categorií
	 */
	static function getEntityCategories($mysqli) {
		$query = "SELECT * FROM `entity_cat`";
		$categories = array();
		if (($result = $mysqli->query($query)) !== false) {
			while ($row = $result->fetch_assoc()) {
				$categories[] = $row;
			}
		}
		return $categories;
	}

	/**
	 * Funkce získá seznam všech entit (ktelé lze umístit do schéma) uložených v DB
	 * @param mysqli $mysqli Spojení s DB
	 * @param int $category ID kategorie v DB
	 * @return array tabulka entit
	 */
	static function getEntities($mysqli, $category = null) {
		$query = "SELECT * FROM `entities`" . ($category !== null ? ' WHERE id_cat=' . $category : '');
		$entities = array();
		if (($result = $mysqli->query($query)) !== false) {
			while ($row = $result->fetch_assoc()) {
				$entities[] = $row;
			}
		}
		return $entities;
	}

	/**
	 * Získá sznam entit které si definoval a uložil sám uživatel.
	 * Tato funkce neí v GUI podporována a seznam je tak vždy prázdný!
	 * @param mysqli $mysqli Připojení k DB
	 * @param string $user E-mail užtivatele, kterému mají entity patřit
	 * @return array tabulka kategorií
	 */
	static function getUserEntities($mysqli, $user) {
		$query = "SELECT * FROM `entities` WHERE mail='$user'";
		$entities = array();
		if (($result = $mysqli->query($query)) !== false) {
			while ($row = $result->fetch_assoc()) {
				$entities[] = $row;
			}
		}
		return $entities;
	}

}
