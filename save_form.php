<?
// Принимаем данные с формы 
$date=date("y.m.d"); // число.месяц.год  
$time=date("H:i"); // часы:минуты:секунды 
$site="mystarwars.ru";
$name=$_POST['fio'];     
$phone=$_POST['phone'];
$email=$_POST['email'];
$sum=$_POST['sum'];
$label=$_POST['label'];
$zakaz=$_POST['zakaz'];
$adress=$_POST['adress'];

/* Соединяемся с базой данных */
$hostname = "localhost"; // название/путь сервера, с MySQL
$username = "u0099_list"; // имя пользователя (в Denwer`е по умолчанию "root")
$password = "Xr?ro880"; // пароль пользователя (в Denwer`е по умолчанию пароль отсутствует, этот параметр можно оставить пустым)
$dbName = "u0099327_list"; // название базы данных
 
/* Таблица MySQL, в которой будут храниться данные */
$table = "MySTARWARS";

/* Создаем соединение */
mysql_connect($hostname, $username, $password) or die ("Не могу создать соединение");
 
/* Выбираем базу данных. Если произойдет ошибка - вывести ее */
mysql_select_db($dbName) or die (mysql_error());

mysql_query("SET NAMES 'utf8';");
mysql_query("SET CHARACTER SET 'utf8';");
mysql_query("SET SESSION collation_connection = 'utf8_general_ci';"); 

/* Составляем запрос для вставки информации в таблицу*/
$query ="insert into $table (data,site,name,phone,email,adress,sum,label,zakaz,ord) values
    (
        '".  mysql_real_escape_string($date)."',
        '".  mysql_real_escape_string($site)."', 
        '".  mysql_real_escape_string($name)."',
        '".  mysql_real_escape_string($phone)."',
        '".  mysql_real_escape_string($email)."',
        '".  mysql_real_escape_string($adress)."',
        '".  mysql_real_escape_string($sum)."',
        '".  mysql_real_escape_string($label)."',
        '".  mysql_real_escape_string($zakaz)."',
        'false'
    )";

/* Выполняем запрос. Если произойдет ошибка - вывести ее. */
mysql_query($query) or die(mysql_error());

/* Закрываем соединение */
mysql_close();
exit; 
?>