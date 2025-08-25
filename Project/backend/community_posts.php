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

    if ($method === 'GET') {
        $posts = [];
        $sql = "SELECT p.id, p.title, p.content, p.author, p.user_id, p.date 
                FROM community_posts p 
                ORDER BY p.date DESC LIMIT 50";
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
        $data = json_decode(file_get_contents('php://input'), true);

        $title = trim($data['title'] ?? '');
        $content = trim($data['content'] ?? '');
        $author = trim($data['author'] ?? '');
        $date = date('Y-m-d');

        // 🔑 Elsőként a cookie-ból próbáljuk kinyerni a felhasználót
        if (isset($_COOKIE['id']) && intval($_COOKIE['id']) > 0) {
            $userId = intval($_COOKIE['id']);

            // Lekérdezzük az adatbázisból a username-et
            $stmt = $conn->prepare("SELECT username FROM users WHERE id = ? LIMIT 1");
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($row = $result->fetch_assoc()) {
                $author = $row['username'];
            } else {
                $author = "Vendég";
                $userId = "NULL";
            }
        } else {
            // ha nincs cookie, akkor frontend által küldött adatok
            $userId = isset($data['userId']) ? intval($data['userId']) : 0;
            if ($userId <= 0) {
                $author = "Vendég";
                $userId = "NULL";
            }
        }

        // Kötelező mezők ellenőrzése
        if (!$title || !$content || !$author) {
            echo json_encode(["success" => false, "message" => "Hiányzó mezők!"]);
            exit;
        }

        $titleSafe = $conn->real_escape_string($title);
        $contentSafe = $conn->real_escape_string($content);
        $authorSafe = $conn->real_escape_string($author);

        $sql = "INSERT INTO community_posts (title, content, author, user_id, date) 
                VALUES ('$titleSafe', '$contentSafe', '$authorSafe', $userId, '$date')";

        try {
            if ($conn->query($sql)) {
                echo json_encode(["success" => true, "message" => "Bejegyzés létrehozva."]);
            } else {
                echo json_encode(["success" => false, "message" => "Hiba a bejegyzés mentésekor: " . $conn->error]);
            }
        } catch (mysqli_sql_exception $e) {
            echo json_encode(["success" => false, "message" => "Szerverhiba: " . $e->getMessage()]);
        }
        exit;
    }