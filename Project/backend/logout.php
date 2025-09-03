<?php
    // CORS beállítások – mindig az elején, hogy a frontend böngészője engedélyezze az API hívásokat
    header_remove(); // Törli az előző HTTP header-eket
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend oldalról érkező kéréseket engedélyezzük
    header('Access-Control-Allow-Credentials: true'); // Szükséges a cookie-k küldéséhez
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // Minden válasz JSON formátumban lesz

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
