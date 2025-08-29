<?php
    // CORS beállítások
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
        http_response_code(204); 
        exit; 
    }

    require "db/db.php";
    $method = $_SERVER['REQUEST_METHOD'];

    // --- KOMMENTEK LEKÉRÉSE ---
    if ($method === 'GET') {
        $postId = intval($_GET['postId'] ?? 0);
        if (!$postId) {
            echo json_encode(["success" => false, "message" => "Hiányzó postId!"]);
            exit;
        }

        $comments = [];
        $sql = "SELECT c.id, c.content, c.date, 
                    u.id AS user_id, u.username AS author, u.profile_picture 
                FROM community_comments c 
                JOIN users u ON c.user_id = u.id 
                WHERE c.post_id = $postId 
                ORDER BY c.date DESC";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $comments[] = $row;
            }
        }

        echo json_encode(["success" => true, "comments" => $comments]);
        exit;
    }

    // --- ÚJ KOMMENT LÉTREHOZÁSA ---
    if ($method === 'POST') {
        // Cookie-ból user azonosító
        // Felhasználó azonosítása
        $userId = 0; // default: vendég
        if (isset($_COOKIE['id']) && intval($_COOKIE['id']) > 0) {
            $userId = intval($_COOKIE['id']);

            // Ellenőrizzük, hogy tényleg létezik-e a user
            $stmt = $conn->prepare("SELECT username FROM users WHERE id = ? LIMIT 1");
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                $author = $row['username'];
            } else {
                $userId = 0; 
                $author = "Vendég";
            }
            $stmt->close();
        } elseif (isset($data['userId']) && intval($data['userId']) > 0) {
            $userId = intval($data['userId']);
        } else {
            $author = "Vendég";
        }
        if (!$userId) {
            echo json_encode(["success" => false, "message" => "Be kell jelentkezni a kommenteléshez!"]);
            exit;
        }

        $data = json_decode(file_get_contents('php://input'), true);
        $postId = intval($data['postId'] ?? 0);
        $content = trim($conn->real_escape_string($data['content'] ?? ''));

        if (!$postId || !$content) {
            echo json_encode(["success" => false, "message" => "Hiányzó adatok!"]);
            exit;
        }

        $user_sql = "SELECT username FROM users WHERE id = $userId";
        $user_res = $conn->query($user_sql);
        if (!$user_res || $user_res->num_rows === 0) {
            echo json_encode(["success" => false, "message" => "Érvénytelen felhasználó!"]);
            exit;
        }
        $user = $user_res->fetch_assoc();
        $author = $conn->real_escape_string($user['username']);
        $date = date('Y-m-d H:i:s');

        $sql = "INSERT INTO community_comments (post_id, content, author, user_id, date) 
                VALUES ($postId, '$content', '$author', $userId, '$date')";
        if ($conn->query($sql)) {
            echo json_encode(["success" => true, "message" => "Komment létrehozva."]);
        } else {
            echo json_encode(["success" => false, "message" => "Hiba a komment mentésekor."]);
        }
        exit;
    }

    echo json_encode(["success" => false, "message" => "Érvénytelen metódus!"]);
    exit;
