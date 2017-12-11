<?php

class Database
{
	private static $db = NULL;

	public static function getDB()
	{
		if (self::$db == NULL) {
			self::$db = self::getAnotherDB();
		}
		return self::$db;
	}

	public static function getAnotherDB()
	{
		$config = Config::getConfig();
		$dbhost = $config['db']['host'];
		$dbuser = $config['db']['user'];
		$dbpass = $config['db']['password'];
		$dbname = $config['db']['database'];

		$mysql_conn_string = "mysql:host=$dbhost;dbname=$dbname;charset=utf8";
		$dbConnection = new PDO($mysql_conn_string, $dbuser, $dbpass);
		$dbConnection->exec("set names utf8");
		$dbConnection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		return $dbConnection;
	}
}