<?php
    // CORS beállítások - mindig az elején, mielőtt bármi más történik
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Content-Type: application/json');

    // Preflight (OPTIONS) kérés kezelése
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        http_response_code(204);
        exit;
    }

    require "db/db.php";

    // ---- API rész ----
    if (isset($_GET['api']) && $_GET['api'] === 'true') {

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $felhasznalonev = $input['username'] ?? '';
            $email = $input['email'] ?? '';
            $jelszo = $input['password'] ?? '';

            if (!$felhasznalonev || !$email || !$jelszo) {
                echo json_encode(['success' => false, 'message' => 'Hiányzó adatok!']);
                exit;
            }

            // Felhasználónév ellenőrzés
            $sql = "SELECT * FROM users WHERE username='$felhasznalonev'";
            $talalt_felhasznalo = $conn->query($sql);
            if (mysqli_num_rows($talalt_felhasznalo) > 0) {
                echo json_encode(['success' => false, 'message' => 'Már létezik ilyen felhasználónév!']);
                exit;
            }

            // Email ellenőrzés
            $sql = "SELECT * FROM users WHERE email='$email'";
            $talalt_email = $conn->query($sql);
            if (mysqli_num_rows($talalt_email) > 0) {
                echo json_encode(['success' => false, 'message' => 'Már létezik ilyen email cím!']);
                exit;
            }

            // Új felhasználó létrehozása
            $titkositott_jelszo = password_hash($jelszo, PASSWORD_DEFAULT);
            $regisztracio_datuma = date('Y-m-d H:i:s');
            $sql = "INSERT INTO users (username, email, password, created_at) 
                    VALUES ('$felhasznalonev','$email', '$titkositott_jelszo', '$regisztracio_datuma')";

            if ($conn->query($sql)) {
                $mappa = getcwd();
                $utvonal = $mappa . DIRECTORY_SEPARATOR . "users" . DIRECTORY_SEPARATOR . $felhasznalonev;
                if (!is_dir($utvonal)) mkdir($utvonal, 0777, true);

                echo json_encode(['success' => true, 'message' => 'Sikeres regisztráció!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Hiba történt a regisztráció során!']);
            }

        } elseif ($_SERVER['REQUEST_METHOD'] === 'GET') {
            // GET esetén visszaadunk valami tesztválaszt vagy listát
            $users = [];
            $result = $conn->query("SELECT username, email, registration_date FROM users");
            while($row = $result->fetch_assoc()) {
                $users[] = $row;
            }
            echo json_encode(['success' => true, 'users' => $users]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Csak GET és POST kérések engedélyezettek!']);
        }
        exit;
    }

    // ---- HTML form fallback ----
    if (isset($_POST['username']) && isset($_POST['email']) && isset($_POST['password'])) {
        $felhasznalonev = $_POST['username'];
        $email = $_POST['email'];
        $jelszo = $_POST['password'];

        if (!$felhasznalonev || !$email || !$jelszo) {
            echo "<script>alert('Hiányzó adatok!');</script>";
        } else {
            $sql = "SELECT * FROM users WHERE username='$felhasznalonev'";
            $talalt_felhasznalo = $conn->query($sql);
            if (mysqli_num_rows($talalt_felhasznalo) > 0) {
                echo "<script>alert('Már létezik ilyen felhasználónév!');</script>";
            } else {
                $sql = "SELECT * FROM users WHERE email='$email'";
                $talalt_email = $conn->query($sql);
                if (mysqli_num_rows($talalt_email) > 0) {
                    echo "<script>alert('Már létezik ilyen email cím!');</script>";
                } else {
                    $titkositott_jelszo = password_hash($jelszo, PASSWORD_DEFAULT);
                    $regisztracio_datuma = date('Y-m-d H:i:s');
                    $sql = "INSERT INTO users (username, email, password, registration_date) 
                            VALUES ('$felhasznalonev', '$email', '$titkositott_jelszo', '$regisztracio_datuma')";
                    if ($conn->query($sql)) {
                        $mappa = getcwd();
                        $utvonal = $mappa . DIRECTORY_SEPARATOR . "users" . DIRECTORY_SEPARATOR . $felhasznalonev;
                        if (!is_dir($utvonal)) mkdir($utvonal, 0777, true);

                        echo "<script>alert('Sikeres regisztráció!'); window.location.href='login.php';</script>";
                    } else {
                        echo "<script>alert('Hiba történt a regisztráció során!');</script>";
                    }
                }
            }
        }
    }
