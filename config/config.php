<?php

class Config
{
	private static $path = '';
	private static $loaded = FALSE;
	private static $config = array(
		"release" => "local",
		'salt' => 'sůl',
		'db' => array(
			'host' => '127.0.0.1',
			'user' => 'root',
			'password' => '',
			'database' => 'editorobvodu',
			'port' => '',
		),

		'libPath' => 'lib.vhd',
		'absoluthPathBase' => 'C:\Users\Tom\TUL\ING\semestr-2\DipProjekt\EditorObvodu\source/',
		'cgipath' => 'cgi-bin/',
		'projectDir' => '',
		'vivadoProjectsDir' => '/var/www/cgi-bin/vivado/projects/',

		'token' => array(
			'secondsLifetime' => 3600,
			'secret' => 'djo9816s2RBQ69Kkpx012b3m009bdImK',
		),
		'admin' => array(
			'login' => 'admin',
			'name' => 'Administrátor',
			'password' => 'prenastavteprosimhesloadministratorovi',
		),
		'organizationMailDomain' => 'tul.cz',
		'activationMail' => array(
			'from' => 'tomas.vaclavik@tul.cz',
			'fromName' => 'tomas.vaclavik@tul.cz',
			'subject' => 'Editor číslicových obvodů - ověření e-mailu',
			'page' => 'eco.local/'
		),
		'settings' => array(
			'check' => array(
				'disableAfterHomeworkDone' => FALSE,
				'disableAfterDeadline' => FALSE,
			),
			'limits' => array(
				'maxWaitingSolutions' => 3,
			),
		),
	);

	public static function getConfig()
	{
		if (self::$loaded){
			return self::$config;
		}

		$path = __DIR__.'/config-data.php';
		self::$path = $path;
		if (file_exists($path)) {
			$data = include($path);
		} else {
			$data = array();
		}
		self::$loaded = TRUE;

//		echo '<pre>';
//		var_dump(__FILE__);
//		var_dump(__DIR__);
//		var_dump($path);
//		var_dump($data);
//		var_dump(self::$config);
//		echo '</pre>';

		self::$config = array_merge(self::$config, $data);
		return self::$config;
	}

	public static function getKey($key, $delimiter = '/') {
		$config = self::getConfig(self::$path);
		$parts = explode($delimiter, $key,10);
		if(count($parts) == 0){
			return false;
		}
		$result = $config;
		foreach ($parts as $part){
			if(isset($result[$part])){
				$result = $result[$part];
			}else {
				return false;
			}
		}
		return $result;
	}

}