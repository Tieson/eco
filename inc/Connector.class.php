<?php
/* 
    Author     : Tomáš Václavík <tomas.vaclavik at hotmail.com>
*/

/**
 * Slouží pro získání připojení k DB
 */
class Connector {
	
	private static $localMysqli = null, $serverMysql = null;

	private static function createConnection($host, $hostname, $passwd, $db) {
		$mysqli = new mysqli($host, $hostname, $passwd, $db);
		
		if ($mysqli->connect_errno) {
			printf("Pripojeni k databazi selhalo: %s\n", $mysqli->connect_error);
			exit();
		}
		$mysqli->set_charset("utf8");
		return $mysqli;
	}

	public static function getLocalhostConnection() {
		if (Connector::$localMysqli==null){
			Connector::$localMysqli = Connector::createConnection('127.0.0.1', 'root', '', 'editorobvodu');
		}
		return Connector::$localMysqli;
	}
	
	public static function getDbServeronnection() {
		if (Connector::$serverMysql==null){
			Connector::$serverMysql = Connector::createConnection('localhost', 'ecoadmin', 'dj6hS93jdHdlWnCq39sd8ql7d', 'editorobvodu');
		}
		return Connector::$serverMysql;
	}
}



