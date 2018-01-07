<?php
session_cache_limiter(false);
session_start();
date_default_timezone_set('Europe/Berlin');

require_once('../config/config.php');
require_once '../vendor/autoload.php';
require_once 'utils.php';
require_once 'database.php';
require_once 'task_validation.php';


$config = Config::getConfig();
$basedir = $config['projectDir'];

// Start
main();


/**
 * Získání Dalšího dosud nezkontrolovaného řešení
 * @param $db Připojení k DB
 * @return bool Objekt řešení načtený z DB, nebo FALSE pokud nebylo nic nalezeno
 */
function getNextSolution()
{
	$db = Database::getDB();
//	$procStatus = Util::$solutionStatuses['processing'];// Config::getKey('data/solutionStatuses/processing');
	$selectNextSolution = $db->prepare("SELECT s.id, s.homework_id, s.created, s.status, s.test_result, s.test_message, hw.task_id, s.vhdl
            FROM solution AS s 
            JOIN `hw_assigment` AS hw
            ON s.homework_id = hw.id
            WHERE s.status='waiting'
            ORDER BY s.created ASC 
            LIMIT 1");
	$result = $selectNextSolution->execute();
	if ($result) {
		$responseResult = $selectNextSolution->fetchAll(PDO::FETCH_OBJ);
		if ($responseResult) {
			foreach ($responseResult as $object) {
				$markSelectedSolution = $db->prepare("UPDATE solution SET status=:status WHERE id=:id");
				$markSelectedSolution->execute(array(
					'status' => Util::$solutionStatuses['processing'],
					'id' => (int)$object->id,
				));
				return $object;
			}
		}
	}
	return false;
}

function saveSolutionResult($db, $solution, $result)
{
	$values = array(
		"id" => $solution->id,
		"result" => $result['result'],
		"status" => $result['status'],
		"message" => $result['message'],
	);
	$sth = $db->prepare("UPDATE solution
			SET status = :status, test_result = :result, test_message = :message
            WHERE id=:id");
	$sth->execute($values);
	return false;
}

function canStartProcessing($db, $ignoreId, $start)
{
	$selectNextSolution = $db->prepare("SELECT count(*) as pocet
			FROM autotest_status
            WHERE status='running' AND id!=:id AND start < :start");
	$result = $selectNextSolution->execute(array(
		'id' => $ignoreId,
		'start' => $start
	));
	if ($result) {
		$responseResult = $selectNextSolution->fetch(PDO::FETCH_OBJ);
		$output = ((int)($responseResult->pocet) == 0);
		return $output;
	}
	return false;
}

function changeProcessingStatus()
{
	$db = Database::getDB();
	$start = round(microtime(true) * 1000);

	$db->beginTransaction();
	$markRuning_sql = $db->prepare("INSERT INTO autotest_status (status, start) VALUES(:status, :start)");
	$result = $markRuning_sql->execute(array(
		'status' => 'running',
		'start' => $start
	));
	$canRun = false;
	$recordId = $db->lastInsertId();
	if ($result) {
		$canRun = canStartProcessing($db, $recordId, $start);
	}
	$db->commit();

	return array(
		'canRun' => $canRun,
		'recordId' => $recordId,
		'start' => $start
	);
}


function stopProcessingStatus($db, $id)
{
	$sth = $db->prepare("DELETE FROM autotest_status
            WHERE id=:id");
	$response = $sth->execute(array(
		'id' => $id,
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
                        $lib,
                        $ecoBaseDir,
                        $projectsPath)
{
	//upozornit na to, že entita se musí jemnovat stejně jako soubor - nemusí (ale měla by)
	$info = pathinfo($testbench);
	$tbName = $info['filename'];
	$tcl = "
		create_project -force {$projectId} {$projectsPath}{$projectId}/\n
		add_files -norecurse -scan_for_includes {{$ecoBaseDir}{$lib} {$ecoBaseDir}{$etalon} {$ecoBaseDir}{$testbench} {$subject}}\n
		set_property SOURCE_SET sources_1 [get_filesets sim_1]\n
		add_files -fileset sim_1 -norecurse -scan_for_includes {$ecoBaseDir}{$testbench}\n
		set_property top {$tbName} [get_filesets sim_1]\n
		launch_simulation";
	return $tcl;
}

/**
 * Return first found file of type
 * @param $files List of files
 * @param $type Type of required file
 * @return mixed Path to found file
 */
function getFileOfType($files, $type)
{
	foreach ($files as $file) {
		if ($file->type == $type) {
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
 * @return array|bool Found files od FALSE if at least one is missing.
 */
function getSolutionsFiles($db, $config, $taskId)
{
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
			$test = getFileOfType($responseResult, Util::$tasksFiletypes['test']);
			$etalon = getFileOfType($responseResult, Util::$tasksFiletypes['etalon']);
		}
	}

	if (empty($test) || empty($etalon)) {
		return FALSE;
	}
	$files = array(
		"test" => $test->file,
		"etalon" => $etalon->file,
	);
	return $files;
}


/**
 * Saves text to file
 * @param $file
 * @param $content
 */
function saveToFile($file, $content)
{
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
function parseDatetime($datestring, $format = 'Y-m-d H:i:s')
{
	$date = DateTime::createFromFormat($format, $datestring);
	return $date;
}

/**
 * Make dir for solution (for creating solution vdl file)
 * @param $solution
 * @param string $prefix
 * @return string
 */
function generateVhdlFileFolder($solution, $entityName, $prefix)
{
	$path = $prefix . '/solutions/';
	if (!file_exists($path)) {
		mkdir($path, 0777, true);
	}
	$result = $path . $entityName . '_' . $solution->id . ".vhd";
	return $result;
}

/**
 * Evaluate the result of simulation
 * The function looks for error statements, if there are none, solution is marked as valid otherwise it is invalid.
 * Function returns array of errors found.
 * @param $result
 * @return array
 */
function analyzeOutput($result)
{
	$pattern = preg_quote("error: ", '/');
	$pattern = "/^.*$pattern(.*)\$/mi";
	if (preg_match_all($pattern, $result, $matches)) {
		$errors = $matches[1];
//		for ($i = 0; $i < count($errors); $i++) {
//			$errors[$i] = preg_replace('/\[[\s\S]+?\]/g', '', $errors[$i]);
//		}
		return $errors;
	} else {
		return array();
	}

}

/**
 * Main function executing simulation on server and validate solutions, using queue for serial processing.
 * @param $db Connection for DB
 * @param $config Configuration values
 * @throws Exception
 */
function main()
{
	$db = Database::getDB();
	$config = Config::getConfig();

	$maxSimulationCount = isset($config['maxSimulationCount']) ? $config['maxSimulationCount'] : 30;

	/**
	 * Nastavení stavu probíhající simulace, žádná další tak nemůže být spuštěna.
	 */
	global $runningStatus;
	$runningStatus = changeProcessingStatus();

	global $runningSolution;
	$runningSolution = null;

	function shutdown()
	{
		$db = Database::getDB();

		global $runningSolution;
		if ($runningSolution != null) {
			$resultData = array(
				"result" => 0,
				"status" => "waiting",
				"message" => "Simulaci se nepodařilo spustit"
			);
			saveSolutionResult($db, $runningSolution, $resultData);
			echo "Running simulation failed.\n";
			$runningSolution = null;
		}

		global $runningStatus;
		stopProcessingStatus($db, $runningStatus['recordId']);
	}

	register_shutdown_function('shutdown');

	try {
		/*
		 * Otestovat jestli je možné spustit momentálně simulaci, jestli žádná jiná právě neběží.
		 */
		if (!$runningStatus['canRun']) {
			header('HTTP/1.1 500 Internal Server Error');
			echo "Another instance of validation is running.\n";
			stopProcessingStatus($db, $runningStatus['recordId']);
			exit();
		}

		/*
		 * Smyčka pro spuštění několika simulací
		 */
		for ($i = 0; $i < $maxSimulationCount; $i++) {
			/**
			 * Získání dalšího řešení
			 */
			$solution = getNextSolution();
			$runningSolution = $solution;

			/**
			 * Kontrola jestli existuje další řešení pro simulaci
			 */
			if (!$solution) {
				stopProcessingStatus($db, $runningStatus['recordId']);
				echo "There is no more solution to verify. \n";
				exit();
			}

			/**
			 * Kontrola validity zadání.
			 * Pokud nemá veštekré náležitosti, nemůže být simulace spuštěna
			 * A je pokračováno dalším řešením
			 */
			$validityResult = isTaskValid($solution->task_id, $config["absoluthPathBase"]);
			if ($validityResult !== TRUE) {
				$resultData = array(
					"result" => 0,
					"status" => "waiting",
					"message" => $validityResult["error"]
				);
				saveSolutionResult($db, $solution, $resultData);
				echo "The task is invalid, therefore simulation can't run. \n";
				continue;
			}

			/**
			 * Umělý identifikátor projektu Vivada - název složky je podle něj
			 * Pro každé zadání je vytvořen jeden projekt  s jeho ID, Projekty jsou přemazávány a znovu vytvářeny při simulaci řešení.
			 */
			$projectId = "project_" . $solution->task_id;

			/**
			 * Získání souborů řešení
			 * správného řešení a testbenche
			 */
			$files = getSolutionsFiles($db, $config, $solution->task_id);

			/**
			 * Získání názvu entity ze souboru.
			 * Teoreticky to není potřeba dělat a šlo by
			 */
			$entityName = getEntityNameFromVhdl($solution->vhdl);
			if (!$entityName) {
				throw new  Exception("Invalid VHDL, no entity found.");
			}

			/**
			 * Uložení VHDL řešení do souboru, aby mohlo být simulováno
			 */
			$solutionVhdlPath = generateVhdlFileFolder($solution, $entityName, $config['absoluthPathBase'] . $config['projectDir']);
			saveToFile($solutionVhdlPath, $solution->vhdl);


			$tclScript = makeTclContent($projectId, $files['etalon'], $files['test'], $solutionVhdlPath,
				$config['libPath'], //'/eco/lib.vhd',
				$config['absoluthPathBase'], //'/var/www/html',
				$config['vivadoProjectsDir'] //'/var/www/cgi-bin/vivado/projects/'
			);

			$tclScriptPath = "/var/www/html/eco/test.tcl";
			saveToFile($tclScriptPath, $tclScript);


			/**
			 * Spuštění samotné simulace a čekání na výstup, který je uložen do pole řádků.
			 * Je zde také testovací větev podmínky, která nespouští simulaci a výstup načítá z připraveného souboru (pro lokální tetování)
			 */
			$outputLines = array();
			if ($config["release"] && $config["release"] == "local") {
				$output = 'error: failed @ file test.php - Local developer testing!!';
				sleep(3); // umělá doba čekání napodobující samotnou simulaci
			} else {
				$cmd = $config["cgipath"] . "eco.sh 2>&1";
				exec($cmd, $outputLines);
				$output = implode("\n", $outputLines);
			}

			/**
			 * Vyčištění souborů, které byly vytvořeny
			 */
			unlink($solutionVhdlPath);
			unlink($tclScriptPath);

			/**
			 * Analýza a příprava výsledků simulace
			 */
			$result = analyzeOutput($output);
			$resultData = array(
				"result" => (count($result) == 0) ? 1 : 0,
				"status" => "done",
				"message" => join("\n", $result)
			);

			/**
			 * Uložení výsledků simulace do DB
			 */
			saveSolutionResult($db, $solution, $resultData);
			$runningSolution = null;
		}

		/**
		 * Nastavení přínaku pro ukončení simulace
		 */

	} catch (Exception $e) {
		stopProcessingStatus($db, $runningStatus['recordId']);
		echo $e->getMessage() . "\n";
		exit();
	}
}