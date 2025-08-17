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
        
        if($_SERVER['REQUEST_METHOD'] === 'POST'){
            // Admin ellenőrzés
            if(!isset($_COOKIE['id'])){
                echo json_encode(['success' => false, 'message' => 'Nincs bejelentkezve!']);
                exit;
            }

            $felhasznalo_id = $_COOKIE['id'];
            $admin_ellenorzes_sql = "SELECT admin FROM users WHERE id = $felhasznalo_id";
            $admin_ellenorzes_eredmeny = $conn->query($admin_ellenorzes_sql);
            
            if($admin_ellenorzes_eredmeny->num_rows == 0 || $admin_ellenorzes_eredmeny->fetch_assoc()['admin'] != 1){
                echo json_encode(['success' => false, 'message' => 'Nincs admin jogosultság!']);
                exit;
            }

            // Könyv adatok
            $cim = $_POST['title'] ?? '';
            $szerzo = $_POST['author'] ?? '';
            $osszefoglalo = $_POST['description'] ?? '';

            if(!$cim || !$szerzo || !$osszefoglalo){
                echo json_encode(['success' => false, 'message' => 'Hiányzó adatok!']);
                exit;
            }

            // Borítókép kezelése
            $borito_utvonal = '';
            if(isset($_FILES['cover']) && $_FILES['cover']['error'] == 0){
                $engedelyezett_tipusok = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                $fajl_tipus = $_FILES['cover']['type'];
                
                if(in_array($fajl_tipus, $engedelyezett_tipusok)){
                    $fajl_nev = time() . '_' . $_FILES['cover']['name'];
                    $cel_utvonal = 'uploads/' . $fajl_nev;
                    
                    // Uploads mappa létrehozása, ha nem létezik
                    if(!is_dir('uploads')){
                        mkdir('uploads', 0777, true);
                    }
                    
                    if(move_uploaded_file($_FILES['cover']['tmp_name'], $cel_utvonal)){
                        $borito_utvonal = 'uploads/' . $fajl_nev;
                    }
                }
            }

            // Könyv beszúrása az adatbázisba
            $beszuras_sql = "INSERT INTO books (title, author, summary, cover, created_at) VALUES ('$cim', '$szerzo', '$osszefoglalo', '$borito_utvonal', NOW())";
            
            if($conn->query($beszuras_sql)){
                echo json_encode(['success' => true, 'message' => 'Könyv sikeresen hozzáadva!']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Hiba történt a könyv hozzáadásakor!']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Csak POST kérés engedélyezett!']);
        }
        exit;
    }
    
    // HTML oldal (eredeti funkció)
    if(!isset($_COOKIE['id'])){
        echo "<script>alert('Nincs bejelentkezve!'); window.location.href='login.php';</script>";
        exit;
    }
    
    $felhasznalo_id = $_COOKIE['id'];
    $admin_ellenorzes_sql = "SELECT admin FROM users WHERE id = $felhasznalo_id";
    $admin_ellenorzes_eredmeny = $conn->query($admin_ellenorzes_sql);
    
    if($admin_ellenorzes_eredmeny->num_rows == 0 || $admin_ellenorzes_eredmeny->fetch_assoc()['admin'] != 1){
        echo "<script>alert('Nincs admin jogosultság!'); window.location.href='index.php';</script>";
        exit;
    }
    
    // Könyv hozzáadás kezelése
    if(isset($_POST['add_book'])){
        $cim = $_POST['title'];
        $szerzo = $_POST['author'];
        $osszefoglalo = $_POST['description'];
        
        if($cim && $szerzo && $osszefoglalo){
            // Borítókép kezelése
            $borito_utvonal = '';
            if(isset($_FILES['cover']) && $_FILES['cover']['error'] == 0){
                $engedelyezett_tipusok = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
                $fajl_tipus = $_FILES['cover']['type'];
                
                if(in_array($fajl_tipus, $engedelyezett_tipusok)){
                    $fajl_nev = time() . '_' . $_FILES['cover']['name'];
                    $cel_utvonal = 'uploads/' . $fajl_nev;
                    
                    // Uploads mappa létrehozása, ha nem létezik
                    if(!is_dir('uploads')){
                        mkdir('uploads', 0777, true);
                    }
                    
                    if(move_uploaded_file($_FILES['cover']['tmp_name'], $cel_utvonal)){
                        $borito_utvonal = 'uploads/' . $fajl_nev;
                    }
                }
            }
            
            $beszuras_sql = "INSERT INTO books (title, author, summary, cover, created_at) VALUES ('$cim', '$szerzo', '$osszefoglalo', '$borito_utvonal', NOW())";
            
            if($conn->query($beszuras_sql)){
                echo "<script>alert('Könyv sikeresen hozzáadva!');</script>";
            } else {
                echo "<script>alert('Hiba történt a könyv hozzáadásakor!');</script>";
            }
        } else {
            echo "<script>alert('Hiányzó adatok!');</script>";
        }
    }
?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Panel - BookBase</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 min-h-screen">
    <?php include "db/navbar.php"; ?>
    
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-2xl mx-auto">
            <h1 class="text-4xl font-bold text-blue-700 text-center mb-8">Admin Panel</h1>
            
            <div class="bg-white rounded-lg shadow-lg p-8">
                <h2 class="text-2xl font-bold text-blue-700 mb-6">Könyv Hozzáadása</h2>
                
                <form method="POST" enctype="multipart/form-data" class="space-y-6">
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Könyv címe</label>
                        <input type="text" name="title" required 
                               class="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md">
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Szerző</label>
                        <input type="text" name="author" required 
                               class="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md">
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Összefoglaló</label>
                        <textarea name="description" required 
                                  class="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md min-h-[100px] resize-none"></textarea>
                    </div>
                    
                    <div>
                        <label class="block text-gray-700 text-sm font-bold mb-2">Borítókép</label>
                        <input type="file" name="cover" accept="image/*" 
                               class="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100">
                    </div>
                    
                    <button type="submit" name="add_book" 
                            class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-colors">
                        Könyv Hozzáadása
                    </button>
                </form>
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
