<?php
    // Létrehoz egy új MySQLi kapcsolatot a "bookbase" adatbázishoz a localhost-on, root felhasználóval, jelszó nélkül
    $conn = new mysqli("localhost", "root", "", "bookbase");

    // Ellenőrzi, hogy a kapcsolat létrejött-e, ha nem, akkor leállítja a futást és kiírja a hibaüzenetet
    if($conn->connect_error){
        die("Kapcsolat sikertelen! ".$conn->connect_error);
    }
?>
