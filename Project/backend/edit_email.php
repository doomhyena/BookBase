<?php
    // CORS beállítások - mindig az elején, mielőtt bármi más történik
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');

    // Feltételezzük, hogy a db.php tartalmazza a $conn változót, ami az adatbázis kapcsolatot
    require  "db/db.php";

    if(!isset($_COOKIE['id'])){ // Ellenőrzi, hogy létezik-e 'id' nevű süti (cookie)
        header("Location: index.php"); // Ha nincs, átirányítja a felhasználót a főoldalra
    }

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(['success' => false, 'error' => 'Csak POST kérés engedélyezett.']);
        
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $newEmail = filter_var(trim($input['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $userId = $_COOKIE['id'];

    if (!filter_var($newEmail, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['success' => false, 'error' => 'Érvénytelen email cím!']);
        
    }

    // Ellenőrizzük, hogy az email már foglalt-e
    $stmt = $conn->prepare("SELECT id FROM users WHERE email = ? AND id != ?");
    $stmt->bind_param('si', $newEmail, $userId);
    $stmt->execute();
    if ($stmt->get_result()->num_rows > 0) {
        echo json_encode(['success' => false, 'error' => 'Ez az email cím már foglalt!']);
        
    }

    // Email frissítése
    $updateStmt = $conn->prepare("UPDATE users SET email = ? WHERE id = ?");
    $updateStmt->bind_param('si', $newEmail, $userId);
    
    if ($updateStmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Email cím sikeresen frissítve!']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Adatbázis hiba: ' . $conn->error]);
    }
