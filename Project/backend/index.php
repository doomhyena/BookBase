<?php
    // CORS beállítások - mindig az elején, mielőtt bármi más történik
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');

    require "db/db.php";
    
    // Ellenőrizzük, hogy API kérés-e
    if(isset($_GET['api']) && $_GET['api'] === 'true') {
        header('Content-Type: application/json');
        $action = $_GET['action'] ?? '';
        
        if($action === 'getNew'){
            $limit = $_GET['limit'] ?? 5;
            $sql = "SELECT * FROM books ORDER BY created_at DESC LIMIT $limit";
            $eredmeny = $conn->query($sql);
            
            $konyvek = [];
            if ($eredmeny && $eredmeny->num_rows > 0) {
                while ($konyv = $eredmeny->fetch_assoc()) {
                    $konyvek[] = [
                        'id' => $konyv['id'],
                        'title' => $konyv['title'],
                        'author' => $konyv['author'],
                        'summary' => $konyv['summary'],
                        'cover' => $konyv['cover']
                    ];
                }
            }
            
            echo json_encode(['success' => true, 'books' => $konyvek]);
            exit;
        }
        
        if($action === 'getTop20'){
            $sql = "SELECT b.*, AVG(r.rating) as atlag_ertekeles, COUNT(r.rating) as ertekelesek_szama 
                    FROM books b 
                    LEFT JOIN ratings r ON b.id = r.book_id 
                    GROUP BY b.id 
                    HAVING ertekelesek_szama > 0 
                    ORDER BY atlag_ertekeles DESC, ertekelesek_szama DESC 
                    LIMIT 20";
            $eredmeny = $conn->query($sql);
            
            $konyvek = [];
            if ($eredmeny && $eredmeny->num_rows > 0) {
                while ($konyv = $eredmeny->fetch_assoc()) {
                    $konyvek[] = [
                        'id' => $konyv['id'],
                        'title' => $konyv['title'],
                        'author' => $konyv['author'],
                        'summary' => $konyv['summary'],
                        'cover' => $konyv['cover'],
                        'atlag_ertekeles' => round($konyv['atlag_ertekeles'], 1),
                        'ertekelesek_szama' => $konyv['ertekelesek_szama']
                    ];
                }
            }
            
            echo json_encode(['success' => true, 'books' => $konyvek]);
        }
        
        if($action === 'getRandom'){
            $limit = $_GET['limit'] ?? 5;
            $sql = "SELECT * FROM books ORDER BY RAND() LIMIT $limit";
            $eredmeny = $conn->query($sql);
            
            $konyvek = [];
            if ($eredmeny && $eredmeny->num_rows > 0) {
                while ($konyv = $eredmeny->fetch_assoc()) {
                    $konyvek[] = [
                        'id' => $konyv['id'],
                        'title' => $konyv['title'],
                        'author' => $konyv['author'],
                        'summary' => $konyv['summary'],
                        'cover' => $konyv['cover']
                    ];
                }
            }
            
            echo json_encode(['success' => true, 'books' => $konyvek]);
        }
        
        if($action === 'getAll'){
            $sql = "SELECT * FROM books ORDER BY id DESC";
            $eredmeny = $conn->query($sql);
            
            $konyvek = [];
            if ($eredmeny && $eredmeny->num_rows > 0) {
                while ($konyv = $eredmeny->fetch_assoc()) {
                    $konyvek[] = [
                        'id' => $konyv['id'],
                        'title' => $konyv['title'],
                        'author' => $konyv['author'],
                        'summary' => $konyv['summary'],
                        'cover' => $konyv['cover']
                    ];
                }
            }
            
            echo json_encode(['success' => true, 'books' => $konyvek]);
            exit;
        }
        
        if($action === 'getById'){
            $id = $_GET['id'] ?? 0;
            
            if(!$id || !is_numeric($id)){
                echo json_encode(['success' => false, 'message' => 'Érvénytelen könyv azonosító!']);
                exit;
            }
            
            $sql = "SELECT * FROM books WHERE id = $id";
            $eredmeny = $conn->query($sql);
            
            if($eredmeny && $eredmeny->num_rows > 0){
                $konyv = $eredmeny->fetch_assoc();
                
                // Értékelések lekérdezése
                $ertekeles_sql = "SELECT AVG(rating) as atlag_ertekeles, COUNT(*) as ertekelesek_szama FROM ratings WHERE book_id = $id";
                $ertekeles_eredmeny = $conn->query($ertekeles_sql);
                $ertekeles_adatok = $ertekeles_eredmeny->fetch_assoc();
                
                $konyv['atlag_ertekeles'] = round($ertekeles_adatok['atlag_ertekeles'], 1);
                $konyv['ertekelesek_szama'] = $ertekeles_adatok['ertekelesek_szama'];
                
                echo json_encode(['success' => true, 'book' => $konyv]);
            } else {
                echo json_encode(['success' => false, 'message' => 'A könyv nem található!']);
            }
            exit;
        }
        
        if($action === 'search'){
            $query = $_GET['q'] ?? '';
            
            if(empty($query)){
                echo json_encode(['success' => false, 'message' => 'Keresési kifejezés megadása kötelező!']);
                exit;
            }
            
            $sql = "SELECT * FROM books WHERE title LIKE '%$query%' OR author LIKE '%$query%' ORDER BY title";
            $eredmeny = $conn->query($sql);
            
            $konyvek = [];
            if ($eredmeny && $eredmeny->num_rows > 0) {
                while ($konyv = $eredmeny->fetch_assoc()) {
                    $konyvek[] = [
                        'id' => $konyv['id'],
                        'title' => $konyv['title'],
                        'author' => $konyv['author'],
                        'summary' => $konyv['summary'],
                        'cover' => $konyv['cover']
                    ];
                }
            }
            
            echo json_encode(['success' => true, 'books' => $konyvek, 'count' => count($konyvek)]);
            exit;
        }
        
        echo json_encode(['success' => false, 'message' => 'Érvénytelen művelet!']);
        exit;
    }
    
    // HTML oldal (eredeti funkció)
    // Könyv értékelés kezelése
    if(isset($_POST['rating']) && isset($_POST['book_id']) && isset($_COOKIE['id'])){
        $ertekeles = $_POST['rating'];
        $konyv_id = $_POST['book_id'];
        $felhasznalo_id = $_COOKIE['id'];
        
        // Ellenőrizzük, hogy már értékelt-e
        $ellenorzes_sql = "SELECT id FROM ratings WHERE book_id = $konyv_id AND user_id = $felhasznalo_id";
        $ellenorzes_eredmeny = $conn->query($ellenorzes_sql);
        
        if($ellenorzes_eredmeny->num_rows > 0){
            // Frissítjük a meglévő értékelést
            $frissites_sql = "UPDATE ratings SET rating = $ertekeles WHERE book_id = $konyv_id AND user_id = $felhasznalo_id";
            $conn->query($frissites_sql);
        } else {
            // Új értékelést adunk hozzá
            $beszuras_sql = "INSERT INTO ratings (book_id, user_id, rating) VALUES ($konyv_id, $felhasznalo_id, $ertekeles)";
            $conn->query($beszuras_sql);
        }
        
        echo "<script>alert('Értékelés sikeresen mentve!');</script>";
    }
    
    // Legutóbb hozzáadott könyvek lekérdezése
    $uj_konyvek_sql = "SELECT * FROM books ORDER BY created_at DESC LIMIT 5";
    $uj_konyvek_eredmeny = $conn->query($uj_konyvek_sql);