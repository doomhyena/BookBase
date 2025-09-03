<?php
    // CORS beállítások – mindig az elején, hogy a frontend böngészője engedélyezze az API hívásokat
    header_remove(); // Törli az előző HTTP header-eket
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend oldalról érkező kéréseket engedélyezzük
    header('Access-Control-Allow-Credentials: true'); // Szükséges a cookie-k küldéséhez
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // Minden válasz JSON formátumban lesz

    // Preflight kérések kezelése (OPTIONS)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204); // No content
        exit();
    }

    // Adatbázis kapcsolat betöltése (db.php tartalmazza $conn változót)
    require "db/db.php";

    // ------------------- API RÉSZ -------------------
    //  Csak akkor fut le, ha API kérés érkezik: ?api=true
    if (isset($_GET['api']) && $_GET['api'] === 'true') {

        // Felhasználó azonosítása
        // Cookie-ból vesszük az ID-t, ha nincs, akkor GET paraméterből
        $userId = $_COOKIE['id'] ?? ($_GET['userId'] ?? null);

        // Ha nincs felhasználó ID, hibát adunk vissza
        if (!$userId) {
            echo json_encode(["success" => false, "message" => "Nincs bejelentkezett felhasználó!"]);
            exit;
        }

        // Lekérdezzük az utoljára olvasott könyveket a reading_history táblából
        // JOIN a books táblával, hogy a könyv adatai is meglegyenek
        $sql = "
            SELECT b.id, b.title, b.author, b.cover, b.summary, rh.read_date 
            FROM reading_history rh 
            JOIN books b ON rh.book_id = b.id 
            WHERE rh.user_id = $userId 
            ORDER BY rh.read_date DESC 
            LIMIT 5
        ";

        $result = $conn->query($sql); // Lekérdezés végrehajtása
        $books = [];

        // Ha van találat, hozzáadjuk a tömbhöz
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $books[] = $row; // Minden könyv adata
            }
            // Sikeres válasz a könyvekkel
            echo json_encode(["success" => true, "books" => $books]);
        } else {
            // Ha nincs olvasott könyv, üres tömb visszaadása
            echo json_encode(["success" => true, "books" => []]);
        }

        exit(); // Kilépünk, ne fusson tovább a kód
    }
