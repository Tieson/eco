<?php

return array(
	"release" => "public",
	'db' => array(
		'host' => 'localhost',
		'user' => 'eco_u',
		'password' => 'Rep0wooCoo',
		'database' => 'eco',
	),
	'base' => '../',
	'absoluthPathBase' => '/var/www/html/', //$_SERVER['DOCUMENT_ROOT']
	'projectDir' => '/eco', 		//spojen�m s absoluthPathBase d�v� cestu k projektu
	'libPath' => '/eco/lib.vhd', 		//cesta k souboru s knihovnou entit pou��van�ch v editoru
	'cgipath' => '/var/www/cgi-bin/',	//absolutn� cesta k adres��i script�
	'vendor' => '/var/www/html/eco/vendor/',//absolutn� cesta do slo�ky vendor
	'basepathApi' => '/eco/api',		//cesta k API
	'dir' => __DIR__,

);