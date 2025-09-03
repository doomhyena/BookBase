<?php
    // Hibajelentés beállítások
    error_reporting(E_ALL);               // Minden típusú hibát jelezzen a PHP
    ini_set('display_errors', 0);        // Ne jelenítse meg a hibákat a böngészőben
    ini_set('log_errors', 1);            // Logolja a hibákat
    ini_set('error_log', __DIR__ . '/php_error.log'); // Hiba napló fájl helye

    // Shutdown function, ami a kritikus hibákat kezeli
    register_shutdown_function(function() {
        $error = error_get_last(); // Lekéri az utolsó hibát
        // Ha van hiba és az kritikus típusú (pl. fatális hibák)
        if ($error && in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR])) {
            header('Content-Type: application/json'); // JSON válasz
            echo json_encode([
                "success" => false, 
                "message" => "Szerverhiba: " . $error['message'] // Hibaleírás
            ]);
            exit; // Kilépés
        }
    });

    // Adatbázis kapcsolat létrehozása
    $conn = new mysqli("localhost", "root", "", "bookbase");

    // Ha nem sikerül kapcsolódni az adatbázishoz
    if($conn->connect_error){
        header('Content-Type: application/json'); // JSON formátumban adunk vissza
        echo json_encode([
            "success" => false, 
            "message" => "Kapcsolat sikertelen! ".$conn->connect_error
        ]);
        exit; // Kilépés, mert nincs értelme folytatni
    }
