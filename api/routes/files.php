<?php


function filesList() {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT * FROM files");

		$sth->execute();
		$schemas = $sth->fetchAll(PDO::FETCH_OBJ);

		if($schemas) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($schemas);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function filesDetail($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT * FROM files WHERE id=:id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);

		$sth->execute();
		$schemas = $sth->fetchAll(PDO::FETCH_OBJ);

		if($schemas) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($schemas);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function tasksFiles($id) {
	$app = \Slim\Slim::getInstance();

	try
	{
		$db = getDB();
		$sth = $db->prepare("SELECT tf.id, tf.task_id, tf.file, tf.name, tf.type FROM task_files AS tf WHERE task_id=:id");
		$sth->bindParam(':id', $id, PDO::PARAM_INT);
		$sth->execute();
		$items = $sth->fetchAll(PDO::FETCH_OBJ);

		if($items) {
			$app->response->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
			echo json_encode($items);
			$db = null;
		} else {
			throw new PDOException('No records found.');
		}

	} catch(PDOException $e) {
		$app->response()->setStatus(404);
		echo '{"error":{"text":'. $e->getMessage() .'}}';
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
		$db = getDB();
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
	$config = require('./config/config.php');
	$basedir = $config['basepath'];

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

	$title = $data['filename'];
	$type = $data['fileAddType'];
	$task_id = $data['task_id'];

	$name = basename($file_name);

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
			$db = getDB();
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

	//TODO: kontrola oprávnění (skupina a student)

	try
	{
		$db = getDB();
//		$prepare = $db->prepare("DELETE FROM `group_assigment` WHERE group_id=:group_id");
		$prepare = $db->prepare("DELETE FROM `task_files` WHERE id=:id");
		$prepare->bindParam(':id', $id, PDO::PARAM_INT);
		$result = $prepare->execute();

		if ($result) {
			$app->response()->setStatus(200);
			$app->response()->headers->set('Content-Type', 'application/json');
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