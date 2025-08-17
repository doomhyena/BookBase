<?php
    // CORS beállítások - mindig az elején, mielőtt bármi más történik
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
    
    // Feltételezzük, hogy a db.php tartalmazza a $conn változót, ami az adatbázis kapcsolatot
    require  "db/db.php";

    if(!isset($_COOKIE['id'])){ // Ellenőrzi, hogy létezik-e 'id' nevű süti (cookie)
        header("Location: index.php"); // Ha nincs, átirányítja a felhasználót a főoldalra
    }

    // Top 20 könyv lekérdezése (jelenleg csak az összes könyvet adja vissza, mert nincs rating rendszer)
    $sql = "SELECT * FROM books ORDER BY id DESC LIMIT 20";
    $result = $conn->query($sql);

    $books = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $books[] = [
                'id' => $row['id'],
                'title' => $row['title'],
                'author' => $row['author'],
                'cover' => $row['cover'],
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
