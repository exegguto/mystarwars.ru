<?php
$a = $_POST['str'];
$f = fopen("seach.txt", "a+");
fwrite($f,$a . " \r\n");
fclose($f);

exit;
?>