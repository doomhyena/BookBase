<?php
    // CORS beállítások – engedélyezzük a frontend API hívásokat
    header_remove(); // Törli az összes előző HTTP header-t
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend oldalról érkező kéréseket engedélyezzük
    header('Access-Control-Allow-Credentials: true'); // Engedélyezi a cookie-k küldését a kérés során
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // Minden válasz JSON formátumban lesz

    // Preflight (OPTIONS) kérés kezelése
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
        http_response_code(204); // Nincs tartalom, csak engedélyezés
        exit;
    }

    // Adatbázis kapcsolat betöltése
    require "db/db.php";

    // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve (cookie létezik-e)
    if(!isset($_COOKIE['id'])){ 
        echo json_encode(["success" => false, "message" => "Nincs bejelentkezett felhasználó!"]);
        exit;
    }

    // Top 20 könyv lekérdezése az adatbázisból (id szerint csökkenő sorrendben)
    $sql = "SELECT * FROM books ORDER BY id DESC LIMIT 20";
    $result = $conn->query($sql);

    // Könyvek feldolgozása és tömbbe gyűjtése
    $books = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $books[] = [
                'id' => $row['id'],                 // Könyv azonosító
                'title' => $row['title'],           // Könyv címe
                'author' => $row['author'],         // Szerző
                'cover' => $row['cover'],           // Borító URL vagy elérési út
                'summary' => $row['summary'] ?? ''  // Rövid leírás (ha nincs, üres string)
            ];
        }
        // Visszaküldjük a frontendnek JSON formátumban a könyveket
        echo json_encode(["success" => true, "books" => $books]);
    } else {
        // Ha nincs találat, hibát küldünk vissza
        echo json_encode([
            "success" => false,
            "message" => "Nincs elérhető könyv."
        ]);
    }
