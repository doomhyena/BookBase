<?php
    // CORS és JSON header-ek – mindenképp a fájl elején legyenek
    header_remove(); // Törli az előző header-eket
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend engedélyezett
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Access-Control-Allow-Credentials: true'); // Cookie-k engedélyezése
    header('Content-Type: application/json'); // JSON válasz

    // Preflight (OPTIONS) kérés kezelése
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204); // Nincs tartalom, csak jelzés a böngészőnek
        exit;
    }

    require "db/db.php"; // Adatbázis kapcsolat betöltése
    $method = $_SERVER['REQUEST_METHOD']; // HTTP metódus

    // --- BEJEGYZÉSEK LEKÉRÉSE ---
    if ($method === 'GET') {
        $posts = [];
        // Lekérdezés: utolsó 50 bejegyzés
        $sql = "SELECT p.id, p.title, p.content, p.author, p.user_id, p.date 
                FROM community_posts p 
                ORDER BY p.date DESC LIMIT 50";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $posts[] = $row; // Minden bejegyzés hozzáadása a tömbhöz
            }
        }

        echo json_encode(["success" => true, "posts" => $posts]); // JSON visszaadás
        exit;
    }

    // --- ÚJ BEJEGYZÉS LÉTREHOZÁSA ---
    if ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true); // JSON dekódolása

        // Bejegyzés adatok
        $title = $conn->real_escape_string($data['title'] ?? '');
        $content = $conn->real_escape_string($data['content'] ?? '');
        $author = $conn->real_escape_string($data['author'] ?? '');
        $date = date('Y-m-d'); // Aktuális dátum

        // Felhasználó azonosítása cookie alapján
        $userId = 0; // alapértelmezett: vendég
        if (isset($_COOKIE['id']) && intval($_COOKIE['id']) > 0) {
            $userId = intval($_COOKIE['id']);

            // Ellenőrizzük, hogy létezik-e a user
            $stmt = $conn->prepare("SELECT username FROM users WHERE id = ? LIMIT 1");
            $stmt->bind_param("i", $userId);
            $stmt->execute();
            $result = $stmt->get_result();

            if ($row = $result->fetch_assoc()) {
                $author = $row['username']; // Ha létezik, átírjuk az author-t
            } else {
                $userId = 0;
                $author = "Vendég";
            }
            $stmt->close();
        } elseif (isset($data['userId']) && intval($data['userId']) > 0) {
            $userId = intval($data['userId']);
        } else {
            $author = "Vendég"; // Nincs bejelentkezve
        }

        // Ellenőrizzük, hogy minden szükséges mező megvan-e
        if (!$title || !$content) {
            echo json_encode(["success" => false, "message" => "Hiányzó mezők!"]);
            exit;
        }

        // SQL beszúrás az adatbázisba
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
