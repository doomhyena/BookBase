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
        
        $id = $_GET['id'] ?? 0;
        
        if(!$id || !is_numeric($id)){
            echo json_encode(['success' => false, 'message' => 'Érvénytelen könyv azonosító!']);
            exit;
        }
        
        $sql = "SELECT * FROM books WHERE id = $id";
        $eredmeny = $conn->query($sql);
        
        if($eredmeny && $eredmeny->num_rows > 0){
            $konyv = $eredmeny->fetch_assoc();
            
            // Értékelések lekérdezése
            $ertekeles_sql = "SELECT AVG(rating) as atlag_ertekeles, COUNT(*) as ertekelesek_szama FROM ratings WHERE book_id = $id";
            $ertekeles_eredmeny = $conn->query($ertekeles_sql);
            $ertekeles_adatok = $ertekeles_eredmeny->fetch_assoc();
            
            $konyv['atlag_ertekeles'] = round($ertekeles_adatok['atlag_ertekeles'], 1);
            $konyv['ertekelesek_szama'] = $ertekeles_adatok['ertekelesek_szama'];
            
            echo json_encode(['success' => true, 'book' => $konyv]);
        } else {
            echo json_encode(['success' => false, 'message' => 'A könyv nem található!']);
        }
        exit;
    }
    
    // HTML oldal (eredeti funkció)
    if(!isset($_GET['id']) || empty($_GET['id'])){
        echo "<script>alert('Hiányzó könyv azonosító!'); window.location.href='index.php';</script>";
        exit;
    }
    
    $konyv_id = intval($_GET['id']);
    $sql = "SELECT * FROM books WHERE id = $konyv_id";
    $eredmeny = $conn->query($sql);
    
    if(!$eredmeny || $eredmeny->num_rows == 0){
        echo "<script>alert('A könyv nem található!'); window.location.href='index.php';</script>";
        exit;
    }
    
    $konyv = $eredmeny->fetch_assoc();
    
    // Értékelések lekérdezése
    $ertekeles_sql = "SELECT AVG(rating) as atlag_ertekeles, COUNT(*) as ertekelesek_szama FROM ratings WHERE book_id = $konyv_id";
    $ertekeles_eredmeny = $conn->query($ertekeles_sql);
    $ertekeles_adatok = $ertekeles_eredmeny->fetch_assoc();
    
    $atlag_ertekeles = $ertekeles_adatok['atlag_ertekeles'] ? round($ertekeles_adatok['atlag_ertekeles'], 1) : 0;
    $ertekelesek_szama = $ertekeles_adatok['ertekelesek_szama'];
    
    // Könyv értékelés kezelése
    if(isset($_POST['rating']) && isset($_COOKIE['id'])){
        $ertekeles = intval($_POST['rating']);
        $felhasznalo_id = intval($_COOKIE['id']);
        
        if($ertekeles >= 1 && $ertekeles <= 5){
            // Ellenőrizzük, hogy már értékelt-e
            $ellenorzes_sql = "SELECT id FROM ratings WHERE book_id = $konyv_id AND user_id = $felhasznalo_id";
            $ellenorzes_eredmeny = $conn->query($ellenorzes_sql);
            
            if($ellenorzes_eredmeny->num_rows > 0){
                // Frissítjük a meglévő értékelést
                $frissites_sql = "UPDATE ratings SET rating = $ertekeles WHERE book_id = $konyv_id AND user_id = $felhasznalo_id";
                $conn->query($frissites_sql);
            } else {
                // Új értékelést adunk hozzá
                $beszuras_sql = "INSERT INTO ratings (book_id, user_id, rating) VALUES ($konyv_id, $felhasznalo_id, $ertekeles)";
                $conn->query($beszuras_sql);
            }
            
            echo "<script>alert('Értékelés sikeresen mentve!'); location.reload();</script>";
        }
    }
?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($konyv['title']); ?> - BookBase</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 min-h-screen">
    <?php include "db/navbar.php"; ?>
    
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-lg shadow-lg p-8">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Borítókép -->
                    <div>
                        <?php if($konyv['cover']): ?>
                            <img src="<?php echo htmlspecialchars($konyv['cover']); ?>" 
                                 alt="Borítókép" 
                                 class="w-full rounded-lg shadow-md">
                        <?php else: ?>
                            <div class="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                                <span class="text-gray-500 text-lg">Nincs borítókép</span>
                            </div>
                        <?php endif; ?>
                    </div>
                    
                    <!-- Könyv információk -->
                    <div>
                        <h1 class="text-4xl font-bold text-blue-700 mb-4">
                            <?php echo htmlspecialchars($konyv['title']); ?>
                        </h1>
                        
                        <p class="text-xl text-gray-600 mb-4">
                            <strong>Szerző:</strong> <?php echo htmlspecialchars($konyv['author']); ?>
                        </p>
                        
                        <?php if($konyv['summary']): ?>
                            <div class="mb-6">
                                <h3 class="text-lg font-bold text-blue-700 mb-2">Összefoglaló</h3>
                                <p class="text-gray-700 leading-relaxed">
                                    <?php echo nl2br(htmlspecialchars($konyv['summary'])); ?>
                                </p>
                            </div>
                        <?php endif; ?>
                        
                        <!-- Értékelések -->
                        <div class="mb-6">
                            <h3 class="text-lg font-bold text-blue-700 mb-2">Értékelések</h3>
                            <div class="flex items-center gap-4">
                                <div class="text-2xl font-bold text-yellow-500">
                                    <?php echo $atlag_ertekeles; ?>/5
                                </div>
                                <div class="text-gray-600">
                                    <?php echo $ertekelesek_szama; ?> értékelés
                                </div>
                            </div>
                        </div>
                        
                        <!-- Értékelés űrlap -->
                        <?php if(isset($_COOKIE['id'])): ?>
                            <div class="border-t pt-6">
                                <h3 class="text-lg font-bold text-blue-700 mb-3">Értékeld ezt a könyvet</h3>
                                <form method="POST" class="flex items-center gap-4">
                                    <select name="rating" required 
                                            class="px-4 py-2 border border-gray-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                                        <option value="">Válassz értékelést</option>
                                        <option value="1">1 ⭐</option>
                                        <option value="2">2 ⭐⭐</option>
                                        <option value="3">3 ⭐⭐⭐</option>
                                        <option value="4">4 ⭐⭐⭐⭐</option>
                                        <option value="5">5 ⭐⭐⭐⭐⭐</option>
                                    </select>
                                    <button type="submit" 
                                            class="px-6 py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                                        Értékelés mentése
                                    </button>
                                </form>
                            </div>
                        <?php else: ?>
                            <div class="border-t pt-6">
                                <p class="text-gray-600">
                                    <a href="login.php" class="text-blue-600 hover:underline">Jelentkezz be</a> 
                                    az értékeléshez!
                                </p>
                            </div>
                        <?php endif; ?>
                    </div>
                </div>
                
                <div class="mt-8 text-center">
                    <a href="index.php" 
                       class="inline-block px-6 py-3 bg-gray-600 text-white font-bold rounded-lg hover:bg-gray-700 transition-colors">
                        ← Vissza a főoldalra
                    </a>
                </div>
            </div>
        </div>
    </div>
</body>
</html>
