<?php
    // CORS beállítások – az elején, hogy a frontend engedélyezze az API hívásokat
    header_remove(); // Törli az összes előző HTTP header-t
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend oldalról érkező kéréseket engedélyezzük
    header('Access-Control-Allow-Credentials: true'); // Engedélyezi a cookie-k küldését a kéréssel
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // Válasz formátuma JSON

    // Adatbázis kapcsolat betöltése (db.php tartalmazza a $conn változót)
    require_once __DIR__ . '/db/db.php';

    // Csak POST kérések engedélyezettek
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'error' => 'Csak POST kérés engedélyezett.']);
        exit;
    }

    // A POST-ban küldött JSON bemenet dekódolása
    $input = json_decode(file_get_contents('php://input'), true);

    // Email és új jelszó kinyerése és tisztítása
    $email = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL); // Email megtisztítása
    $newPassword = $input['new_password'] ?? ''; // Új jelszó

    // Ellenőrizzük, hogy az email érvényes és a jelszó meg van adva
    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !$newPassword) {
        echo json_encode(['success' => false, 'error' => 'Hiányzó vagy érvénytelen email, vagy új jelszó.']);
        exit;
    }

    // Minimum jelszó hossz ellenőrzése
    if (strlen($newPassword) < 6) {
        echo json_encode(['success' => false, 'error' => 'A jelszónak legalább 6 karakter hosszúnak kell lennie.']);
        exit;
    }

    // Ellenőrizzük, hogy létezik-e a megadott email az adatbázisban
    $stmt = $conn->prepare('SELECT id FROM users WHERE email = ?'); // Előkészített lekérdezés SQL injection ellen
    $stmt->bind_param('s', $email); // A ? helyére kerül az email
    $stmt->execute();
    $result = $stmt->get_result();

    // Ha nincs ilyen email, hibát adunk
    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Nincs ilyen email cím regisztrálva!']);
        exit;
    }

    // Ha van ilyen felhasználó, lekérjük az azonosítóját
    $user = $result->fetch_assoc();
    $userId = $user['id'];

    // Új jelszó titkosítása
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

    // Adatbázis frissítés előkészítése – új jelszó beállítása
    $updateStmt = $conn->prepare('UPDATE users SET password = ? WHERE id = ?');
    $updateStmt->bind_param('si', $hashedPassword, $userId); // 's' = string, 'i' = integer

    // Lekérdezés futtatása és válasz visszaküldése
    if ($updateStmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Jelszó sikeresen frissítve!']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Adatbázis hiba: ' . $conn->error]);
    }
