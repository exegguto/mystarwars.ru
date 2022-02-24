<?php
// ----------------------------конфигурация-------------------------- //
$adminemail="vse.lendengi@yandex.ru";  // e-mail админа
$useremail=$_POST[email];  // e-mail клиента
$date=date("d.m.y"); // число.месяц.год
$time=date("H:i"); // часы:минуты:секунды 
$from_name = $_POST[formcomment]; //From:
$from_email = "info@$_POST[formcomment]"; //From:
$headers = "MIME-Version: 1.0\r\nContent-type: text/html; charset=utf-8\r\n";
$headers .= "From: =?UTF-8?B?".base64_encode($from_name)."?= <".$from_email.">\r\n";
//---------------------------------------------------------------------- //

$msgusert ="<table align='center' border='0' cellpadding='0' cellspacing='0' width='620' style='background:rgb(239,239,239);border:1px solid rgb(221,221,221);border-image:none;'><tbody style='line-height:18px;font-size:12px;font-family:Arial;color:rgb(102,102,102);'>";

$msgusert .="<br>Спасибо, что интересуетесь «Звёздными войнами» вместе с нами!<br>Вы можете скачать полное собрание книг по «Звёздным Войнам» по этой ссылке -> <a href='https://yadi.sk/d/xZxWcrPJmRPEM'>Скачать</a>.<br>Не останавливайтесь на достигнутом. Звёздных войн — много не бывает. Да пребудет с Вами сила!<br>
mystarwars.ru – это лучшая продукция по «Звёздным Войнам» со всего мира. Любимые герои, знаменитые звездолёты, эпические сражения и другие атрибуты далекой далекой галактики в одном месте.<br>Если у вас возникли какие-то вопросы — пишите info@mystarwars.ru
</tbody></table>";

require_once "SendMailSmtpClass.php"; //подключаем класс

$pass="hgd;fjg;s#uhfD";
$mailSMTP = new SendMailSmtpClass($from_email, $pass, 'ssl://smtp.yandex.ru', $from_name, 465);
// $mailSMTP = new SendMailSmtpClass('логин', 'пароль', 'хост', 'имя отправителя');
$site="Собрание книг по 'Звездным войнам' на сайте " . $_POST[formcomment];

// Отправляем письмо админу $result =  $mailSMTP->send($adminemail, $site , $msg, $headers);

$msguser = "<div><table style='background:rgb(239,239,239);' align='center' border='0' cellpadding='0' cellspacing='0' width='100%'><tbody><tr><td><table style='background:rgb(255,255,255);border:1px solid rgb(221,221,221);border-image:none;' align='center' border='0' cellpadding='0' cellspacing='0' width='700'><tbody><tr><td><table align='center' border='0' cellpadding='0' cellspacing='0' width='620'><tbody><tr><td style='line-height:18px;'>\r\n";
$msguser .= $msgusert;
$msguser .="</td></tr></tbody></table><table align='center' border='0' cellpadding='0' cellspacing='0' height='100' width='620'><tbody><tr><td style='line-height:18px;font-size:12px;' width='450'><span style='font-family:Arial;color:rgb(102,102,102);'><br>С наилучшими пожеланиями,<br> $_POST[formcomment] <br>$date $time<br>Это сообщение отправлено системой автоматически. <br></span></td></tr></tbody></table></td></tr><tr><td height='20'>&nbsp;</td></tr></tbody></table></td></tr></tbody></table><table style='BACKGROUND:#efefef;' cellspacing='0' align='center' border='0' cellpadding='0' height='auto' width='100%'><tbody><tr><td><table style='BACKGROUND:#efefef;' cellspacing='0' align='center' border='0' cellpadding='0' height='auto' width='100%'><tbody><tr><td><table align='center' bgcolor='#efefef' border='0' cellpadding='0' cellspacing='0' height='100' width='700'><tbody><tr><td style='LINE-HEIGHT:18px;FONT-FAMILY:arial;COLOR:#999;FONT-SIZE:11px;'><p>Это письмо было отправлено на адрес <a href='mailto:$_POST[email]'>$_POST[email]</a> <br>Вы получили его так как оформляли запрос на скачивание книги на сайте <a href='http://$_POST[formcomment]' style='FONT-FAMILY:arial;COLOR:#999;FONT-SIZE:11px;TEXT-DECORATION:underline;'>$_POST[formcomment]</a>, если вы не оформляли запрос на скачивание книг, возможно, Ваш адрес был указан кем-то, кому он известен, или по ошибке — тогда просто проигнорируйте это письмо.</br></p></td></tr></tbody></table></td></tr></tbody></table></td></tr></tbody></table></div>";
$msguser .= $utm;

$f = fopen("message.txt", "a+");

$result =  $mailSMTP->send($useremail, $site , $msguser, $headers); // отправляем письмо
// $result =  $mailSMTP->send('Кому письмо', 'Тема письма', 'Текст письма', 'Заголовки письма');
if($result === true){}else{fwrite($f," \n Письмо не отправлено. Ошибка: " . $result);}

fwrite($f," \r\n $date $time $_POST[formcomment] test $_POST[email]");  
fclose($f);

exit;
?>