<?php


function filesList() {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = Database::getDB();
		$sth = $db->prepare("SELECT * FROM files");

		$sth->execute();
		$schemas = $sth->fetchAll(PDO::FETCH_OBJ);

//		if($schemas) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($schemas);
//		} else {
//			throw new PDOException('No records found.');
//		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function fileDetail($id) {
	try
	{
		$db = Database::getDB();
		$sth = $db->prepare("SELECT * FROM task_files WHERE id=:id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);

		$sth->execute();
		$schemas = $sth->fetchAll(PDO::FETCH_OBJ);

		if($schemas) {
			Util::response($schemas);
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		Util::responseError($e->getMessage(), 404);
	}
}

function tasksFiles($id) {
	try
	{
		$db = Database::getDB();
		$sth = $db->prepare("SELECT tf.id, tf.task_id, tf.file, tf.name, tf.type FROM task_files AS tf WHERE task_id=:id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->execute();
		$items = $sth->fetchAll(PDO::FETCH_OBJ);

		Util::response($items);

	} catch(PDOException $e) {
		Util::responseError($e->getMessage());
	}
}


function taskFilesStudent($id) {
	try
	{
		$db = Database::getDB();
		$sth = $db->prepare("SELECT tf.id, tf.task_id, tf.file, tf.name, tf.type FROM task_files AS tf WHERE task_id=:id AND type='normal'");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->execute();
		$items = $sth->fetchAll(PDO::FETCH_OBJ);

		Util::response($items);

	} catch(PDOException $e) {
		Util::responseError($e->getMessage());
	}
}

function addTaskFile($id) {
	$app = \Slim\Slim::getInstance();

	$allPostVars = json_decode($app->request->getBody(), true);
	$values = array(
		"task_id" => $id,
		"name" => $_SESSION['name'],
		"file" => $allPostVars['file'],
		"type" => $allPostVars['type'],
	);

	try
	{
		$db = Database::getDB();
		$sth = $db->prepare("INSERT INTO task_files 	(task_id,	name, 	file, 	type) 
														VALUES	(:task_id,	:name, 	:file, 	:type)");

		$result = $sth->execute($values);

		if ($result){
			$id = $db->lastInsertId();
			$sth = $db->prepare("SELECT * FROM `task_files` WHERE id = :id");
			$sth->bindParam(":id", $id, PDO::PARAM_INT);
			$sth->execute();

			$item = $sth->fetch(PDO::FETCH_OBJ);

			if($item) {
				$app->response()->setStatus(200);
				$app->response()->headers->set('Content-Type', 'application/json');
				echo json_encode($item);

				$db = null;
			} else {
				throw new PDOException('Getting inserted values was unsuccessful');
			}
		} else {
			throw new PDOException('No task was created.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function uploadFile () {
	$app = \Slim\Slim::getInstance();

	$config = Config::getConfig();
	$basedir = $config['projectDir'];

	try {
		$teacher = requestLoggedTeacher();

	} catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit;
	}

	if (!isset($_FILES['uploads'])) {
		echo "No files uploaded!!";
		return;
	}

	$files = $_FILES['uploads'];
	$data = $_POST;

	$file_name = $files['name'];
	$file_tempname = $files['tmp_name'];

	$type = $data['fileAddType'];
	$task_id = $data['task_id'];

	$name = basename($file_name);
	$title = $name;

	$base_path = $basedir."/soubory/task_".$task_id."/".$type;
	$uploads_dir =  $_SERVER['DOCUMENT_ROOT'].$base_path;
	$destination = "$uploads_dir/$name";
	if ( ! is_dir($uploads_dir)) {
		mkdir($uploads_dir,0777, TRUE);
	}
	$resultFile = move_uploaded_file($file_tempname, $destination);

	if ($resultFile) {
		try {
			$values = array(
				"task_id" => $task_id,
				"name" => $title,
				"file" => $base_path . '/' . $name,
				"type" => $type,
			);

			$db = Database::getDB();
			$sth = $db->prepare("INSERT INTO task_files 	(task_id,	name, 	file, 	type)
														VALUES	(:task_id,	:name, 	:file, 	:type)");



			$result = $sth->execute($values);

			if ($result) {
				$id = $db->lastInsertId();
				$sth = $db->prepare("SELECT * FROM `task_files` WHERE id = :id");
				$sth->bindParam(":id", $id, PDO::PARAM_INT);
				$sth->execute();

				$item = $sth->fetch(PDO::FETCH_OBJ);

				if ($item) {
					$app->response()->setStatus(200);
					$app->response()->headers->set('Content-Type', 'application/json');
					echo json_encode($item);

					$isValid = isTaskValid($task_id, $config["absoluthPathBase"]);
					if ($isValid===TRUE){
						taskUpdateValidity($task_id, 1, $db);
					}else{
						taskUpdateValidity($task_id, 0, $db);
					}

					$db = null;
				} else {
					throw new PDOException('Getting inserted values was unsuccessful');
				}
			} else {
				throw new PDOException('No file was added.');
			}

		} catch (PDOException $e) {
			$app->response()->setStatus(404);
			echo '{"error":{"text":' . $e->getMessage() . '}}';
		}
	}

	$url = $basedir.'/teacher#tasks/'.$task_id.'/edit';
	$app->redirect($url);
}

function fileDelete($id) {
	$app = \Slim\Slim::getInstance();
	$config = Config::getConfig();

	try {
		$teacher = requestLoggedTeacher();
	} catch(Exception $e) {
		$app->response()->setStatus(401);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
		exit;
	}

	try
	{
		$db = Database::getDB();
		$task_file_query = $db->prepare("SELECT * FROM `task_files` WHERE id = :id");
		$task_file_query->bindParam(":id", $id, PDO::PARAM_INT);
		$task_file_query->execute();
		$task_file = $task_file_query->fetch(PDO::FETCH_OBJ);
		$task_id = $task_file->task_id;

		$prepare = $db->prepare("DELETE FROM `task_files` WHERE id=:id");
		$prepare->bindParam(':id', $id, PDO::PARAM_INT);
		$result = $prepare->execute();

		if ($result) {
			$app->response()->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');

			$isValid = isTaskValid($task_id, $config["absoluthPathBase"]);
			if ($isValid===TRUE){
				taskUpdateValidity($task_id, 1, $db);
			}else{
				taskUpdateValidity($task_id, 0, $db);
			}
			
			echo json_encode(array( 'response' => 'success' ));

			$db = null;
		} else {
			throw new PDOException('No group was deleted.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(400);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}



function fileDownload($id)
{
	try
	{
		$db = Database::getDB();
		$sth = $db->prepare("SELECT * FROM task_files WHERE id=:id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);

		$sth->execute();
		$fileObject = $sth->fetch(PDO::FETCH_ASSOC);

		if ($fileObject) {
			if($fileObject['type'] != 'normal'){
				$teacher = requestLoggedTeacher();
				$content = file_get_contents(Config::getKey('absoluthPathBase').$fileObject['file']);
				$content = preg_replace('~\R~u', "\r\n", $content); // nahrazení nl za crlf pro zobrazení na windows
				$name = basename($fileObject['file']);
				Util::serveFile($name, $content);
			}else{
				header("Location: ".$fileObject['file']); /* Redirect browser */
				exit;
			}

		} else {
			throw new PDOException('File not found.');
		}

	} catch(PDOException $e) {
		Util::responseError($e->getMessage(), 404);
	} catch (Exception $e) {
		Util::responseError($e->getMessage());
	}
}