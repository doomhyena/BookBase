<?php
    // CORS beállítások – mindig az elején, hogy a frontend böngészője engedélyezze az API hívásokat
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
    require "db/db.php";

    // GET metódus kezelése – lekérdezzük a felhasználó értékelését egy könyvre
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // GET paraméterek vagy cookie-ból vett user_id
        $book_id = $_GET['book_id'] ?? null; // Könyv azonosító
        $user_id = $_GET['user_id'] ?? ($_COOKIE['id'] ?? null); // Felhasználó azonosító
        
        // Ellenőrzés: minden adat megvan-e
        if (!$book_id || !$user_id) {
            echo json_encode(["success" => false, "message" => "Hiányzó adatok!"]);
            exit;
        }

        // Prepared statement a biztonságos SQL lekérdezéshez
        $sql = "SELECT rating FROM ratings WHERE book_id = ? AND user_id = ?";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param('ii', $book_id, $user_id); // 'ii' = két egész szám
        $stmt->execute();
        $result = $stmt->get_result();

        // Ellenőrizzük, hogy van-e értékelés
        if ($row = $result->fetch_assoc()) {
            echo json_encode(["success" => true, "rating" => (int)$row['rating']]); // Van értékelés
        } else {
            echo json_encode(["success" => true, "rating" => 0]); // Nincs értékelés, visszaadunk 0-t
        }
        exit;
    }

    // Csak POST engedélyezett a további kódhoz
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["success" => false, "message" => "Csak POST metódus engedélyezett!"]);
        exit;
    }

    // POST adatok dekódolása JSON-ból
    $input = json_decode(file_get_contents('php://input'), true);
    $book_id = $input['book_id'] ?? null;
    $rating = $input['rating'] ?? null;
    $user_id = $_COOKIE['id'] ?? ($input['user_id'] ?? null);

    // Ellenőrizzük, hogy minden kötelező adat megvan-e
    if (!$book_id || !$rating || !$user_id) {
        echo json_encode(["success" => false, "message" => "Hiányzó adatok!"]);
        exit;
    }

    // Értékelés tartomány ellenőrzése (1–5)
    if ($rating < 1 || $rating > 5) {
        echo json_encode(["success" => false, "message" => "Az értékelés 1 és 5 között kell legyen!"]);
        exit;
    }

    // Értékelés mentése vagy frissítése
    // ON DUPLICATE KEY UPDATE – ha már van ilyen user_id+book_id páros, akkor frissítjük
    $sql = "INSERT INTO ratings (book_id, user_id, rating) VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE rating = VALUES(rating)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('iii', $book_id, $user_id, $rating);

    // Lekérdezés végrehajtása és visszajelzés
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Értékelés mentve!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Hiba történt az értékelés mentésekor!"]);
    }
