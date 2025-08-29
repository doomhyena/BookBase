<?php
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    require "db/db.php";

    // --- GET Current User ---
    if (isset($_GET['action']) && $_GET['action'] === 'getCurrentUser') {
        if (isset($_COOKIE['id']) && $_COOKIE['id']) {
            $userId = intval($_COOKIE['id']);
            $sql = "SELECT id, username, email, profile_picture FROM users WHERE id = $userId LIMIT 1";
            $res = $conn->query($sql);
            if ($res && $res->num_rows > 0) {
                $user = $res->fetch_assoc();
                echo json_encode(['success' => true, 'user' => $user]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Felhasználó nem található!']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Nincs bejelentkezve']);
        }
        exit;
    }

    // --- GET User by ID ---
    if (isset($_GET['action']) && $_GET['action'] === 'getById' && isset($_GET['id'])) {
        $id = intval($_GET['id']);
        if (!$id) {
            echo json_encode(['success' => false, 'message' => 'Érvénytelen felhasználói azonosító!']);
            exit;
        }

        $sql = "SELECT id, username, email, birthdate, gender, profile_picture FROM users WHERE id = $id";
        $res = $conn->query($sql);
        if ($res && $res->num_rows > 0) {
            $user = $res->fetch_assoc();

            // Legutóbb olvasott könyvek
            $historySql = "SELECT b.*, rh.read_date FROM reading_history rh 
                        JOIN books b ON rh.book_id = b.id 
                        WHERE rh.user_id = $id 
                        ORDER BY rh.read_date DESC LIMIT 5";
            $historyRes = $conn->query($historySql);
            $recentlyRead = [];
            if ($historyRes && $historyRes->num_rows > 0) {
                while ($book = $historyRes->fetch_assoc()) {
                    $recentlyRead[] = [
                        'id' => $book['id'],
                        'title' => $book['title'],
                        'author' => $book['author'],
                        'cover' => $book['cover'],
                        'read_date' => $book['read_date']
                    ];
                }
            }

            // Kedvencek
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

            echo json_encode(['success' => true, 'user' => $user]);
        } else {
            echo json_encode(['success' => false, 'message' => 'A felhasználó nem található!']);
        }
        exit;
    }

    // --- UPDATE Profile + Profile Picture ---
    if (isset($_GET['action']) && $_GET['action'] === 'updateProfile') {
        $userId = $_COOKIE['id'] ?? null;
        if (!$userId) {
            echo json_encode(['success'=>false,'message'=>'Nincs bejelentkezve']);
            exit;
        }

        $email = $_POST['email'] ?? '';
        $birthdate = $_POST['birthdate'] ?? '';
        $gender = $_POST['gender'] ?? '';

        if (!$email || !$birthdate || !$gender) {
            echo json_encode(['success'=>false,'message'=>'Hiányzó adatok!']);
            exit;
        }

        // Email egyediség
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

            // Régi kép törlése
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
        $updateSql .= " WHERE id=$userId";

        if($conn->query($updateSql)){
            $userRes = $conn->query("SELECT id, username, email, birthdate, gender, profile_picture FROM users WHERE id=$userId");
            $updatedUser = $userRes->fetch_assoc();
            echo json_encode(['success'=>true,'message'=>'Profil sikeresen frissítve!','user'=>$updatedUser]);
        } else {
            echo json_encode(['success'=>false,'message'=>'Hiba történt a profil frissítésekor!']);
        }
        exit;
    }

    // --- CHANGE PASSWORD ---
    if (isset($_GET['action']) && $_GET['action'] === 'changePassword' && isset($_COOKIE['id'])) {
        $userId = $_COOKIE['id'];
        $input = json_decode(file_get_contents('php://input'), true);

        $current_password = $input['current_password'] ?? '';
        $new_password = $input['new_password'] ?? '';
        $new_password_again = $input['new_password_again'] ?? '';

        if(!$current_password || !$new_password || !$new_password_again){
            echo json_encode(['success'=>false,'message'=>'Hiányzó adatok!']);
            exit;
        }

        $res = $conn->query("SELECT password FROM users WHERE id=$userId");
        if($res->num_rows === 0){
            echo json_encode(['success'=>false,'message'=>'Felhasználó nem található!']);
            exit;
        }

        $hash = $res->fetch_assoc()['password'];
        if(!password_verify($current_password, $hash)){
            echo json_encode(['success'=>false,'message'=>'A jelenlegi jelszó hibás!']);
            exit;
        }

        if($new_password !== $new_password_again){
            echo json_encode(['success'=>false,'message'=>'Az új jelszavak nem egyeznek!']);
            exit;
        }

        if(strlen($new_password) < 6){
            echo json_encode(['success'=>false,'message'=>'Az új jelszónak legalább 6 karakter hosszúnak kell lennie!']);
            exit;
        }

        $new_hash = password_hash($new_password, PASSWORD_DEFAULT);
        if($conn->query("UPDATE users SET password='$new_hash' WHERE id=$userId")){
            echo json_encode(['success'=>true,'message'=>'Jelszó sikeresen megváltoztatva!']);
        } else {
            echo json_encode(['success'=>false,'message'=>'Hiba történt a jelszó megváltoztatásakor!']);
        }
        exit;
    }

    echo json_encode(['success'=>false,'message'=>'Érvénytelen művelet!']);
    exit;
