<?php
    // Header-ek beállítása a CORS és JSON kezeléshez
    header_remove(); // Törli az összes előzőleg beállított header-t
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend engedélyezett
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Access-Control-Allow-Credentials: true'); // Cookie-kat is engedélyez
    header('Content-Type: application/json'); // Válasz típusa JSON

    require "db/db.php"; // Adatbázis kapcsolat betöltése

    // Preflight kérések (OPTIONS) kezelése a CORS miatt
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(200); // 200 OK visszaadás
        exit; // Kilépés
    }

    // GET kérés: Könyvek lekérése
    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $sql = "SELECT id, title, author, summary, cover, category FROM books ORDER BY id DESC"; // Lekérdezés
        $result = $conn->query($sql); // SQL futtatása
        $books = [];
        while ($row = $result->fetch_assoc()) { // Sorok feldolgozása
            $books[] = $row;
        }
        echo json_encode(['success' => true, 'books' => $books]); // JSON visszaadás
        exit;
    }

    // POST kérés: Könyv hozzáadása vagy frissítése (admin)
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Ellenőrizzük, hogy be van-e jelentkezve a felhasználó
        if (!isset($_COOKIE['id'])) {
            echo json_encode(['success' => false, 'message' => 'Nincs bejelentkezve!']);
            exit;
        }
        $felhasznalo_id = $_COOKIE['id'];

        // Admin jogosultság ellenőrzése
        $admin_ellenorzes_sql = "SELECT admin FROM users WHERE id = $felhasznalo_id";
        $admin_ellenorzes_eredmeny = $conn->query($admin_ellenorzes_sql);
        if ($admin_ellenorzes_eredmeny->num_rows == 0 || $admin_ellenorzes_eredmeny->fetch_assoc()['admin'] != 1) {
            echo json_encode(['success' => false, 'message' => 'Nincs admin jogosultság!']);
            exit;
        }

        // Adatok lekérése a POST-ból
        $id = $_POST['id'] ?? ''; // Ha van id => szerkesztés
        $title = $_POST['title'] ?? '';
        $author = $_POST['author'] ?? '';
        $summary = $_POST['summary'] ?? '';
        $category = $_POST['category'] ?? '';
        $cover = '';

        // Borítókép feltöltés kezelése
        if (isset($_FILES['cover']) && $_FILES['cover']['error'] == 0) {
            $engedelyezett_tipusok = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
            $fajl_tipus = $_FILES['cover']['type'];
            if (in_array($fajl_tipus, $engedelyezett_tipusok)) {
                $fajl_nev = time() . '_' . $_FILES['cover']['name']; // Egyedi név
                $cel_utvonal = 'uploads/' . $fajl_nev;
                if (!is_dir('uploads')) { // Ha nincs mappa
                    mkdir('uploads', 0777, true); // Létrehozzuk
                }
                if (move_uploaded_file($_FILES['cover']['tmp_name'], $cel_utvonal)) {
                    $cover = 'uploads/' . $fajl_nev;
                }
            }
        }

        // Hiányzó adatok ellenőrzése
        if (!$title || !$author || !$summary || !$category) {
            echo json_encode(['success' => false, 'message' => 'Hiányzó adatok!']);
            exit;
        }

        // Könyv frissítése
        if ($id) {
            $sql = "UPDATE books SET title='$title', author='$author', summary='$summary', category='$category'";
            if ($cover) {
                $sql .= ", cover='$cover'"; // Ha új borító
            }
            $sql .= " WHERE id=$id";
            if ($conn->query($sql)) {
                echo json_encode(['success' => true, 'message' => 'Könyv sikeresen frissítve!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Hiba történt a könyv frissítésekor!']);
            }
        } else {
            // Új könyv beszúrása
            $beszuras_sql = "INSERT INTO books (title, author, summary, cover, category, created_at) VALUES ('$title', '$author', '$summary', '$cover', '$category', NOW())";
            if ($conn->query($beszuras_sql)) {
                echo json_encode(['success' => true, 'message' => 'Könyv sikeresen hozzáadva!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Hiba történt a könyv hozzáadásakor!']);
            }
        }
        exit;
    }

    // Ha nem GET és nem POST metódus
    echo json_encode(['success' => false, 'message' => 'Nem támogatott metódus!']);
    exit;
