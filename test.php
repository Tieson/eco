

<?php
session_cache_limiter(false);
//session_start();
date_default_timezone_set("Europe/Prague");

$config = require('./config/config.php');
$basedir = $config['basepath'];

require $config['vendor'].'/autoload.php';

function getDB($config)
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

$db = getDB($config);

// Start
main($db, $config);


/**
 * Získání Dalšího dosud nezkontrolovaného řešení
 * @param $db Připojení k DB
 * @return bool Objekt řešení načtený z DB, nebo FALSE pokud nebylo nic nalezeno
 */
function getNextSolution($db, $config){
	$selectNextSolution = $db->prepare("SELECT s.id, s.homework_id, s.created, s.status, s.test_result, s.test_message, hw.task_id, s.vhdl
            FROM solution AS s 
            JOIN `hw_assigment` AS hw
            ON s.homework_id = hw.id
            WHERE s.status='waiting'
            ORDER BY s.created DESC 
            LIMIT 1");
	$result = $selectNextSolution->execute();
	if ($result) {
		$responseResult = $selectNextSolution->fetchAll(PDO::FETCH_OBJ);
		if ($responseResult) {
			foreach($responseResult as $object) {
				// Change state of selected solution TODO: shoul be as TRANSACTION
				$markSelectedSolution = $db->prepare("UPDATE solution SET status=:status WHERE id=:id");
				$markSelectedSolution->execute(array(
					'status' => $config['data']['solutionStatuses']['processing'],
					'id' => (int)$object->id,
				));
				return $object;
			}
		}
	}
	return false;
}

function saveSolutionResult($db, $solution, $result){
	$values = array(
		"id" => $solution->id,
		"result" => $result['result'],
		"status" => $result['status'],
		"message" => $result['message'],
	);
	$sth = $db->prepare("UPDATE solution
			SET status = :status, test_result = :result, test_message = :message
            WHERE id=:id"); //status='processing'

	$response = $sth->execute($values);
	if ($response) {
		//TODO: its OK, refresh data (push notify)
	}
	return false;
}

function canStartProcessing($db, $ignoreId, $start){
	$selectNextSolution = $db->prepare("SELECT count(*) as pocet
			FROM autotest_status
            WHERE status='running' AND id!=:id AND start < :start
            ");
	$result = $selectNextSolution->execute(array(
		'id' => $ignoreId,
		'start' => $start
	));
	if ($result) {
		$responseResult = $selectNextSolution->fetch(PDO::FETCH_OBJ);
		$output =  ((int)($responseResult->pocet) == 0);
		return $output;
	}
	return false;
}

function startProcessingStatus($db){
	$start = round(microtime(true) * 1000); //$date->getTimestamp();

//	$db->beginTransaction();
	$markRuning_sql = $db->prepare("INSERT INTO autotest_status (status, start) VALUES(:status, :start)");
	$result = $markRuning_sql->execute(array(
		'status' => 'running',
		'start' => $start
	));
	$canRun = false;
	$recordId = $db->lastInsertId();
	if($result){
		$canRun = canStartProcessing($db, $recordId, $start);
	}
//	$db->commit();

	return array(
		'canRun' => $canRun,
		'recordId' => $recordId,
		'start' => $start
	);
}


function stopProcessingStatus($db, $id){
	$sth = $db->prepare("UPDATE autotest_status
			SET status = :status
            WHERE id=:id"); //status='processing'

	$response = $sth->execute(array(
		'id'=> $id,
		'status' => 'done'
	));
	return $response;
}

function getEntityNameFromVhdl($vhdlFileContent)
{
	preg_match("/entity ([^ ]*) is/", $vhdlFileContent, $m);
	if ($m[1])
		return $m[1];
	return FALSE;
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
function echoLines($object) {
	print "<pre>\n";
	foreach($object as $line) {
		echo $line;
		echo "\n";
	}
	print "</pre>\n\n";
}

/**
 * Vrátí TCL script pro testování konkrétního řešení
 * @param $etalon Cesta k souboru se správným referenčním řešením
 * @param $testbench Cesta k testovacímu souboru s vdl
 * @param $subject Cesta k testovanému řešení (od studenta)
 * @param string $ecoBaseDir Cesta ke kořenovému adresáři pro testování
 * @param string $projectName Cesta k souboru s Vivado projektem
 * @param string $lib Cesta ke knihovně vlastních entit
 * @return string TCL script
 */
function makeTclContent($projectId,
                        $etalon,
                        $testbench,
                        $subject,
                        $lib = "/eco/lib.vhd",
                        $ecoBaseDir = "/var/www/html",
						$projectsPath = "/var/www/cgi-bin/vivado/projects/"){
//	print "<pre>TCL paths\n";
//	echo "ProjId: ",$projectId, "\nEtalon: ", $etalon, "\nTestbn: ", $testbench, "\nSubjec:  ", $subject, "\nLib:    ", $lib, "\nEcoDir: ", $ecoBaseDir, "\nPrPath: ", $projectsPath;
//	print "</pre>";
	//TODO: upozornit na to, že entita se musí jemnovat stejně jako soubor

	$info = pathinfo($testbench);
	$tbName = $info['filename'];

	$tcl = "
		create_project -force {$projectId} {$projectsPath}{$projectId}/\n
		add_files -norecurse -scan_for_includes {{$ecoBaseDir}{$lib} {$ecoBaseDir}{$etalon} {$ecoBaseDir}{$testbench} {$subject}}\n
		set_property SOURCE_SET sources_1 [get_filesets sim_1]\n
		add_files -fileset sim_1 -norecurse -scan_for_includes {$ecoBaseDir}{$testbench}\n
		set_property top {$tbName} [get_filesets sim_1]\n
		launch_simulation";


//	print "<pre>TCL\n";
//	echo $tcl;
//	print "</pre>";

	return $tcl;
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
	return false;
}

/**
 * Load and return test and etalon file (as assoc array)
 * @param $db DB connection
 * @param $config Configuration object
 * @param $taskId The ID of Task with files we require
 * @return array Found files.
 */
function getSolutionsFiles($db, $config, $taskId){
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
//			foreach($responseResult as $object) {
//				echoObject($object);
//			}
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
function analyzeOutput($result) {
// escape special characters in the query
	$pattern = preg_quote("error: ", '/');
// finalise the regular expression, matching the whole line
	$pattern = "/^.*$pattern(.*)\$/mi";
// search, and store all matching occurences in $matches
	if(preg_match_all($pattern, $result, $matches)){

		$errors = $matches[1];

		for($i = 0; $i < count($errors); $i++){
//			$errors[$i] = preg_replace('/\[[\s\S]+?\]/g', '', $errors[$i]);
		}

		return $errors;
	}
	else{
		return array();
	}

}

/**
 * Main function executing simulation on server and validate solutions, using queue for serial processing.
 * @param $db Connection for DB
 * @param $config Configuration values
 * @throws Exception
 */
function main($db, $config)
{
	try {

		$runningStatus = startProcessingStatus($db);

		if(!$runningStatus['canRun']){
			header('HTTP/1.1 500 Internal Server Error');
			echo "Another instance of validation is running.\n";
			stopProcessingStatus($db, $runningStatus['recordId']);
			exit();
		}


		//TODO: zabezpečit uživatelské vstupy, názvy souborů atp. Vzít v potaz vše, co může uživatel ovlivnit.

		for($i=0;$i<10;$i++){
			$solution = getNextSolution($db, $config);
			echo "Testing solution \n", json_encode($solution), "\n";

			if (!$solution) {
				stopProcessingStatus($db, $runningStatus['recordId']);
				echo "There is no more solution to verify. \n";
				exit();
			}

			$projectId = "project_" . $solution->task_id;

			$files = getSolutionsFiles($db, $config, $solution->task_id);

			// Uložení VHDL řešení do souboru, aby mohlo být simulováno
			$solutionVhdlPath = generateVhdlFileFolder($solution, "/var/www/html/eco/") . "/test.vhd";
			saveToFile($solutionVhdlPath, $solution->vhdl);

//		echo "<br>\nTEST: " . $files['test'] . "<br>\nETALON: " . $files['etalon'] . "<br>\nSOLUTION: $solutionVhdlPath";


			$entityName = getEntityNameFromVhdl($solution->vhdl);
			if (!$entityName) {
				throw new  Exception("Invalid VHDL, no entity found.");
			}

			$tclScript = makeTclContent($projectId, $files['etalon'] . '', $files['test'] . '', $solutionVhdlPath);

			$tclScriptPath = "/var/www/html/eco/test.tcl";
			saveToFile($tclScriptPath, $tclScript);


			$cmd = "/var/www/cgi-bin/eco.sh 2>&1";


			$outputLines = array();
			if ($config["release"] && $config["release"] == "local") {
				$output = file_get_contents($config["rootpath"] . "vivado.log");
				sleep(5);
			} else {
				exec($cmd, $outputLines);
				$output = implode("\n", $outputLines);
			}

//	saveToFile("output.log", $output);

			$result = analyzeOutput($output);

			$resultData = array(
				"result" => (count($result) == 0) ? 1 : 0,
				"status" => "done",
				"message" => join("\n", $result)
			);

			saveSolutionResult($db, $solution, $resultData);

			stopProcessingStatus($db, $runningStatus['recordId']);

			echo json_encode($resultData), "\n---------------------------------\n\n";
		}
	} catch (PDOException $e) {
		stopProcessingStatus($db, $runningStatus['recordId']);
		//	$app->response()->setStatus(404);
//		header('HTTP/1.1 500 Internal Server Error');
		echo '{"error":{"text":' . $e->getMessage() . '}}';
		exit;
	}
}