<?php
$secret = 'dtmnmeayDsZa4YUkg1R6q9RR'; // секрет, который мы получили в первом шаге от яндекс.
// получение данных.
$r = array(
	'notification_type' => $_POST['notification_type'], // p2p-incoming / card-incoming - с кошелька / с карты
	'operation_id'      => $_POST['operation_id'],      // Идентификатор операции в истории счета получателя.
	'amount'            => $_POST['amount'],            // Сумма, которая зачислена на счет получателя.
	'withdraw_amount'   => $_POST['withdraw_amount'],   // Сумма, которая списана со счета отправителя.
	'currency'          => $_POST['currency'],            // Код валюты — всегда 643 (рубль РФ согласно ISO 4217).
	'datetime'          => $_POST['datetime'],          // Дата и время совершения перевода.
	'sender'            => $_POST['sender'],            // Для переводов из кошелька — номер счета отправителя. Для переводов с произвольной карты — параметр содержит пустую строку.
	'codepro'           => $_POST['codepro'],           // Для переводов из кошелька — перевод защищен кодом протекции. Для переводов с произвольной карты — всегда false.
	'label'             => $_POST['label'],             // Метка платежа. Если ее нет, параметр содержит пустую строку.
	'sha1_hash'         => $_POST['sha1_hash']          // SHA-1 hash параметров уведомления.
);
// проверка хеш
$f = fopen("message.txt", "a+");

if (sha1($r['notification_type'].'&'.
         $r['operation_id'].'&'.
         $r['amount'].'&'.
         $r['currency'].'&'.
         $r['datetime'].'&'.
         $r['sender'].'&'.
         $r['codepro'].'&'.
         $secret.'&'.
         $r['label']) != $r['sha1_hash']) {
			fwrite($f,"\nSHA1_HASH не совпадает.");
			exit('Верификация не пройдена. SHA1_HASH не совпадает.'); // останавливаем скрипт. у вас тут может быть свой код.
		}
/* Соединяемся с базой данных */
$hostname = "localhost"; // название/путь сервера, с MySQL
$username = "u0099_list"; // имя пользователя (в Denwer`е по умолчанию "root")
$password = "Xr?ro880"; // пароль пользователя (в Denwer`е по умолчанию пароль отсутствует, этот параметр можно оставить пустым)
$dbName = "u0099327_list"; // название базы данных

/* Таблица MySQL, в которой будут храниться данные */
$table = "MySTARWARS";

/* Создаем соединение */
mysql_connect($hostname, $username, $password) or die (fwrite($f,"Не могу создать соединение"));

/* Выбираем базу данных. Если произойдет ошибка - вывести ее */
mysql_select_db($dbName) or die (mysql_error());

mysql_query("SET NAMES 'utf8';");
mysql_query("SET CHARACTER SET 'utf8';");
mysql_query("SET SESSION collation_connection = 'utf8_general_ci';");

/* Составляем запрос для вставки информации в таблицу*/
$query = "update $table set `ord`='true' where `label`='".$r['label']."'";

/* Выполняем запрос. Если произойдет ошибка - вывести ее. */
mysql_query($query) or die(mysql_error());

$GET_SRV_INF_S = mysql_query("SELECT * FROM $table WHERE `label`='".$r['label']."'");
$arr = mysql_fetch_assoc($GET_SRV_INF_S);

/* Закрываем соединение */
mysql_close();

// ----------------------------конфигурация-------------------------- //
$adminemail="info@mystarwars.ru";  // e-mail админа
$useremail=$arr[email];  // e-mail клиента
$date=date("d.m.y"); // число.месяц.год
$time=date("H:i"); // часы:минуты:секунды 
$subject = "Заказ ID:$arr[label] оформлен на сайте MySTARWARS.ru"; //Subject: 
$from_name = "MySTARWARS.ru"; //From:
$from_email = "info@mystarwars.ru"; //From:
$from_name1 = "=?UTF-8?B?" . base64_encode($from_name) . "?=";
$headers = "Content-type: text/html; charset=\"utf-8\"\r\n";
$headers .= "From: " . $from_name1 ." <".$from_email.">\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Date: ". date('D, d M Y h:i:s O') ."\r\n";
//---------------------------------------------------------------------- //  
 
$msg = "<br><p><strong>Была совершена оплата заказа</strong></p>";
$msg .="<p>$date $time</p>\r\n";
$msg .="<p>ID заказа: $arr[label]</p>\r\n";
$msg .="<p>ФИО: $arr[name]</p>\r\n";
$msg .="<p>Телефон: $arr[phone]</p>\r\n";
$msg .="<p>e-mail: $arr[email]</p>\r\n";
$msg .="<p>Адрес доставки: $arr[adress]</p>\r\n";
$msg .="<p>Заказ:</p>\r\n";

