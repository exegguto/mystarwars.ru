<?
// ----------------------------конфигурация-------------------------- //  
$adminemail="vse.lendengi@yandex.ru";  // e-mail админа 
$date=date("d.m.y"); // число.месяц.год  
$time=date("H:i"); // часы:минуты:секунды 
$subject = "Заказ оформлен на сайте MySTARWARS.ru"; //Subject: 
$from_name = "MySTARWARS.ru"; //From:
$from_email = "info@mystarwars.ru"; //From:
$subject = "=?UTF-8?B?" . base64_encode($subject) . "?=";
$from_name = "=?UTF-8?B?" . base64_encode($from_name) . "?=";
$headers = "Content-type: text/html; charset=\"utf-8\"\r\n";
$headers .= "From: " . $from_name ." <".$from_email.">\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Date: ". date('D, d M Y h:i:s O') ."\r\n"; 
//---------------------------------------------------------------------- //  

// Принимаем данные с формы   
$email=$_POST['email'];
$send=$_POST['adress'];
$name=$_POST['fio'];

$msg = "<br><p><strong>Вопрос от клииента</strong></p>";
$msg .="<p>Имя: $name  </p>\r\n";
$msg .="<p>e-mail: $email  </p>\r\n";
$msg .="<p>Текст: $send</br>С наилучшими пожеланиями,<br> myStarWars.ru <br>$date $time<br>Это сообщение отправлено системой автоматически, пожалуйста, не отвечайте на него.</p>\r\n";
$msg .= $utm;
 // Отправляем письмо админу 
mail($adminemail, $subject, $msg, $headers);  

// Сохраняем в базу данных  
$f = fopen("message.txt", "a+");  
fwrite($f,"$date $time Вопрос $name $email\r\n");  
fclose($f);   

exit; 
?>