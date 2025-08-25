<?php

    // CORS beállítások - mindig az elején, mielőtt bármi más történik
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');

    require "db/db.php";
    
    // Ellenőrizzük, hogy API kérés-e
    if(isset($_GET['api']) && $_GET['api'] === 'true') {
        header('Content-Type: application/json');
        
        // Kijelentkezés
        setcookie("id", "", time() - 3600, "/");
        echo json_encode(['success' => true, 'message' => 'Sikeres kijelentkezés!']);
        exit;
    }
    
    // HTML kijelentkezés (eredeti funkció)
    if(isset($_COOKIE['id'])){
        setcookie("id", "", time() - 3600, "/");
        echo "<script>alert('Sikeres kijelentkezés!'); window.location.href='index.php';</script>";
    } else {
        echo "<script>alert('Már ki vagy jelentkezve!'); window.location.href='index.php';</script>";
    }
