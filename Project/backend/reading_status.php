<?php
    // CORS beállítások – mindig az elején, hogy a frontend böngészője engedélyezze az API hívásokat
    header_remove(); // Törli az előző HTTP header-eket
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend oldalról érkező kéréseket engedélyezzük
    header('Access-Control-Allow-Credentials: true'); // Szükséges a cookie-k küldéséhez
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // Minden válasz JSON formátumban lesz

    // Adatbázis kapcsolat betöltése
    require_once 'db/db.php';

    // Preflight kérés kezelése CORS miatt
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200); // OK válasz
        exit(); // Kilépünk, nem fut a kód többi része
    }

    // Felhasználó és könyv azonosítók lekérése POST vagy GET-ből
    $user_id = $_POST['user_id'] ?? $_GET['user_id'] ?? null;
    $book_id = $_POST['book_id'] ?? $_GET['book_id'] ?? null;

    // Ellenőrzés: minden adat megvan-e
    if (!$user_id || !$book_id) {
        echo json_encode(['error' => 'Missing user_id or book_id']); // Hiányzó adat
        exit();
    }

    // Olvasási státusz lekérése POST-ból
    $status = $_POST['status'] ?? null;

    // ---------------- POST METÓDUS ----------------
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Mentés vagy frissítés az olvasási státusznál
        // ON DUPLICATE KEY UPDATE: ha már van rekord ugyanazzal a user_id+book_id, akkor frissítjük
        $stmt = $conn->prepare(
            'INSERT INTO reading_history (user_id, book_id, status) VALUES (?, ?, ?) 
            ON DUPLICATE KEY UPDATE status = VALUES(status)'
        );

        // Ha a prepared statement nem jött létre
        if (!$stmt) {
            echo json_encode(['error' => $conn->error]);
            exit();
        }

        // Paraméterek bekötése: 'i' = integer, 's' = string
        $stmt->bind_param('iis', $user_id, $book_id, $status);

        // Lekérdezés végrehajtása és visszajelzés
        if ($stmt->execute()) {
            echo json_encode(['success' => true]); // Siker
        } else {
            echo json_encode(['error' => $stmt->error]); // Hiba
        }

        $stmt->close(); // Prepared statement bezárása
        exit();
    }

    // ---------------- GET METÓDUS ----------------
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        // Lekérdezzük a státuszt a reading_history táblából
        $stmt = $conn->prepare('SELECT status FROM reading_history WHERE user_id = ? AND book_id = ?');

        if (!$stmt) {
            echo json_encode(['error' => $conn->error]);
            exit();
        }

        $stmt->bind_param('ii', $user_id, $book_id);
        $stmt->execute();
        $result = $stmt->get_result();

        // Ha van rekord, visszaadjuk a státuszt
        if ($row = $result->fetch_assoc()) {
            echo json_encode(['status' => $row['status']]);
        } else {
            echo json_encode(['status' => null]); // Nincs rekord, null visszaadása
        }

        $stmt->close(); // Prepared statement bezárása
        exit();
    }

    // Ha nem GET vagy POST, hibát adunk vissza
    echo json_encode(['error' => 'Invalid request']);
    exit();
