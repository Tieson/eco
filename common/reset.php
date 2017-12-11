
<a href="?print">NIC</a><br>
<a href="?reset">RESET</a><br>
<a href="?del=solutions">SMAZAT ŘEŠENÍ</a><br>

<?php
session_cache_limiter(false);
session_start();
date_default_timezone_set("Europe/Prague");

require_once '../config/config.php';
require_once '../vendor/autoload.php';
require_once 'utils.php';
require_once 'database.php';


$config = Config::getConfig();
$basedir = $config['projectDir'];



$db = Database::getDB();

echo "<pre>";

echo "<h2>autotest_status</h2>";
$query = $db->prepare("SELECT * FROM `autotest_status`");
$result = $query->execute();
var_dump($query->fetchAll(PDO::FETCH_ASSOC));

echo "<h2>Solutions</h2>";
$query = $db->prepare("SELECT * FROM `solution` WHERE `status` = 'processing'");
$result = $query->execute();
var_dump($query->fetchAll(PDO::FETCH_ASSOC));



if (isset($_GET["reset"])) {
	$query = $db->prepare("TRUNCATE TABLE `autotest_status`");
	$result = $query->execute();

	$query = $db->prepare("UPDATE `solution` SET `status` = 'waiting' WHERE `status` = 'processing'");
	$result = $query->execute();
	echo "<h2>Byly resetovány stavy simulace.</h2>";
}

if (isset($_GET["del"]) && $_GET["del"]=='solutions') {
	$query = $db->prepare("TRUNCATE TABLE `solution`");
	$result = $query->execute();
	echo "<h2>Byla smazána všechna řešení</h2>";
}


echo "</pre>";

?>


