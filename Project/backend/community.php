<?php
    // CORS beállítások - mindig az elején, mielőtt bármi más történik
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');

    // Feltételezzük, hogy a db.php tartalmazza a $conn változót, ami az adatbázis kapcsolatot
    require  "db/db.php";

    if(!isset($_COOKIE['id'])){ // Ellenőrzi, hogy létezik-e 'id' nevű süti (cookie)
        header("Location: index.php"); // Ha nincs, átirányítja a felhasználót a főoldalra
    }

    // Közösségi funkciók: felhasználók listázása
    $sql = "SELECT id, username, bio, profile_picture, is_active, registration_date FROM users WHERE is_active = 1 ORDER BY registration_date DESC LIMIT 20";
    $result = $conn->query($sql);

    $users = [];
    if ($result && $result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $users[] = [
                'id' => $row['id'],
                'username' => $row['username'],
                'bio' => $row['bio'] ?? '',
                'avatar' => $row['profile_picture'] ?? '',
                'status' => $row['is_active'] ? 'online' : 'offline',
                'joined' => $row['registration_date']
            ];
        }
        echo json_encode(["success" => true, "users" => $users]);
    } else {
        echo json_encode([
            "success" => false,
            "message" => "Nincs elérhető felhasználó."
        ]);
    }
