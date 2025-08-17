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
        
        if($action === 'getById'){
            $id = $_GET['id'] ?? 0;
            
            if(!$id || !is_numeric($id)){
                echo json_encode(['success' => false, 'message' => 'Érvénytelen felhasználói azonosító!']);
                exit;
            }
            
            $sql = "SELECT id, username, email, firstname, lastname, birthdate, gender, registration_date FROM users WHERE id = $id";
            $eredmeny = $conn->query($sql);
            
            if($eredmeny && $eredmeny->num_rows > 0){
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
        
        if($action === 'update'){
            if(!isset($_COOKIE['id'])){
                echo json_encode(['success' => false, 'message' => 'Nincs bejelentkezve!']);
                exit;
            }
            
            $input = json_decode(file_get_contents('php://input'), true);
            $felhasznalo_id = $_COOKIE['id'];
            
            $vezeteknev = $input['lastname'] ?? '';
            $keresztnev = $input['firstname'] ?? '';
            $email = $input['email'] ?? '';
            $szuletesi_datum = $input['birthdate'] ?? '';
            $nem = $input['gender'] ?? '';
            
            if(!$vezeteknev || !$keresztnev || !$email || !$szuletesi_datum || !$nem){
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
            
            $frissites_sql = "UPDATE users SET lastname='$vezeteknev', firstname='$keresztnev', email='$email', birthdate='$szuletesi_datum', gender='$nem' WHERE id=$felhasznalo_id";
            
            if($conn->query($frissites_sql)){
                echo json_encode(['success' => true, 'message' => 'Profil sikeresen frissítve!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Hiba történt a profil frissítésekor!']);
            }
            exit;
        }
        
        if($action === 'changePassword'){
            if(!isset($_COOKIE['id'])){
                echo json_encode(['success' => false, 'message' => 'Nincs bejelentkezve!']);
                exit;
            }
            
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
    }
    
    // HTML oldal (eredeti funkció)
    if(!isset($_COOKIE['id'])){
        echo "<script>alert('Nincs bejelentkezve!'); window.location.href='login.php';</script>";
        exit;
    }
    
    $felhasznalo_id = $_COOKIE['id'];
    
    // Felhasználó adatainak lekérése
    $sql = "SELECT * FROM users WHERE id = $felhasznalo_id";
    $eredmeny = $conn->query($sql);
    
    if(!$eredmeny || $eredmeny->num_rows == 0){
        echo "<script>alert('Felhasználó nem található!'); window.location.href='login.php';</script>";
        exit;
    }
    
    $felhasznalo = $eredmeny->fetch_assoc();
    
    // Profil frissítés kezelése
    if(isset($_POST['update_profile'])){
        $vezeteknev = $_POST['lastname'];
        $keresztnev = $_POST['firstname'];
        $email = $_POST['email'];
        $szuletesi_datum = $_POST['birthdate'];
        $nem = $_POST['gender'];
        
        if($vezeteknev && $keresztnev && $email && $szuletesi_datum && $nem){
            // Email egyediség ellenőrzése
            $email_ellenorzes_sql = "SELECT id FROM users WHERE email='$email' AND id != $felhasznalo_id";
            $email_ellenorzes_eredmeny = $conn->query($email_ellenorzes_sql);
            
            if($email_ellenorzes_eredmeny->num_rows > 0){
                echo "<script>alert('Már létezik ilyen email cím!');</script>";
            } else {
                $frissites_sql = "UPDATE users SET lastname='$vezeteknev', firstname='$keresztnev', email='$email', birthdate='$szuletesi_datum', gender='$nem' WHERE id=$felhasznalo_id";
                
                if($conn->query($frissites_sql)){
                    echo "<script>alert('Profil sikeresen frissítve!'); location.reload();</script>";
                } else {
                    echo "<script>alert('Hiba történt a profil frissítésekor!');</script>";
                }
            }
        }
    }
    
    // Jelszó változtatás kezelése
    if(isset($_POST['change_password'])){
        $jelenlegi_jelszo = $_POST['current_password'];
        $uj_jelszo = $_POST['new_password'];
        $uj_jelszo_ujra = $_POST['new_password_again'];
        
        if($jelenlegi_jelszo && $uj_jelszo && $uj_jelszo_ujra){
            // Jelenlegi jelszó ellenőrzése
            if(!password_verify($jelenlegi_jelszo, $felhasznalo['password'])){
                echo "<script>alert('A jelenlegi jelszó hibás!');</script>";
            } elseif($uj_jelszo !== $uj_jelszo_ujra){
                echo "<script>alert('Az új jelszavak nem egyeznek!');</script>";
            } elseif(strlen($uj_jelszo) < 6){
                echo "<script>alert('Az új jelszónak legalább 6 karakter hosszúnak kell lennie!');</script>";
            } else {
                $titkositott_uj_jelszo = password_hash($uj_jelszo, PASSWORD_DEFAULT);
                $jelszo_frissites_sql = "UPDATE users SET password='$titkositott_uj_jelszo' WHERE id=$felhasznalo_id";
                
                if($conn->query($jelszo_frissites_sql)){
                    echo "<script>alert('Jelszó sikeresen megváltoztatva!');</script>";
                } else {
                    echo "<script>alert('Hiba történt a jelszó megváltoztatásakor!');</script>";
                }
            }
        }
    }
?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Felhasználói Profil - BookBase</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 min-h-screen">
    <?php include "db/navbar.php"; ?>
    
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl font-bold text-blue-700 text-center mb-8">Felhasználói Profil</h1>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <!-- Profil adatok -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-blue-700 mb-6">Profil Adatok</h2>
                    
                    <form method="POST" class="space-y-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Vezetéknév</label>
                                <input type="text" name="lastname" value="<?php echo htmlspecialchars($felhasznalo['lastname']); ?>" 
                                       required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Keresztnév</label>
                                <input type="text" name="firstname" value="<?php echo htmlspecialchars($felhasznalo['firstname']); ?>" 
                                       required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            </div>
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2">Email cím</label>
                            <input type="email" name="email" value="<?php echo htmlspecialchars($felhasznalo['email']); ?>" 
                                   required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        </div>
                        
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Születési dátum</label>
                                <input type="date" name="birthdate" value="<?php echo $felhasznalo['birthdate']; ?>" 
                                       required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                            </div>
                            <div>
                                <label class="block text-gray-700 text-sm font-bold mb-2">Nem</label>
                                <select name="gender" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                    <option value="ferfi" <?php echo $felhasznalo['gender'] == 'ferfi' ? 'selected' : ''; ?>>Férfi</option>
                                    <option value="no" <?php echo $felhasznalo['gender'] == 'no' ? 'selected' : ''; ?>>Nő</option>
                                    <option value="egyeb" <?php echo $felhasznalo['gender'] == 'egyeb' ? 'selected' : ''; ?>>Egyéb</option>
                                </select>
                            </div>
                        </div>
                        
                        <button type="submit" name="update_profile" 
                                class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                            Profil Frissítése
                        </button>
                    </form>
                </div>
                
                <!-- Jelszó változtatás -->
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-blue-700 mb-6">Jelszó Változtatás</h2>
                    
                    <form method="POST" class="space-y-4">
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2">Jelenlegi jelszó</label>
                            <input type="password" name="current_password" required 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2">Új jelszó</label>
                            <input type="password" name="new_password" required 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        </div>
                        
                        <div>
                            <label class="block text-gray-700 text-sm font-bold mb-2">Új jelszó újra</label>
                            <input type="password" name="new_password_again" required 
                                   class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                        </div>
                        
                        <button type="submit" name="change_password" 
                                class="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                            Jelszó Megváltoztatása
                        </button>
                    </form>
                </div>
            </div>
            
            <div class="mt-8 text-center">
                <a href="index.php" 
                   class="inline-block px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors">
                    ← Vissza a főoldalra
                </a>
            </div>
        </div>
    </div>
</body>
</html>