$res = array_chunk(preg_split("/[_]/", substr($arr[zakaz],0,-1), -1),3);

$msgusert ="<table align='center' border='0' cellpadding='0' cellspacing='0' width='620' style='background:rgb(239,239,239);border:1px solid rgb(221,221,221);border-image:none;'><tbody style='line-height:18px;font-size:12px;font-family:Arial;color:rgb(102,102,102);'>";

foreach ($res as $value){
	$msgusert .="<tr><td width='450'><span>$value[0]</span></td><td><span>$value[1] шт.</span></td><td><span>$value[2] р./шт</span></td></tr>";
}
unset($value);
$msgusert .="</br><p>Общая сумма заказа: $arr[sum] рублей</p></tbody></table>";

$msg .= $msgusert;
$msg .= $utm;

require_once "SendMailSmtpClass.php"; // подключаем класс
$pass = "hgd;fjg;s#uhfD";
$mailSMTP = new SendMailSmtpClass($from_email, $pass, 'ssl://smtp.yandex.ru', $from_name1, 465);
// $mailSMTP = new SendMailSmtpClass('логин', 'пароль', 'хост', 'имя отправителя');

// Отправляем письмо админу
$result =  $mailSMTP->send($adminemail, $subject , $msg, $headers);

$msguser = "<div><table style='background:#efefef;' align='center' cellpadding='0' cellspacing='0' height='auto' width='100%'><tbody><tr><td><table align='center' bgcolor='#efefef' border='0' cellpadding='0' cellspacing='0' height='32' width='700'><tbody><tr><td height='32' valign='bottom' width='150'><a href='http://$from_name'><span style='color: #254C03;font-size: 18px;font-family: 'Roboto Slab', serif;letter-spacing: 7px;'>$from_name</span></a></td></tr></tbody></table></td></tr></tbody></table><table style='background:rgb(239,239,239);' align='center' border='0' cellpadding='0' cellspacing='0' width='100%'><tbody><tr><td><table style='background:rgb(255,255,255);border:1px solid rgb(221,221,221);border-image:none;' align='center' border='0' cellpadding='0' cellspacing='0' width='700'><tbody><tr><td><table align='center' border='0' cellpadding='0' cellspacing='0' width='620'><tbody><tr><td style='line-height:32px;font-family:arial;' valign='top'><p><span style='font-size:24px;color:#ff9900;'>Платеж успешно совершен</span></p></td></tr><tr><td style='line-height:40px;font-size:18px;' valign='top'><span style='font-family:Arial;color:#666666;'>$arr[name]</span></td></tr><tr><td style='line-height:18px;'><span style='font-family:Arial;color:#666666;font-size:13px;line-height:16.8px;'>Вами был совершен заказ на сайте $from_name, который мы уже передали в работу службе доставки.</br><p>Ваши данные:</p><p>Телефон: $arr[phone]</p></br><p>Адрес доставки: $arr[adress]</p></br>Ваш заказ:\r\n";
$msguser .= $msgusert;
$msguser .="</span></td></tr></tbody></table><table align='center' border='0' cellpadding='0' cellspacing='0' height='100' width='620'><tbody><tr><td style='line-height:18px;font-size:12px;' width='450'><span style='font-family:Arial;color:rgb(102,102,102);'><br>С наилучшими пожеланиями,<br> $from_name <br>$date $time<br>Это сообщение отправлено системой автоматически. <br></span></td></tr></tbody></table></td></tr><tr><td height='20'>&nbsp;</td></tr></tbody></table></td></tr></tbody></table><table style='BACKGROUND:#efefef;' cellspacing='0' align='center' border='0' cellpadding='0' height='auto' width='100%'><tbody><tr><td><table style='BACKGROUND:#efefef;' cellspacing='0' align='center' border='0' cellpadding='0' height='auto' width='100%'><tbody><tr><td><table align='center' bgcolor='#efefef' border='0' cellpadding='0' cellspacing='0' height='100' width='700'><tbody><tr><td style='LINE-HEIGHT:18px;FONT-FAMILY:arial;COLOR:#999;FONT-SIZE:11px;'><p>Это письмо было отправлено на адрес <a href='mailto:$arr[email]'>$arr[email]</a> <br>Вы получили его так как совершили покупку на сайте <a href='http://$from_name' style='FONT-FAMILY:arial;COLOR:#999;FONT-SIZE:11px;TEXT-DECORATION:underline;'>$from_name</a></p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div>";
$msguser .= $utm;

$result =  $mailSMTP->send($useremail, $subject , $msguser, $headers); // отправляем письмо
// $result =  $mailSMTP->send('Кому письмо', 'Тема письма', 'Текст письма', 'Заголовки письма');
if($result === true){}else{fwrite($f," \n Письмо не отправлено. Ошибка: " . $result);}

fclose($f);

exit;
?>