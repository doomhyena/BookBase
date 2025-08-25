<?php
    // CORS beállítások - mindig az elején, mielőtt bármi más történik
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

    require "db/db.php";

    // API lekérdezés: csak JSON válasz
    if (isset($_GET['api']) && $_GET['api'] === 'true') {
        // Felhasználó azonosító lekérése cookie-ból vagy paraméterből
        $userId = $_COOKIE['id'] ?? ($_GET['userId'] ?? null);
        if (!$userId) {
            echo json_encode(["success" => false, "message" => "Nincs bejelentkezett felhasználó!"]);
            exit;
        }
        // Legutóbb olvasott könyvek lekérdezése (példa: 5 legutóbbi)
        $sql = "SELECT b.id, b.title, b.author, b.cover, b.summary, rh.read_date FROM reading_history rh JOIN books b ON rh.book_id = b.id WHERE rh.user_id = $userId ORDER BY rh.read_date DESC LIMIT 5";
        $result = $conn->query($sql);
        $books = [];
        if ($result && $result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                $books[] = $row;
            }
            echo json_encode(["success" => true, "books" => $books]);
        } else {
            echo json_encode(["success" => true, "books" => []]);
        }
        exit;
    }
