<?php
    // CORS beállítások – mindig az elején, hogy a frontend böngészője engedélyezze az API hívásokat
    header_remove(); // Törli az előző HTTP header-eket
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend oldalról érkező kéréseket engedélyezzük
    header('Access-Control-Allow-Credentials: true'); // Szükséges a cookie-k küldéséhez
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // Minden válasz JSON formátumban lesz


    // Preflight (OPTIONS) kérések kezelése – böngésző először mindig OPTIONS-t küld, ha CORS van
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204); // No Content, nincs tartalom
        exit();
    }

    // Adatbázis kapcsolat betöltése (db.php tartalmazza a $conn változót)
    require "db/db.php";

    // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve (létezik-e 'id' nevű süti)
    if(!isset($_COOKIE['id'])) {
        // Ha nincs süti, hibát adunk vissza
        echo json_encode(["success" => false, "message" => "Nincs bejelentkezett felhasználó!"]);
        exit();
    }

    // Ajánlott könyvek lekérdezése
    // Jelenleg véletlenszerűen választunk ki 10 könyvet a books táblából
    $sql = "SELECT * FROM books ORDER BY RAND() LIMIT 10";
    $result = $conn->query($sql);

    // Tömb a könyvek adataihoz
    $books = [];

    // Ha van találat, a könyvek adatait hozzáadjuk a tömbhöz
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $books[] = [
                'id' => $row['id'],               // Könyv azonosító
                'title' => $row['title'],         // Könyv címe
                'author' => $row['author'],       // Szerző
                'cover' => $row['cover'],         // Borító kép elérési útja
                'summary' => $row['summary'] ?? ''// Rövid leírás (ha nincs, üres string)
            ];
        }

        // JSON válasz a sikeres lekérdezésről és a könyvekről
        echo json_encode(["success" => true, "books" => $books]);

    } else {
        // Ha nincs elérhető könyv, hibaüzenet visszaadása
        echo json_encode([
            "success" => false,
            "message" => "Nincs elérhető ajánlott könyv."
        ]);
    }
