
<?php
session_cache_limiter(false);
//session_start();

$config = require('../api/config/config.php');
$basedir = $config['basepath'];

require $config['vendor'].'/autoload.php';

/*
 * Získání spojení s DB
 */
function getDB()
{
	global $config;
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

$db = getDB();

/**
 * Získání Dalšího dosud nezkontrolovaného řešení
 * @param $db Připojení k DB
 * @return bool Objekt řešení načtený z DB, nebo FALSE pokud nebylo nic nalezeno
 */
function getNextSolution($db){
	$sth = $db->prepare("SELECT s.id, s.homework_id, s.created, s.status, s.test_result, s.test_message, hw.task_id, s.vhdl, s.name
            FROM solution AS s 
            JOIN `hw_assigment` AS hw
            ON s.homework_id = hw.id
            WHERE s.status='waiting'
            ORDER BY s.created DESC 
            LIMIT 1");
	$result = $sth->execute();
	if ($result) {
		$responseResult = $sth->fetchAll(PDO::FETCH_OBJ);
		if ($responseResult) {
			foreach($responseResult as $object) {
				return $object;
			}
//			echo json_encode($responseResult);
		}
	}
	return false;
}

/**
 * Pomocný informační výpis objektu
 * @param $object
 */
function echoObject($object) {
	print "<pre>\n";
	foreach($object as $key => $value) {
		print "$key => $value\n";
	}
	print "</pre>\n\n";
}

/**
 * Vrátí TCL script pro testování konkrétního řešení
 * @param $etalon Cesta k souboru se správným referenčním řešením
 * @param $testbench Cesta k testovacímu souboru s vdl
 * @param $subject Cesta k testovanému řešení (od studenta)
 * @param string $vivadoBasedir Cesta ke kořenovému adresáři pro testování
 * @param string $projectName Cesta k souboru s Vivado projektem
 * @param string $lib Cesta ke knihovně vlastních entit
 * @return string TCL script
 */
function makeTclContent($etalon,
                        $testbench,
                        $subject,
                        $vivadoBasedir = "/var/www/html",
                        $projectName = "/eco/vivado/autovalidation/project_1.xpr",
						$lib = "/eco/lib.vhd"
){
	//TODO: upozornit na to, že entita se musí jemnovat stejně jako soubor
	$info = pathinfo($testbench);
	$tbName = $info['filename'];
	return "open_project {$vivadoBasedir}{$projectName}\n
		\n
		add_files -norecurse -scan_for_includes {{$vivadoBasedir}{$lib} {$vivadoBasedir}{$etalon} {$vivadoBasedir}{$testbench} {$vivadoBasedir}{$subject}}\n
		set_property SOURCE_SET sources_1 [get_filesets sim_1]\n
		add_files -fileset sim_1 -norecurse -scan_for_includes {$vivadoBasedir}{$testbench}\n
		\n
		set_property top {$tbName} [get_filesets sim_1]\n
		\n
		launch_simulation";
}

/**
 * Return first found file of type
 * @param $files List of files
 * @param $type Type of required file
 * @return mixed Path to found file
 */
function getFileOfType($files, $type) {
	foreach($files as $file) {
		if ($file->type==$type){
			return $file;
		}
	}
}

/**
 * Load and return test and etalon file (as assoc array)
 * @param $db DB connection
 * @param $config Configuration object
 * @param $taskId The ID of Task with files we require
 * @return array Found files.
 */
function getSolutionsFiles($db, $config, $taskId){
	echo "<br>\n".$taskId."<br>\n<br>\n";
	$test = "";
	$etalon = "";

	$sth = $db->prepare("SELECT file, name, type  
            FROM task_files
           	WHERE task_id = :task_id");
	$sth->bindParam(':task_id', $taskId, PDO::PARAM_INT);

	$result = $sth->execute();
	if ($result) {
		$responseResult = $sth->fetchAll(PDO::FETCH_OBJ);
		if ($responseResult) {
			foreach($responseResult as $object) {
				echoObject($object);
			}
			$test = getFileOfType($responseResult, $config['filetypes']['test']);
			$etalon = getFileOfType($responseResult, $config['filetypes']['etalon']);
//			echo json_encode($responseResult);
		}
	}

	$files = array(
		"test" => $test->file,
		"etalon" => $etalon->file,
	);
	return $files;
}


function getSolutionPath($taskId){
	return 'eco/soubory/task_'.$taskId."/result/";
}

/**
 * Saves text to file
 * @param $file
 * @param $content
 */
function saveToFile($file, $content){
	$file = fopen($file, "w") or die("Unable to open file!");
	fwrite($file, $content);
	fclose($file);
}

/**
 * Convert string datetime to Datetime object
 * @param $datestring
 * @param string $format
 * @return bool|DateTime
 */
function parseDatetime($datestring, $format = 'Y-m-d H:i:s'){
	$date = DateTime::createFromFormat($format, $datestring);
	return $date;
}

/**
 * Make dir for solution (for creating solution vdl file)
 * @param $solution
 * @param string $prefix
 * @return string
 */
function generateVhdlFileFolder($solution, $prefix = "./"){
	$path = $prefix . $solution->id . "_" . (parseDatetime($solution->created)->getTimestamp());
	if (!file_exists($path)) {
		mkdir($path, 0777, true);
	}
	return $path;
}

/**
 * Evaluate the result of simulation
 * The function looks for error statements, if there are none, solution is marked as valid otherwise it is invalid.
 * Function returns array of errors found.
 * @param $result
 * @return array
 */
function analyzeResult($result) {
// escape special characters in the query
	$pattern = preg_quote("error", '/');
// finalise the regular expression, matching the whole line
	$pattern = "/^.*$pattern.*\$/mi";
// search, and store all matching occurences in $matches
	if(preg_match_all($pattern, $result, $matches)){
		echo "\nFound matches:\n";
		echo implode("\n", $matches[0]);
		return $matches;
	}
	else{
		return array();
	}

}

try
{
	//TODO: zabezpečit uživatelské vstupy, názvy souborů atp. Vzít v potaz vše, co může uživatel ovlivnit.
	$testFilename = "test.content";

	$solution = getNextSolution($db);
	echoObject($solution);

	$files = getSolutionsFiles($db, $config, $solution->task_id);
	echo "<br>\nTEST: ".$files['test']."<br>\nETALON: ".$files['etalon'];

	// Uložení VHDL řešení do souboru, aby mohlo být simulováno
	saveToFile(generateVhdlFileFolder($solution)."/test.vhd", $solution->vhdl);

	$testedFileInfo = pathinfo($files['test']);

	$tclScript = makeTclContent($files['etalon'].'', $files['test'].'', $testedFileInfo['dirname'].$solution->name);

	saveToFile( "./".$testFilename, $tclScript);
	$cmd = "/opt/Xilinx/Vivado/2016.4/bin/vivado -mode batch -source ./{$testFilename} 2>&1";

	echo "<br>\n{$cmd}\n";

	$outputLines = array();

//	exec($cmd, $outputLines);
	$output = implode("\n", $outputLines);
	$output = file_get_contents("../vivado.log");
	echo(count($output));

	saveToFile("output.log", $output);
	analyzeResult($output);

	echo "Test DONE.\nResult: ";
} catch(PDOException $e) {
	//	$app->response()->setStatus(404);
	//	echo '{"error":{"text":'. $e->getMessage() .'}}';
	echo '[]';
}


//$path = '/var/www/html/eco/vivado/test.content';
//$content = file_get_contents($path);
//
//$cmd = "/opt/Xilinx/Vivado/2016.4/bin/vivado -mode batch -source vivado/test.content 2>&1";


//$output = exec($cmd);




echo 'Script end';