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
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $email = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $newPassword = $input['new_password'] ?? '';

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || !$newPassword) {
        echo json_encode(['success' => false, 'error' => 'Hiányzó vagy érvénytelen email, vagy új jelszó.']);
        exit;
    }

    if (strlen($newPassword) < 6) {
        echo json_encode(['success' => false, 'error' => 'A jelszónak legalább 6 karakter hosszúnak kell lennie.']);
        exit;
    }

    $stmt = $conn->prepare('SELECT id FROM users WHERE email = ?');
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Nincs ilyen email cím regisztrálva!']);
        exit;
    }

    $user = $result->fetch_assoc();
    $userId = $user['id'];

    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $updateStmt = $conn->prepare('UPDATE users SET password = ? WHERE id = ?');
    $updateStmt->bind_param('si', $hashedPassword, $userId);

    if ($updateStmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Jelszó sikeresen frissítve!']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Adatbázis hiba: ' . $conn->error]);
    }

