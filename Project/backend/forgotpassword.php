<?php
    // CORS beállítások - mindig az elején, mielőtt bármi más történik
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
    
    require_once __DIR__ . '/db/db.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'error' => 'Csak POST kérés engedélyezett.']);
        
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $email = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'error' => 'Érvénytelen email cím!']);
        
    }

    // Ellenőrizzük, hogy van-e ilyen email a users táblában
    $stmt = $conn->require('SELECT id, username FROM users WHERE email = ?');

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Nincs ilyen email cím regisztrálva!']);
        
    }

    $user = $result->fetch_assoc();
    $userId = $user['id'];
    $username = $user['username'];

    // Token generálás (egyszerű példa)
    $token = bin2hex(random_bytes(32));
    $expires = date('Y-m-d H:i:s', strtotime('+1 hour'));

    // Token mentése a password_resets táblába
    $conn->query("CREATE TABLE IF NOT EXISTS password_resets (id INT AUTO_INCREMENT PRIMARY KEY, user_id INT, token VARCHAR(64), expires DATETIME)");
    $stmt2 = $conn->prepare('INSERT INTO password_resets (user_id, token, expires) VALUES (?, ?, ?)');
    $stmt2->bind_param('iss', $userId, $token, $expires);
    $stmt2->execute();

    // Sikeres válasz a token-nel
    echo json_encode([
        'success' => true, 
        'message' => 'Email cím megtalálva! Átirányítás a jelszó módosítás oldalra...',
        'token' => $token,
        'redirect_url' => "/reset-password?token=$token"
    ]);