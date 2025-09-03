<?php
    // CORS és JSON beállítások – mindig a fájl elején
    header_remove(); // Törli az előző header-eket
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend engedélyezett
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // JSON válasz

    // Adatbázis kapcsolat betöltése
    require_once __DIR__ . '/db/db.php';

    // Csak POST kérések engedélyezettek
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'error' => 'Csak POST kérés engedélyezett.']);
        exit;
    }

    // Bemenet dekódolása JSON formátumból
    $input = json_decode(file_get_contents('php://input'), true);
    $email = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL);

    // Email formátum ellenőrzése
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'error' => 'Érvénytelen email cím!']);
        exit;
    }

    // Ellenőrizzük, hogy létezik-e a felhasználó az adott email címmel
    $stmt = $conn->prepare('SELECT id, username FROM users WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Nincs ilyen email cím regisztrálva!']);
        exit;
    }

    // Felhasználó adatainak lekérése
    $user = $result->fetch_assoc();
    $userId = $user['id'];
    $username = $user['username'];

    // Token generálás a jelszó visszaállításhoz
    $token = bin2hex(random_bytes(32)); // 64 karakteres biztonságos token
    $expires = date('Y-m-d H:i:s', strtotime('+1 hour')); // 1 órás érvényesség

    // Password resets tábla létrehozása, ha még nem létezik
    $conn->query("
        CREATE TABLE IF NOT EXISTS password_resets (
            id INT AUTO_INCREMENT PRIMARY KEY, 
            user_id INT, 
            token VARCHAR(64), 
            expires DATETIME
        )
    ");

    // Token mentése az adatbázisba
    $stmt2 = $conn->prepare('INSERT INTO password_resets (user_id, token, expires) VALUES (?, ?, ?)');
    $stmt2->bind_param('iss', $userId, $token, $expires);
    $stmt2->execute();

    // JSON válasz a frontendnek
    echo json_encode([
        'success' => true, 
        'message' => 'Email cím megtalálva! Átirányítás a jelszó módosítás oldalra...',
        'token' => $token, // a frontendre küldött token
        'redirect_url' => "/reset-password?token=$token" // jelszó reset URL
    ]);
