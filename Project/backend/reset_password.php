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
    $token = $input['token'] ?? '';
    $newPassword = $input['new_password'] ?? '';

    if (!$token || !$newPassword) {
        echo json_encode(['success' => false, 'error' => 'Hiányzó token vagy új jelszó.']);
        
    }

    if (strlen($newPassword) < 6) {
        echo json_encode(['success' => false, 'error' => 'A jelszónak legalább 6 karakter hosszúnak kell lennie.']);
        
    }

    // Token ellenőrzése
    $stmt = $conn->prepare('SELECT user_id, expires FROM password_resets WHERE token = ? AND expires > NOW()');
    $stmt->bind_param('s', $token);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        echo json_encode(['success' => false, 'error' => 'Érvénytelen vagy lejárt token.']);
        
    }

    $resetData = $result->fetch_assoc();
    $userId = $resetData['user_id'];

    // Jelszó frissítése
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    $updateStmt = $conn->prepare('UPDATE users SET password = ? WHERE id = ?');
    $updateStmt->bind_param('si', $hashedPassword, $userId);

    if ($updateStmt->execute()) {
        // Token törlése
        $conn->query("DELETE FROM password_resets WHERE token = '$token'");
        echo json_encode(['success' => true, 'message' => 'Jelszó sikeresen frissítve!']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Adatbázis hiba: ' . $conn->error]);
    }

