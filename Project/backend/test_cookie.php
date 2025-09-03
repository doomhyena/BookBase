<?php
    // CORS beállítások – engedélyezzük a frontend API hívásokat
    header_remove(); // Törli az összes előző HTTP header-t
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend oldalról érkező kéréseket engedélyezzük
    header('Access-Control-Allow-Credentials: true'); // Engedélyezi a cookie-k küldését a kérés során
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // Minden válasz JSON formátumban lesz

    // Ellenőrizzük, hogy van-e 'id' nevű cookie
    if (isset($_COOKIE['id'])) {
        // Ha van cookie, visszaküldjük a frontendnek
        echo json_encode([
            "success" => true,       // Sikeres művelet
            "cookie_id" => $_COOKIE['id'] // A cookie értéke
        ]);
    } else {
        // Ha nincs cookie, hibát küldünk vissza
        echo json_encode([
            "success" => false,      // Sikertelen művelet
            "message" => "Nincs id cookie a request-ben!" // Hibamegjegyzés
        ]);
    }
