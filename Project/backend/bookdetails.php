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
    
    // HTML oldal (eredeti funkció)
    if(!isset($_GET['id']) || empty($_GET['id'])){
        echo "<script>alert('Hiányzó könyv azonosító!'); window.location.href='index.php';</script>";
        exit;
    }
    
    $konyv_id = intval($_GET['id']);
    $sql = "SELECT * FROM books WHERE id = $konyv_id";
    $eredmeny = $conn->query($sql);
    
    if(!$eredmeny || $eredmeny->num_rows == 0){
        echo "<script>alert('A könyv nem található!'); window.location.href='index.php';</script>";
        exit;
    }
    
    $konyv = $eredmeny->fetch_assoc();
    
    // Értékelések lekérdezése
    $ertekeles_sql = "SELECT AVG(rating) as atlag_ertekeles, COUNT(*) as ertekelesek_szama FROM ratings WHERE book_id = $konyv_id";
    $ertekeles_eredmeny = $conn->query($ertekeles_sql);
    $ertekeles_adatok = $ertekeles_eredmeny->fetch_assoc();
    
    $atlag_ertekeles = $ertekeles_adatok['atlag_ertekeles'] ? round($ertekeles_adatok['atlag_ertekeles'], 1) : 0;
    $ertekelesek_szama = $ertekeles_adatok['ertekelesek_szama'];
    
    // Könyv értékelés kezelése
    if(isset($_POST['rating']) && isset($_COOKIE['id'])){
        $ertekeles = intval($_POST['rating']);
        $felhasznalo_id = intval($_COOKIE['id']);
        
        if($ertekeles >= 1 && $ertekeles <= 5){
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
            
            echo "<script>alert('Értékelés sikeresen mentve!'); location.reload();</script>";
        }
    }