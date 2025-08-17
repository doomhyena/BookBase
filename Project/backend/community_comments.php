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
        // Kommentek lekérése egy bejegyzéshez
        $postId = intval($_GET['postId'] ?? 0);
        $comments = [];
        $sql = "SELECT c.id, c.content, c.author, c.user_id, c.date FROM community_comments c WHERE c.post_id = $postId ORDER BY c.date DESC";
        $result = $conn->query($sql);
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $comments[] = $row;
            }
        }
        echo json_encode(["success" => true, "comments" => $comments]);
        exit;
    }

    if ($method === 'POST') {
        // Új komment létrehozása
        $data = json_decode(file_get_contents('php://input'), true);
        $postId = intval($data['postId'] ?? 0);
        $content = $conn->real_escape_string($data['content'] ?? '');
        $author = $conn->real_escape_string($data['author'] ?? '');
        $userId = intval($data['userId'] ?? 0);
        $date = date('Y-m-d');
        if (!$content || !$author || !$postId) {
            echo json_encode(["success" => false, "message" => "Hiányzó mezők!"]);
            exit;
        }
        $sql = "INSERT INTO community_comments (post_id, content, author, user_id, date) VALUES ($postId, '$content', '$author', $userId, '$date')";
        if ($conn->query($sql)) {
            echo json_encode(["success" => true, "message" => "Komment létrehozva."]);
        } else {
            echo json_encode(["success" => false, "message" => "Hiba a komment mentésekor."]);
        }
        exit;
    }
