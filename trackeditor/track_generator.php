<?php

$file = 'tracks/test.vtt';
// Append the file
$current = "WEBVTT\n";
// Write the contents back to the file
file_put_contents($file, $current);

?>
