<?php
    // CORS beállítások – mindig az elején, mielőtt bármi más történik
    header_remove(); // Törli az előző HTTP header-eket
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend oldal engedélyezett
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett HTTP header-ek
    header('Content-Type: application/json'); // Minden válasz JSON formátumban lesz

    // Preflight (OPTIONS) kérés kezelése – fontos CORS-hoz
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204); // Nincs tartalom válasz
        exit; // Kilépünk, ne fusson tovább a kód
    }

    // Adatbázis kapcsolat betöltése
    require "db/db.php";

    // API rész – csak akkor fut, ha az 'api' paraméter true
    if (isset($_GET['api']) && $_GET['api'] === 'true') {

        // POST metódus ellenőrzése – csak POST-tal lehet bejelentkezni
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // A frontend által küldött JSON adat dekódolása
            $input = json_decode(file_get_contents('php://input'), true);
            $username = $input['username'] ?? ''; // Felhasználónév
            $jelszo = $input['password'] ?? ''; // Jelszó

            // Ellenőrizzük, hogy mindkét mező ki van-e töltve
            if (!$username || !$jelszo) {
                echo json_encode(['success' => false, 'message' => 'Hiányzó adatok!']);
                exit;
            }

            // Felhasználó keresése az adatbázisban
            $sql = "SELECT * FROM users WHERE username='$username'";
            $talalt_felhasznalo = $conn->query($sql);

            // Ellenőrzés, hogy van-e ilyen felhasználó
            if ($talalt_felhasznalo && mysqli_num_rows($talalt_felhasznalo) > 0) {
                $felhasznalo = $talalt_felhasznalo->fetch_assoc(); // Adatok lekérése asszociatív tömbként

                // Jelszó ellenőrzése a password_verify() segítségével
                if (password_verify($jelszo, $felhasznalo['password'])) {
                    // Sikeres bejelentkezés – cookie beállítása
                    setcookie("id", $felhasznalo['id'], time() + 3600, "/"); // 1 óra érvényesség

                    // Visszaküldjük a felhasználó adatait JSON formátumban
                    echo json_encode([
                        'success' => true,
                        'message' => 'Sikeres bejelentkezés!',
                        'user' => [
                            'id' => $felhasznalo['id'],
                            'username' => $felhasznalo['username'],
                            'email' => $felhasznalo['email'],
                            'admin' => $felhasznalo['admin'] ?? 0 // Admin jogok, ha létezik
                        ]
                    ]);
                } else {
                    // Hibás jelszó esetén
                    echo json_encode(['success' => false, 'message' => 'Hibás jelszó!']);
                }
            } else {
                // Nincs ilyen felhasználó
                echo json_encode(['success' => false, 'message' => 'Nincs ilyen felhasználó!']);
            }

            exit; // Kilépünk az API feldolgozásból
        } else {
            // Ha nem POST metódus érkezik, hibát küldünk
            echo json_encode(['success' => false, 'message' => 'Csak POST kérés engedélyezett!']);
            exit;
        }
    }
