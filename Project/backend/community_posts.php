<?php
    // CORS beállítások
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true'); // 🔥 kell a cookie-hoz
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
        // Új bejegyzés létrehozása
        $data = json_decode(file_get_contents('php://input'), true);

        $title = $conn->real_escape_string($data['title'] ?? '');
        $content = $conn->real_escape_string($data['content'] ?? '');
        $author = $conn->real_escape_string($data['author'] ?? '');
        $date = date('Y-m-d');

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

        // Mezők ellenőrzése
        if (!$title || !$content) {
            echo json_encode(["success" => false, "message" => "Hiányzó mezők!"]);
            exit;
        }

        // SQL beszúrás
        $sql = "INSERT INTO community_posts (title, content, author, user_id, date) 
                VALUES ('$title', '$content', '$author', $userId, '$date')";

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
