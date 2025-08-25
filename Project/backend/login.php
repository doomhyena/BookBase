<?php

    // CORS beállítások - mindig az elején, mielőtt bármi más történik
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

    require "db/db.php";
    
    // ---- API rész ----
    if (isset($_GET['api']) && $_GET['api'] === 'true') {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $username = $input['username'] ?? '';
            $jelszo = $input['password'] ?? '';

            if (!$username || !$jelszo) {
                echo json_encode(['success' => false, 'message' => 'Hiányzó adatok!']);
                exit;
            }

            $sql = "SELECT * FROM users WHERE username='$username'";
            $talalt_felhasznalo = $conn->query($sql);
            if ($talalt_felhasznalo && mysqli_num_rows($talalt_felhasznalo) > 0) {
                $felhasznalo = $talalt_felhasznalo->fetch_assoc();
                if (password_verify($jelszo, $felhasznalo['password'])) {
                    setcookie("id", $felhasznalo['id'], time() + 3600, "/");
                    echo json_encode([
                        'success' => true,
                        'message' => 'Sikeres bejelentkezés!',
                        'user' => [
                            'id' => $felhasznalo['id'],
                            'username' => $felhasznalo['username'],
                            'email' => $felhasznalo['email'],
                            'firstname' => $felhasznalo['firstname'] ?? '',
                            'lastname' => $felhasznalo['lastname'] ?? '',
                            'admin' => $felhasznalo['admin'] ?? 0
                        ]
                    ]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Hibás jelszó!']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Nincs ilyen felhasználó!']);
            }
            exit;
        } else {
            echo json_encode(['success' => false, 'message' => 'Csak POST kérés engedélyezett!']);
            exit;
        }
    }