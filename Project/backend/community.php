<?php
    // CORS és JSON header-ek – mindig a fájl elején
    header_remove(); // Törli az előző header-eket
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend engedélyezett
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // JSON válasz

    // Adatbázis kapcsolat betöltése
    require "db/db.php"; // Feltételezzük, hogy $conn változót tartalmaz

    // Ellenőrizzük, hogy a felhasználó be van-e jelentkezve cookie alapján
    if(!isset($_COOKIE['id'])){ 
        header("Location: index.php"); // Ha nincs cookie, átirányít a főoldalra
        exit;
    }

    // Lekérdezés: legutóbbi 20 aktív felhasználó
    $sql = "SELECT id, username, bio, profile_picture, is_active, registration_date 
            FROM users 
            WHERE is_active = 1 
            ORDER BY registration_date DESC 
            LIMIT 20";
    $result = $conn->query($sql);

    $users = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $users[] = [
                'id' => $row['id'], // Felhasználó ID
                'username' => $row['username'], // Felhasználónév
                'bio' => $row['bio'] ?? '', // Rövid bemutatkozás, ha van
                'avatar' => $row['profile_picture'] ?? '', // Profilkép, ha van
                'status' => $row['is_active'] ? 'online' : 'offline', // Online státusz
                'joined' => $row['registration_date'] // Regisztráció dátuma
            ];
        }
        // JSON válasz a felhasználókkal
        echo json_encode(["success" => true, "users" => $users]);
    } else {
        // Ha nincs aktív felhasználó
        echo json_encode([
            "success" => false,
            "message" => "Nincs elérhető felhasználó."
        ]);
    }
