<?php
    // CORS beállítások - mindig az elején, mielőtt bármi más történik
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

        // Feltételezzük, hogy a db.php tartalmazza a $conn változót, ami az adatbázis kapcsolatot
        require  "db/db.php";

        // Véletlen könyvek lekérdezése (5 db)
        $sql = "SELECT * FROM books ORDER BY RAND() LIMIT 5";
        $result = $conn->query($sql);

        if ($result && $result->num_rows > 0) {
            $books = [];
            while ($row = $result->fetch_assoc()) {
                $books[] = [
                    'id' => $row['id'],
                    'title' => $row['title'],
                    'author' => $row['author'],
                    'cover' => $row['cover'] ?? '',
                    'summary' => $row['summary'] ?? ''
                ];
            }
            echo json_encode(["success" => true, "books" => $books]);
        } else {
            echo json_encode([
                "success" => false,
                "message" => "Nincs elérhető könyv."
            ]);
        }