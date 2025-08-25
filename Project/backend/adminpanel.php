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