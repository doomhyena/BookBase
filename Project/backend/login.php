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
        
        if($_SERVER['REQUEST_METHOD'] === 'POST') {
            $input = json_decode(file_get_contents('php://input'), true);
            $email = $input['email'] ?? '';
            $jelszo = $input['password'] ?? '';

            if(!$email || !$jelszo){
                echo json_encode(['success' => false, 'message' => 'Hiányzó adatok!']);
                exit;
            }

            // Felhasználó keresése email alapján
            $sql = "SELECT * FROM users WHERE email='$email'";
            $talalt_felhasznalo = $conn->query($sql);

            if(mysqli_num_rows($talalt_felhasznalo) > 0){
                $felhasznalo = $talalt_felhasznalo->fetch_assoc();
                
                if(password_verify($jelszo, $felhasznalo['password'])){
                    // Sikeres bejelentkezés
                    setcookie("id", $felhasznalo['id'], time() + 3600, "/");
                    echo json_encode([
                        'success' => true, 
                        'message' => 'Sikeres bejelentkezés!',
                        'user' => [
                            'id' => $felhasznalo['id'],
                            'username' => $felhasznalo['username'],
                            'email' => $felhasznalo['email'],
                            'firstname' => $felhasznalo['firstname'],
                            'lastname' => $felhasznalo['lastname'],
                            'admin' => $felhasznalo['admin']
                        ]
                    ]);
                } else {
                    echo json_encode(['success' => false, 'message' => 'Hibás jelszó!']);
                }
            } else {
                echo json_encode(['success' => false, 'message' => 'Nincs ilyen felhasználó!']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Csak POST kérés engedélyezett!']);
        }
        exit;
    }
    
    // HTML form feldolgozás (eredeti funkció)
    if(isset($_POST['email']) && isset($_POST['password'])){
        $email = $_POST['email'];
        $jelszo = $_POST['password'];
        
        if(!$email || !$jelszo){
            echo "<script>alert('Hiányzó adatok!');</script>";
        } else {
            // Felhasználó keresése email alapján
            $sql = "SELECT * FROM users WHERE email='$email'";
            $talalt_felhasznalo = $conn->query($sql);
            
            if(mysqli_num_rows($talalt_felhasznalo) > 0){
                $felhasznalo = $talalt_felhasznalo->fetch_assoc();
                
                if(password_verify($jelszo, $felhasznalo['password'])){
                    // Sikeres bejelentkezés
                    setcookie("id", $felhasznalo['id'], time() + 3600, "/");
                    echo "<script>alert('Sikeres bejelentkezés!'); window.location.href='index.php';</script>";
                } else {
                    echo "<script>alert('Hibás jelszó!');</script>";
                }
            } else {
                echo "<script>alert('Nincs ilyen felhasználó!');</script>";
            }
        }
    }
?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bejelentkezés - BookBase</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 min-h-screen">
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8">
            <h1 class="text-3xl font-bold text-center text-blue-700 mb-8">Bejelentkezés</h1>
            
            <form method="POST" class="space-y-6">
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Email cím</label>
                    <input type="email" name="email" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <div>
                    <label class="block text-gray-700 text-sm font-bold mb-2">Jelszó</label>
                    <input type="password" name="password" required 
                           class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                
                <button type="submit" 
                        class="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                    Bejelentkezés
                </button>
            </form>
            
            <div class="mt-6 text-center">
                <a href="reg.php" class="text-blue-600 hover:underline">Nincs még fiókod? Regisztrálj!</a>
            </div>
            
            <div class="mt-4 text-center">
                <a href="index.php" class="text-gray-600 hover:underline">← Vissza a főoldalra</a>
            </div>
        </div>
    </div>
</body>
</html>