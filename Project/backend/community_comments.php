<?php
    // CORS és JSON header-ek – mindig az elején kell lenniük
    header_remove(); // Minden előző header törlése
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend engedélyezett
    header('Access-Control-Allow-Credentials: true'); // Cookie-k engedélyezése
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // Válasz típusa JSON

    // OPTIONS kérések kezelése (preflight)
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { 
        http_response_code(204); // Nincs tartalom, csak jelzés
        exit; 
    }

    require "db/db.php"; // Adatbázis kapcsolat betöltése
    $method = $_SERVER['REQUEST_METHOD']; // HTTP metódus lekérdezése

    // --- KOMMENTEK LEKÉRÉSE ---
    if ($method === 'GET') {
        $postId = intval($_GET['postId'] ?? 0); // Post azonosító
        if (!$postId) {
            echo json_encode(["success" => false, "message" => "Hiányzó postId!"]);
            exit;
        }

        $comments = [];
        // Lekérdezés: komment + felhasználó info
        $sql = "SELECT c.id, c.content, c.date, 
                    u.id AS user_id, u.username AS author, u.profile_picture, u.username
                FROM community_comments c 
                JOIN users u ON c.user_id = u.id 
                WHERE c.post_id = $postId 
                ORDER BY c.date DESC";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                // Profilkép URL összeállítása
                if (!empty($row['profile_picture']) && !empty($row['username'])) {
                    $row['profile_picture_url'] =
                        "http://localhost/BookBase-Dev/Project/backend/users/" .
                        $row['username'] . "/" . $row['profile_picture'];
                } else {
                    $row['profile_picture_url'] = null;
                }
                $comments[] = $row;
            }
        }

        echo json_encode(["success" => true, "comments" => $comments]); // Visszaadjuk a JSON-t
        exit;
    }

    // --- ÚJ KOMMENT LÉTREHOZÁSA ---
    if ($method === 'POST') {
        // Felhasználó azonosítása cookie alapján
        $userId = 0; // alapértelmezett: vendég
        if (isset($_COOKIE['id']) && intval($_COOKIE['id']) > 0) {
            $userId = intval($_COOKIE['id']);

            // Ellenőrizzük, hogy létezik-e a felhasználó
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

        // Bejelentkezés ellenőrzés
        if (!$userId) {
            echo json_encode(["success" => false, "message" => "Be kell jelentkezni a kommenteléshez!"]);
            exit;
        }

        // POST adatok dekódolása JSON-ból
        $data = json_decode(file_get_contents('php://input'), true);
        $postId = intval($data['postId'] ?? 0);
        $content = trim($conn->real_escape_string($data['content'] ?? ''));

        if (!$postId || !$content) {
            echo json_encode(["success" => false, "message" => "Hiányzó adatok!"]);
            exit;
        }

        // Felhasználó létezésének ellenőrzése
        $user_sql = "SELECT username FROM users WHERE id = $userId";
        $user_res = $conn->query($user_sql);
        if (!$user_res || $user_res->num_rows === 0) {
            echo json_encode(["success" => false, "message" => "Érvénytelen felhasználó!"]);
            exit;
        }
        $user = $user_res->fetch_assoc();
        $author = $conn->real_escape_string($user['username']);
        $date = date('Y-m-d H:i:s'); // Aktuális idő

        // Komment beszúrása az adatbázisba
        $sql = "INSERT INTO community_comments (post_id, content, author, user_id, date) 
                VALUES ($postId, '$content', '$author', $userId, '$date')";
        if ($conn->query($sql)) {
            echo json_encode(["success" => true, "message" => "Komment létrehozva."]);
        } else {
            echo json_encode(["success" => false, "message" => "Hiba a komment mentésekor."]);
        }
        exit;
    }

    // Hibakezelés: nem támogatott metódus
    echo json_encode(["success" => false, "message" => "Érvénytelen metódus!"]);
    exit;
