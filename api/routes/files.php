<?php

function uploadFile () {
	if (!isset($_FILES['uploads'])) {
		echo "No files uploaded!!";
		return;
	}
	$result = array();

	$files = $_FILES['uploads'];
	$file_count = count($files['name']);

	//TODO: zbytek uploadu
	$data = $_POST[''];

	for($i = 0 ; $i < $file_count ; $i++) {
		if ($files['error'][$i] === 0) {
			$name = uniqid('img-'.date('Ymd').'-');
			if (move_uploaded_file($files['tmp_name'][$i], 'uploads/' . $name) === true) {
				$result[] = array('url' => '/uploads/' . $name, 'name' => $files['name'][$i]);
			}

		}
	}

	$imageCount = count($result);

	if ($imageCount == 0) {
		echo 'No files uploaded!!  <p><a href="/">Try again</a>';
		return;
	}

	$plural = ($imageCount == 1) ? '' : 's';

	foreach($result as $img) {
		printf('%s <img src="%s" width="50" height="50" /><br/>', $img['name'], $img['url']);
	}
}