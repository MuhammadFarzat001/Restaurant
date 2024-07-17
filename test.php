<?php
include_once "connectionToDB.php";
include_once "verschluesselung.php";
$conn = new MenuDatabase();

/*$result = $conn->getDBConnection()->query("SELECT * from users;");
			while ($row = $result->fetch_assoc()) {
                echo decrypt($row["password"], $registerationPassword)."\n";
			}
            */

            
            echo urlencode(encrypt('muhamadfarzat001@gmail.com',$newPassword))."\n";
?>