<?php

return array(
	"release" => "public",
	'db' => array(
		'host' => 'localhost',
		'user' => 'eco_u',
		'password' => 'Rep0wooCoo',
		'database' => 'eco',
	),
	'libPath' => '/eco/lib.vhd', 		//cesta k souboru s knihovnou entit
	'absoluthPathBase' => '/var/www/html/', //absolutni cesta ke korenovemu adresari
	'cgipath' => '/var/www/cgi-bin/',	//cesta ke slozce pro spustitelne scripty + projekt baliku vivado
	'projectDir' => '/eco', 	//relativni cesta umisteni projektu v absolutni ceste (absoluthPathBase)
	'vivadoProjectsDir' => '/var/www/cgi-bin/vivado/projects/', //cesta ke slozce s projekty Vivada

	'token' => array(
		'secondsLifetime' => 3600, // 2 hodiny
		'secret' => 'djo9816s2RBQ69Kkpx012b3m009bdImK',
	),
	'admin' => array(
		'name' => 'Administrátor',
		'password' => 'prenastavteprosimhesloadministratorovi',
	),
	'organizationMailDomain' => 'tul.cz',
	'activationMail' => array(
		'from' => 'root@rlabu.ite.tul.cz',
		'fromName' => 'root',
		'subject' => 'Editor číslicových obvodů - ověření e-mailu',
		'page' => 'rlabu.ite.tul.cz/eco/'
	),
);