<?php
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

    require "db/db.php";

    if (isset($_GET['api']) && $_GET['api'] === 'true') {
        $query    = $_GET['q'] ?? '';
        $category = $_GET['category'] ?? '';
        $sortKey  = $_GET['sort'] ?? 'title_asc';
        $inStock  = $_GET['inStock'] ?? '0';

        // Rendezés whitelist – ne engedjünk injectiont
        $sortMap = [
            'title_asc'   => 'title ASC',
            'title_desc'  => 'title DESC',
            'author_asc'  => 'author ASC',
            'author_desc' => 'author DESC',
            'created_desc'=> 'created_at DESC',
            'created_asc' => 'created_at ASC',
        ];
        $orderBy = $sortMap[$sortKey] ?? $sortMap['title_asc'];

        $sql = "SELECT id, title, author, summary, cover, category"
            . (columnExists($conn, 'books', 'stock') ? ", stock" : "")
            . " FROM books WHERE 1=1";

        $params = [];
        $types  = "";

        if (!empty($query)) {
            $sql   .= " AND (title LIKE ? OR author LIKE ?)";
            $types .= "ss";
            $like   = "%".$query."%";
            $params[] = &$like;
            $params[] = &$like;
        }

        if (!empty($category)) {
            $sql   .= " AND category = ?";
            $types .= "s";
            $params[] = &$category;
        }

        if ($inStock === '1' && columnExists($conn, 'books', 'stock')) {
            $sql .= " AND stock > 0";
        }

        $sql .= " ORDER BY $orderBy";

        $stmt = $conn->prepare($sql);
        if ($stmt === false) {
            echo json_encode(['success' => false, 'message' => 'Lekérdezés előkészítése sikertelen']);
            exit;
        }

        if (!empty($params)) {
            $stmt->bind_param($types, ...$params);
        }
        $stmt->execute();
        $result = $stmt->get_result();

        $books = [];
        while ($row = $result->fetch_assoc()) {
            $books[] = [
                'id'       => $row['id'],
                'title'    => $row['title'],
                'author'   => $row['author'],
                'summary'  => $row['summary'],
                'cover'    => $row['cover'],
                'category' => $row['category'],
                'stock'    => isset($row['stock']) ? (int)$row['stock'] : null,
            ];
        }

        echo json_encode(['success' => true, 'books' => $books, 'count' => count($books)]);
        exit;
    }

    echo json_encode(['success' => false, 'message' => 'Helytelen API hívás']);
    exit;

    /** Helper: ellenőrzi, hogy létezik-e oszlop */
    function columnExists(mysqli $conn, string $table, string $column): bool {
        $res = $conn->query("SHOW COLUMNS FROM `$table` LIKE '$column'");
        return $res && $res->num_rows > 0;
    }
