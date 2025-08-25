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
    if (isset($_GET['action']) && $_GET['action'] === 'getById' && isset($_GET['id'])) {
        $id = intval($_GET['id']);
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'Érvénytelen felhasználói azonosító!']);
            exit;
        }
    $sql = "SELECT id, username, email, birthdate, gender, profile_picture, admin, created_at FROM users WHERE id = $id";
        $eredmeny = $conn->query($sql);
        if ($eredmeny && $eredmeny->num_rows > 0) {
            $felhasznalo = $eredmeny->fetch_assoc();
            
            // Legutóbb olvasott könyvek
            $olvasasi_sql = "SELECT b.*, rh.read_date FROM reading_history rh 
                            JOIN books b ON rh.book_id = b.id 
                            WHERE rh.user_id = $id 
                            ORDER BY rh.read_date DESC 
                            LIMIT 5";
            $olvasasi_eredmeny = $conn->query($olvasasi_sql);
            
            $olvasasi_konyvek = [];
            if ($olvasasi_eredmeny && $olvasasi_eredmeny->num_rows > 0) {
                while ($konyv = $olvasasi_eredmeny->fetch_assoc()) {
                    $olvasasi_konyvek[] = [
                        'id' => $konyv['id'],
                        'title' => $konyv['title'],
                        'author' => $konyv['author'],
                        'cover' => $konyv['cover'],
                        'read_date' => $konyv['read_date']
                    ];
                }
            }
            
            // Kedvenc könyvek
            $kedvencek_sql = "SELECT b.* FROM favorites f 
                              JOIN books b ON f.book_id = b.id 
                              WHERE f.user_id = $id 
                              ORDER BY f.created_at DESC 
                              LIMIT 5";
            $kedvencek_eredmeny = $conn->query($kedvencek_sql);
            
            $kedvencek = [];
            if ($kedvencek_eredmeny && $kedvencek_eredmeny->num_rows > 0) {
                while ($konyv = $kedvencek_eredmeny->fetch_assoc()) {
                    $kedvencek[] = [
                        'id' => $konyv['id'],
                        'title' => $konyv['title'],
                        'author' => $konyv['author'],
                        'cover' => $konyv['cover']
                    ];
                }
            }
            
            $felhasznalo['recentlyRead'] = $olvasasi_konyvek;
            $felhasznalo['favorites'] = $kedvencek;
            
            echo json_encode(['success' => true, 'user' => $felhasznalo]);
        } else {
            echo json_encode(['success' => false, 'message' => 'A felhasználó nem található!']);
        }
        exit;
    }
    
    if (isset($_GET['action']) && $_GET['action'] === 'update') {
        $input = json_decode(file_get_contents('php://input'), true);
        // id-t elfogadjuk cookie-ból, POST body-ból vagy query-ből
        $felhasznalo_id = $_COOKIE['id'] ?? ($input['id'] ?? ($_GET['id'] ?? null));

        $email = $input['email'] ?? '';
        $szuletesi_datum = $input['birthdate'] ?? '';
        $nem = $input['gender'] ?? '';

        if(!$felhasznalo_id || !$email || !$szuletesi_datum || !$nem){
            echo json_encode(['success' => false, 'message' => 'Hiányzó adatok!']);
            exit;
        }

        // Email egyediség ellenőrzése (kivéve a saját email-jét)
        $email_ellenorzes_sql = "SELECT id FROM users WHERE email='$email' AND id != $felhasznalo_id";
        $email_ellenorzes_eredmeny = $conn->query($email_ellenorzes_sql);

        if($email_ellenorzes_eredmeny->num_rows > 0){
            echo json_encode(['success' => false, 'message' => 'Már létezik ilyen email cím!']);
            exit;
        }

        $frissites_sql = "UPDATE users SET email='$email', birthdate='$szuletesi_datum', gender='$nem' WHERE id=$felhasznalo_id";

        if($conn->query($frissites_sql)){
            echo json_encode(['success' => true, 'message' => 'Profil sikeresen frissítve!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Hiba történt a profil frissítésekor!']);
        }
        exit;
    }
    
    if (isset($_GET['action']) && $_GET['action'] === 'changePassword' && isset($_COOKIE['id'])) {
        $input = json_decode(file_get_contents('php://input'), true);
        $felhasznalo_id = $_COOKIE['id'];
        
        $jelenlegi_jelszo = $input['current_password'] ?? '';
        $uj_jelszo = $input['new_password'] ?? '';
        $uj_jelszo_ujra = $input['new_password_again'] ?? '';
        
        if(!$jelenlegi_jelszo || !$uj_jelszo || !$uj_jelszo_ujra){
            echo json_encode(['success' => false, 'message' => 'Hiányzó adatok!']);
            exit;
        }
        
        // Jelenlegi jelszó ellenőrzése
        $jelszo_ellenorzes_sql = "SELECT password FROM users WHERE id = $felhasznalo_id";
        $jelszo_ellenorzes_eredmeny = $conn->query($jelszo_ellenorzes_sql);
        
        if($jelszo_ellenorzes_eredmeny->num_rows == 0){
            echo json_encode(['success' => false, 'message' => 'Felhasználó nem található!']);
            exit;
        }
        
        $jelenlegi_hash = $jelszo_ellenorzes_eredmeny->fetch_assoc()['password'];
        
        if(!password_verify($jelenlegi_jelszo, $jelenlegi_hash)){
            echo json_encode(['success' => false, 'message' => 'A jelenlegi jelszó hibás!']);
            exit;
        }
        
        if($uj_jelszo !== $uj_jelszo_ujra){
            echo json_encode(['success' => false, 'message' => 'Az új jelszavak nem egyeznek!']);
            exit;
        }
        
        if(strlen($uj_jelszo) < 6){
            echo json_encode(['success' => false, 'message' => 'Az új jelszónak legalább 6 karakter hosszúnak kell lennie!']);
            exit;
        }
        
        $titkositott_uj_jelszo = password_hash($uj_jelszo, PASSWORD_DEFAULT);
        $jelszo_frissites_sql = "UPDATE users SET password='$titkositott_uj_jelszo' WHERE id=$felhasznalo_id";
        
        if($conn->query($jelszo_frissites_sql)){
            echo json_encode(['success' => true, 'message' => 'Jelszó sikeresen megváltoztatva!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Hiba történt a jelszó megváltoztatásakor!']);
        }
        exit;
    }
    
    echo json_encode(['success' => false, 'message' => 'Érvénytelen művelet!']);
    exit;

