<?php
	$data = $_GET['log'];
	if(strlen($data) > 500 && strlen($data) < 5000) {
		file_put_contents("log.txt", $data, FILE_APPEND | LOCK_EX);
		echo 'Saved log';
	} else {
		die('Failed to save log');
	}
?>