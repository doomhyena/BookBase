<?php
    // CORS beállítások – engedélyezzük a frontend API hívásokat
    header_remove(); // Törli az összes előző HTTP header-t
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend oldalról érkező kéréseket engedélyezzük
    header('Access-Control-Allow-Credentials: true'); // Engedélyezi a cookie-k küldését a kérés során
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // Válasz formátuma JSON

    // Preflight (OPTIONS) kérés kezelése
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204); // Nincs tartalom, csak engedélyezés
        exit;
    }

    // 🔹 Adatbázis kapcsolat betöltése
    require "db/db.php";

    // 🔹 Függvény a profilkép URL összeállításához
    function addProfilePictureUrl($user) {
        if (!empty($user['username']) && !empty($user['profile_picture'])) {
            $user['profile_picture_url'] =
                "http://localhost/BookBase-Dev/Project/backend/users/" .
                $user['username'] . "/" . $user['profile_picture'];
        } else {
            $user['profile_picture_url'] = null;
        }
        return $user;
    }

    // API műveletek
    $action = $_GET['action'] ?? '';

    switch ($action) {

        // ---- FELHASZNÁLÓ LEKÉRDEZÉSE COOKIE ALAPJÁN ----
        case 'getCurrentUser':
            if (isset($_COOKIE['id']) && $_COOKIE['id']) {
                $userId = intval($_COOKIE['id']);
                $sql = "SELECT id, username, email, profile_picture, admin FROM users WHERE id = $userId LIMIT 1";
                $res = $conn->query($sql);
                if ($res && $res->num_rows > 0) {
                    $user = $res->fetch_assoc();
                    $user = addProfilePictureUrl($user); // Profilkép URL hozzáadása
                    echo json_encode(['success' => true, 'user' => $user]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Felhasználó nem található!']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Nincs bejelentkezve']);
            }
            exit;

        // ---- FELHASZNÁLÓ LEKÉRDEZÉSE ID ALAPJÁN ----
        case 'getById':
            $id = intval($_GET['id'] ?? 0);
            if (!$id) {
                echo json_encode(['success' => false, 'message' => 'Érvénytelen felhasználói azonosító!']);
                exit;
            }

            $sql = "SELECT id, username, email, birthdate, gender, profile_picture, custom_css FROM users WHERE id = $id";
            $res = $conn->query($sql);
            if ($res && $res->num_rows > 0) {
                $user = $res->fetch_assoc();
                $user = addProfilePictureUrl($user);

                // Legutóbb olvasott könyvek
                $historySql = "SELECT b.*, rh.status, rh.created_at FROM reading_history rh 
                            JOIN books b ON rh.book_id = b.id 
                            WHERE rh.user_id = $id 
                            ORDER BY rh.created_at DESC LIMIT 5";
                $historyRes = $conn->query($historySql);
                $recentlyRead = [];
                if ($historyRes && $historyRes->num_rows > 0) {
                    while ($book = $historyRes->fetch_assoc()) {
                        $recentlyRead[] = [
                            'id' => $book['id'],
                            'title' => $book['title'],
                            'author' => $book['author'],
                            'cover' => $book['cover'],
                            'status' => $book['status'],
                            'read_date' => $book['created_at']
                        ];
                    }
                }

                // Kedvencek lekérése
                $favSql = "SELECT b.* FROM favorites f 
                        JOIN books b ON f.book_id = b.id 
                        WHERE f.user_id = $id 
                        ORDER BY f.created_at DESC LIMIT 5";
                $favRes = $conn->query($favSql);
                $favorites = [];
                if ($favRes && $favRes->num_rows > 0) {
                    while ($book = $favRes->fetch_assoc()) {
                        $favorites[] = [
                            'id' => $book['id'],
                            'title' => $book['title'],
                            'author' => $book['author'],
                            'cover' => $book['cover']
                        ];
                    }
                }

                $user['recentlyRead'] = $recentlyRead;
                $user['favorites'] = $favorites;

                $isOwner = (isset($_COOKIE['id']) && $_COOKIE['id'] == $user['id']); // Saját profil
                echo json_encode(['success' => true, 'user' => $user, 'owner' => $isOwner]);
            } else {
                echo json_encode(['success' => false, 'message' => 'A felhasználó nem található!']);
            }
            exit;

        // ---- PROFIL FRISSÍTÉSE ----
        case 'updateProfile':
            $userId = $_COOKIE['id'] ?? null;
            if (!$userId) {
                echo json_encode(['success'=>false,'message'=>'Nincs bejelentkezve']);
                exit;
            }

            $email = $_POST['email'] ?? '';
            $birthdate = $_POST['birthdate'] ?? '';
            $gender = $_POST['gender'] ?? '';
            $custom_css = $_POST['custom_css'] ?? null;

            if (!$email || !$birthdate || !$gender) {
                echo json_encode(['success'=>false,'message'=>'Hiányzó adatok!']);
                exit;
            }

            // Email ütközés ellenőrzése
            $res = $conn->query("SELECT id FROM users WHERE email='$email' AND id != $userId");
            if ($res->num_rows > 0) {
                echo json_encode(['success'=>false,'message'=>'Már létezik ilyen email cím!']);
                exit;
            }

            // Profilkép feltöltés
            $profile_picture_name = null;
            if(isset($_FILES['profile_picture']) && $_FILES['profile_picture']['error'] === 0) {
                $userRes = $conn->query("SELECT username, profile_picture FROM users WHERE id=$userId");
                $user = $userRes->fetch_assoc();
                $target_dir = __DIR__ . "/users/" . $user['username'] . "/";
                if(!is_dir($target_dir)) mkdir($target_dir, 0777, true);

                if(!empty($user['profile_picture'])){
                    $oldFile = $target_dir . $user['profile_picture'];
                    if(file_exists($oldFile)) unlink($oldFile);
                }

                $profile_picture_name = basename($_FILES['profile_picture']['name']);
                $target_file = $target_dir . $profile_picture_name;
                if(!move_uploaded_file($_FILES['profile_picture']['tmp_name'], $target_file)){
                    echo json_encode(['success'=>false,'message'=>'Hiba történt a kép feltöltésekor!']);
                    exit;
                }
            }

            // Adatbázis frissítés
            $updateSql = "UPDATE users SET email='$email', birthdate='$birthdate', gender='$gender'";
            if($profile_picture_name) $updateSql .= ", profile_picture='$profile_picture_name'";
            if($custom_css !== null) $updateSql .= ", custom_css='" . $conn->real_escape_string($custom_css) . "'";
            $updateSql .= " WHERE id=$userId";

            if($conn->query($updateSql)){
                $userRes = $conn->query("SELECT id, username, email, birthdate, gender, profile_picture, custom_css FROM users WHERE id=$userId");
                $updatedUser = $userRes->fetch_assoc();
                echo json_encode(['success'=>true,'message'=>'Profil sikeresen frissítve!','user'=>$updatedUser]);
            } else {
                echo json_encode(['success'=>false,'message'=>'Hiba történt a profil frissítésekor!']);
            }
            exit;

        // ---- ÉRVÉNYTELEN MŰVELET ----
        default:
            echo json_encode(['success'=>false,'message'=>'Érvénytelen művelet!']);
            exit;
    }
