<?php
    // CORS beállítások – mindig az elején, hogy a frontend böngészője engedélyezze az API hívásokat
    header_remove(); // Törli az előző HTTP header-eket
    header('Access-Control-Allow-Origin: http://localhost:3000'); // Csak a frontend oldalról érkező kéréseket engedélyezzük
    header('Access-Control-Allow-Credentials: true'); // Szükséges a cookie-k küldéséhez
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS'); // Engedélyezett HTTP metódusok
    header('Access-Control-Allow-Headers: Content-Type'); // Engedélyezett header-ek
    header('Content-Type: application/json'); // Minden válasz JSON formátumban lesz

    // Preflight (OPTIONS) kérés kezelése – CORS miatt a böngésző először OPTIONS kérést küld
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204); // No Content, nincs válasz tartalom
        exit;
    }

    // Adatbázis kapcsolat betöltése (db.php tartalmazza a $conn változót)
    require "db/db.php";

    // ---- API rész ----
    if (isset($_GET['api']) && $_GET['api'] === 'true') {

        // POST metódus – új felhasználó regisztráció
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true); // JSON bemenet dekódolása
            $felhasznalonev = $input['username'] ?? ''; // Felhasználónév
            $email = $input['email'] ?? ''; // Email
            $jelszo = $input['password'] ?? ''; // Jelszó

            // Ellenőrizzük, hogy minden mező ki van-e töltve
            if (!$felhasznalonev || !$email || !$jelszo) {
                echo json_encode(['success' => false, 'message' => 'Hiányzó adatok!']);
                exit;
            }

            // Felhasználónév ellenőrzése az adatbázisban
            $sql = "SELECT * FROM users WHERE username='$felhasznalonev'";
            $talalt_felhasznalo = $conn->query($sql);
            if (mysqli_num_rows($talalt_felhasznalo) > 0) {
                echo json_encode(['success' => false, 'message' => 'Már létezik ilyen felhasználónév!']);
                exit;
            }

            // Email ellenőrzése az adatbázisban
            $sql = "SELECT * FROM users WHERE email='$email'";
            $talalt_email = $conn->query($sql);
            if (mysqli_num_rows($talalt_email) > 0) {
                echo json_encode(['success' => false, 'message' => 'Már létezik ilyen email cím!']);
                exit;
            }

            // Jelszó titkosítása a biztonság érdekében
            $titkositott_jelszo = password_hash($jelszo, PASSWORD_DEFAULT);
            $regisztracio_datuma = date('Y-m-d H:i:s'); // Regisztráció ideje

            // Új felhasználó beszúrása az adatbázisba
            $sql = "INSERT INTO users (username, email, password, created_at) 
                    VALUES ('$felhasznalonev','$email', '$titkositott_jelszo', '$regisztracio_datuma')";

            if ($conn->query($sql)) {
                // Felhasználóhoz mappa létrehozása (ha még nem létezik)
                $mappa = getcwd();
                $utvonal = $mappa . DIRECTORY_SEPARATOR . "users" . DIRECTORY_SEPARATOR . $felhasznalonev;
                if (!is_dir($utvonal)) mkdir($utvonal, 0777, true);

                // Sikeres regisztráció visszajelzése JSON-ban
                echo json_encode(['success' => true, 'message' => 'Sikeres regisztráció!']);
            } else {
                // Hiba esetén
                echo json_encode(['success' => false, 'message' => 'Hiba történt a regisztráció során!']);
            }

        } 
        // GET metódus – felhasználók listázása
        elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $users = [];
            $result = $conn->query("SELECT username, email, registration_date FROM users");
            while($row = $result->fetch_assoc()) {
                $users[] = $row; // Minden felhasználó adata hozzáadása a tömbhöz
            }
            echo json_encode(['success' => true, 'users' => $users]);
        } else {
            // Ha más metódus jön, figyelmeztetünk
            echo json_encode(['success' => false, 'message' => 'Csak GET és POST kérések engedélyezettek!']);
        }
        exit;
    }

    // ---- HTML form fallback ----
    // Ha valaki hagyományos HTML űrlapon keresztül küldi az adatokat
    if (isset($_POST['username']) && isset($_POST['email']) && isset($_POST['password'])) {
        $felhasznalonev = $_POST['username'];
        $email = $_POST['email'];
        $jelszo = $_POST['password'];

        // Hiányzó adatok ellenőrzése
        if (!$felhasznalonev || !$email || !$jelszo) {
            echo "<script>alert('Hiányzó adatok!');</script>";
        } else {
            // Felhasználónév ellenőrzése
            $sql = "SELECT * FROM users WHERE username='$felhasznalonev'";
            $talalt_felhasznalo = $conn->query($sql);
            if (mysqli_num_rows($talalt_felhasznalo) > 0) {
                echo "<script>alert('Már létezik ilyen felhasználónév!');</script>";
            } else {
                // Email ellenőrzése
                $sql = "SELECT * FROM users WHERE email='$email'";
                $talalt_email = $conn->query($sql);
                if (mysqli_num_rows($talalt_email) > 0) {
                    echo "<script>alert('Már létezik ilyen email cím!');</script>";
                } else {
                    // Jelszó titkosítása és új felhasználó létrehozása
                    $titkositott_jelszo = password_hash($jelszo, PASSWORD_DEFAULT);
                    $regisztracio_datuma = date('Y-m-d H:i:s');
                    $sql = "INSERT INTO users (username, email, password, registration_date) 
                            VALUES ('$felhasznalonev', '$email', '$titkositott_jelszo', '$regisztracio_datuma')";
                    if ($conn->query($sql)) {
                        // Felhasználóhoz mappa létrehozása
                        $mappa = getcwd();
                        $utvonal = $mappa . DIRECTORY_SEPARATOR . "users" . DIRECTORY_SEPARATOR . $felhasznalonev;
                        if (!is_dir($utvonal)) mkdir($utvonal, 0777, true);

                        // Sikeres regisztráció, átirányítás a bejelentkezésre
                        echo "<script>alert('Sikeres regisztráció!'); window.location.href='login.php';</script>";
                    } else {
                        // Hiba esetén
                        echo "<script>alert('Hiba történt a regisztráció során!');</script>";
                    }
                }
            }
        }
    }
