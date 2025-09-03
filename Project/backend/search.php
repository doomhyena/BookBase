<?php
    // CORS beállítások – fontos a frontend API hívások engedélyezéséhez
    header_remove(); // Törli az összes előző HTTP header-t
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend oldalról érkező kéréseket engedélyezzük
    header('Access-Control-Allow-Credentials: true'); // Engedélyezi a cookie-k küldését
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // Válasz formátuma JSON

    // Preflight (OPTIONS) kérés kezelése – böngésző AJAX CORS miatt
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204); // Nincs tartalom, de sikeres választ küld
        exit;
    }

    // Adatbázis kapcsolat betöltése
    require "db/db.php"; 

    // API rész – csak ha az URL-ben ?api=true
    if (isset($_GET['api']) && $_GET['api'] === 'true') {

        // Paraméterek lekérése az URL-ből
        $query    = $_GET['q'] ?? '';        // Keresési kifejezés
        $category = $_GET['category'] ?? ''; // Kategória szűrés
        $sortKey  = $_GET['sort'] ?? 'title_asc'; // Rendezési kulcs
        $inStock  = $_GET['inStock'] ?? '0'; // Készlet szűrés

        // Rendezés whitelist – csak biztonságos mezők és irányok
        $sortMap = [
            'title_asc'   => 'title ASC',
            'title_desc'  => 'title DESC',
            'author_asc'  => 'author ASC',
            'author_desc' => 'author DESC',
            'created_desc'=> 'created_at DESC',
            'created_asc' => 'created_at ASC',
        ];
        $orderBy = $sortMap[$sortKey] ?? $sortMap['title_asc'];

        // Alap SQL lekérdezés
        $sql = "SELECT id, title, author, summary, cover, category";

        // Ha van 'stock' oszlop, akkor azt is lekérjük
        if (columnExists($conn, 'books', 'stock')) {
            $sql .= ", stock";
        }

        $sql .= " FROM books WHERE 1=1"; // 1=1 azért, hogy könnyen lehessen hozzáfűzni az AND feltételeket

        $params = []; // Bind paraméterek tömbje
        $types  = ""; // Paraméter típusok (s = string, i = integer)

        // Keresés címre vagy szerzőre
        if (!empty($query)) {
            $sql   .= " AND (title LIKE ? OR author LIKE ?)";
            $types .= "ss"; // két string paraméter
            $like   = "%".$query."%";
            $params[] = &$like;
            $params[] = &$like;

            // Relevancia szerinti sorrend: előbb, ha a keresett szó elején van
            $orderByRelevance = " ORDER BY (title LIKE ?) DESC, (author LIKE ?) DESC, $orderBy";
            $types .= "ss";
            $startLike = $query."%";
            $params[] = &$startLike;
            $params[] = &$startLike;
        } else {
            $orderByRelevance = " ORDER BY $orderBy";
        }

        // Kategória szűrés
        if (!empty($category)) {
            $sql   .= " AND category = ?";
            $types .= "s";
            $params[] = &$category;
        }

        // Készlet szűrés, ha van 'stock' oszlop és inStock=1
        if ($inStock === '1' && columnExists($conn, 'books', 'stock')) {
            $sql .= " AND stock > 0";
        }

        $sql .= $orderByRelevance; // Rendezési feltétel hozzáadása

        // Előkészített SQL statement
        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            echo json_encode(['success' => false, 'message' => 'Lekérdezés előkészítése sikertelen']);
            exit;
        }

        // Paraméterek kötése a statement-hez
        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }

        // Lekérdezés végrehajtása
        $stmt->execute();
        $result = $stmt->get_result();

        // Eredmény feldolgozása
        $books = [];
        while ($row = $result->fetch_assoc()) {
            $books[] = [
                'id'       => $row['id'],
                'title'    => $row['title'],
                'author'   => $row['author'],
                'summary'  => $row['summary'],
                'cover'    => $row['cover'],
                'category' => $row['category'],
                'stock'    => isset($row['stock']) ? (int)$row['stock'] : null, // Ha van stock, int-re konvertáljuk
            ];
        }

        // Válasz JSON formátumban
        echo json_encode(['success' => true, 'books' => $books, 'count' => count($books)]);
        exit;
    }

    // Ha nem API hívás, hibát adunk vissza
    echo json_encode(['success' => false, 'message' => 'Helytelen API hívás']);
    exit;

    // Segédfüggvény: ellenőrzi, hogy létezik-e adott oszlop egy táblában
    function columnExists(mysqli $conn, string $table, string $column): bool {
        $res = $conn->query("SHOW COLUMNS FROM `$table` LIKE '$column'");
        return $res && $res->num_rows > 0;
    }
