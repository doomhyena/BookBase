<?php
    // CORS beállítások
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

    require "db/db.php";

    // Csak POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        echo json_encode(["success" => false, "message" => "Csak POST metódus engedélyezett!"]);
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $book_id = $input['book_id'] ?? null;
    $rating = $input['rating'] ?? null;
    $user_id = $_COOKIE['id'] ?? ($input['user_id'] ?? null);

    if (!$book_id || !$rating || !$user_id) {
        echo json_encode(["success" => false, "message" => "Hiányzó adatok!"]);
        exit;
    }
    if ($rating < 1 || $rating > 5) {
        echo json_encode(["success" => false, "message" => "Az értékelés 1 és 5 között kell legyen!"]);
        exit;
    }

    // Értékelés mentése vagy frissítése
    $sql = "INSERT INTO ratings (book_id, user_id, rating) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE rating = VALUES(rating)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('iii', $book_id, $user_id, $rating);
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Értékelés mentve!"]);
    } else {
        echo json_encode(["success" => false, "message" => "Hiba történt az értékelés mentésekor!"]);
    }
