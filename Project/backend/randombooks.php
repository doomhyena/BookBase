<?php
    // CORS beállítások – mindig az elején, hogy a böngésző engedélyezze az API hívást
    header_remove(); // Törli az előző HTTP header-eket
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend oldalról érkező kéréseket engedélyezzük
    header('Access-Control-Allow-Credentials: true'); // Szükséges a cookie-k küldéséhez
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // Minden válasz JSON formátumban lesz

    // Preflight (OPTIONS) kérés kezelése – CORS miatt
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
        http_response_code(204); // Nincs tartalom válasz
        exit; // Kilépünk, a kód többi része nem fut
    }

    // Adatbázis kapcsolat betöltése
    // Feltételezzük, hogy a db.php tartalmazza a $conn változót, ami az adatbázis kapcsolat
    require "db/db.php";

    // Véletlen könyvek lekérdezése – LIMIT 5
    $sql = "SELECT * FROM books ORDER BY RAND() LIMIT 5"; // SQL lekérdezés, random sorrendben
    $result = $conn->query($sql); // Lekérdezés futtatása

    // Ellenőrizzük, hogy van-e eredmény
    if ($result && $result->num_rows > 0) {
        $books = []; // Tömb létrehozása a könyveknek
        while ($row = $result->fetch_assoc()) { // Soronkénti feldolgozás
            $books[] = [
                'id' => $row['id'], // Könyv azonosító
                'title' => $row['title'], // Könyv címe
                'author' => $row['author'], // Szerző neve
                'cover' => $row['cover'] ?? '', // Borítókép – ha nincs, üres string
                'summary' => $row['summary'] ?? '' // Rövid összefoglaló – ha nincs, üres string
            ];
        }
        // JSON formátumban visszaküldjük a könyveket a frontendnek
        echo json_encode(["success" => true, "books" => $books]);
    } else {
        // Ha nincs elérhető könyv, hibát jelez
        echo json_encode([
            "success" => false,
            "message" => "Nincs elérhető könyv."
        ]);
    }
