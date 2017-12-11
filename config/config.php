<?php

class Config
{
	private static $path = '';
	private static $config = array(

		"release" => "local",
		'db' => array(
			'host' => '127.0.0.1',
			'user' => 'root',
			'password' => '',
			'database' => 'editorobvodu',
			'port' => '',
			'url_path' => '',
			'table_prefix' => '',
		),
		'libPath' => 'lib.vhd',
		'basepathApi' => '/eco/api',		//cesta k API
		'dir' => __DIR__,

		'absoluthPathBase' => '/',
		'base' => '',
		'cgipath' => 'cgi-bin/',
		'projectDir' => '',
		'datapath' => '',  //cesta k datům aplikace - využívána pro vivado
		'vivadoFileBase' => "/vivado/",
		'rootpath' => '../',
		'filetypes' => array(
			'normal' => 'normal',
			'etalon' => 'etalon',
			'test' => 'test'),

		'data' => array(
			'solutionStatuses' => array(
				'waiting' => 'waiting',
				'processing' => 'processing',
				'done' => 'done',
			)
		),
		'settings' => array(
			'check' => array(
				'isHomeworkDone' => TRUE,
				'checkSolutionsLimit' => TRUE,
				'disableAfterDeadline' => TRUE,
			),
			'limits' => array(
				'maxWaitingSolutions' => 3,
			),

		)


//	"release" => "local",
//	# Připojení k databázi
//	'db' => array(
//		'host' => '127.0.0.1',
//		'user' => 'root',
//		'password' => '',
//		'database' => 'editorobvodu',
//		'port' => '',
//		'url_path' => '',
//		'table_prefix' => '', #TODO: not implemented
//	),
//	'absoluthPathBase ' => $_SERVER['DOCUMENT_ROOT'],
//	'vendor' => 'vendor/',
//	'cgipath' => 'cgi-bin/',
//	'projectDir' => '',  # cesta od kořenového adresáře k výchozímu souboru aplikace (index.php)  #example: url: rlab.tul.cz/eco/index.php, basepath => '/eco' # cesta nesmí končit lomítkem
//	'datapath' => '',  #TODO: cesta k datům aplikace - využívána pro vivado
//	'rootpath' => './',
//
//	'filetypes' => array(
//	'normal' => 'normal',
//	'etalon' => 'etalon',
//	'test' => 'test'),
//
//	'data' => array(
//		'solutionStatuses' => array(
//			'waiting' => 'waiting',
//			'processing' => 'processing',
//			'done' => 'done',
//		)
//	)
	);

	public static function getConfig()
	{
		$path = __DIR__.'/config-data.php';
		self::$path = $path;
		if (file_exists($path)) {
			$data = include($path);
		} else {
			$data = array();
		}

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