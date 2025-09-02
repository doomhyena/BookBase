
<?php
header_remove();
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Credentials: true');
header('Content-Type: application/json');
require "db/db.php";

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT id, title, author, summary, cover, category FROM books ORDER BY id DESC";
    $result = $conn->query($sql);
    $books = [];
    while ($row = $result->fetch_assoc()) {
        $books[] = $row;
    }
    echo json_encode(['success' => true, 'books' => $books]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (!isset($_COOKIE['id'])) {
        echo json_encode(['success' => false, 'message' => 'Nincs bejelentkezve!']);
        exit;
    }
    $felhasznalo_id = $_COOKIE['id'];
    $admin_ellenorzes_sql = "SELECT admin FROM users WHERE id = $felhasznalo_id";
    $admin_ellenorzes_eredmeny = $conn->query($admin_ellenorzes_sql);
    if ($admin_ellenorzes_eredmeny->num_rows == 0 || $admin_ellenorzes_eredmeny->fetch_assoc()['admin'] != 1) {
        echo json_encode(['success' => false, 'message' => 'Nincs admin jogosultság!']);
        exit;
    }
    $id = $_POST['id'] ?? '';
    $title = $_POST['title'] ?? '';
    $author = $_POST['author'] ?? '';
    $summary = $_POST['summary'] ?? '';
    $category = $_POST['category'] ?? '';
    $cover = '';
    if (isset($_FILES['cover']) && $_FILES['cover']['error'] == 0) {
        $engedelyezett_tipusok = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        $fajl_tipus = $_FILES['cover']['type'];
        if (in_array($fajl_tipus, $engedelyezett_tipusok)) {
            $fajl_nev = time() . '_' . $_FILES['cover']['name'];
            $cel_utvonal = 'uploads/' . $fajl_nev;
            if (!is_dir('uploads')) {
                mkdir('uploads', 0777, true);
            }
            if (move_uploaded_file($_FILES['cover']['tmp_name'], $cel_utvonal)) {
                $cover = 'uploads/' . $fajl_nev;
            }
        }
    }
    if (!$title || !$author || !$summary || !$category) {
        echo json_encode(['success' => false, 'message' => 'Hiányzó adatok!']);
        exit;
    }
    if ($id) {
        $sql = "UPDATE books SET title='$title', author='$author', summary='$summary', category='$category'";
        if ($cover) {
            $sql .= ", cover='$cover'";
        }
        $sql .= " WHERE id=$id";
        if ($conn->query($sql)) {
            echo json_encode(['success' => true, 'message' => 'Könyv sikeresen frissítve!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Hiba történt a könyv frissítésekor!']);
        }
    } else {
        // Új könyv
        $beszuras_sql = "INSERT INTO books (title, author, summary, cover, category, created_at) VALUES ('$title', '$author', '$summary', '$cover', '$category', NOW())";
        if ($conn->query($beszuras_sql)) {
            echo json_encode(['success' => true, 'message' => 'Könyv sikeresen hozzáadva!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Hiba történt a könyv hozzáadásakor!']);
        }
    }
    exit;
}

echo json_encode(['success' => false, 'message' => 'Nem támogatott metódus!']);
exit;
