<?php
    // CORS beállítások - mindig az elején, mielőtt bármi más történik
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
        
    // Preflight (OPTIONS) kérés kezelése
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    require "db/db.php";

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        // Bejegyzések lekérése
        $posts = [];
        $sql = "SELECT p.id, p.title, p.content, p.author, p.user_id, p.date FROM community_posts p ORDER BY p.date DESC LIMIT 50";
        $result = $conn->query($sql);
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $posts[] = $row;
            }
        }
        echo json_encode(["success" => true, "posts" => $posts]);
        exit;
    }

    if ($method === 'POST') {
        // Új bejegyzés létrehozása
        $data = json_decode(file_get_contents('php://input'), true);
        $title = $conn->real_escape_string($data['title'] ?? '');
        $content = $conn->real_escape_string($data['content'] ?? '');
        $author = $conn->real_escape_string($data['author'] ?? '');
        $userId = intval($data['userId'] ?? 0);
        $date = date('Y-m-d');
        if (!$title || !$content || !$author) {
            echo json_encode(["success" => false, "message" => "Hiányzó mezők!"]);
            exit;
        }
        $sql = "INSERT INTO community_posts (title, content, author, user_id, date) VALUES ('$title', '$content', '$author', $userId, '$date')";
        if ($conn->query($sql)) {
            echo json_encode(["success" => true, "message" => "Bejegyzés létrehozva."]);
        } else {
            echo json_encode(["success" => false, "message" => "Hiba a bejegyzés mentésekor."]);
        }
        exit;
    }
