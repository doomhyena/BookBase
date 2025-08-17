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
        $action = $_GET['action'] ?? '';
        
        if($action === 'getNew'){
            $limit = $_GET['limit'] ?? 5;
            $sql = "SELECT * FROM books ORDER BY created_at DESC LIMIT $limit";
            $eredmeny = $conn->query($sql);
            
            $konyvek = [];
            if ($eredmeny && $eredmeny->num_rows > 0) {
                while ($konyv = $eredmeny->fetch_assoc()) {
                    $konyvek[] = [
                        'id' => $konyv['id'],
                        'title' => $konyv['title'],
                        'author' => $konyv['author'],
                        'summary' => $konyv['summary'],
                        'cover' => $konyv['cover']
                    ];
                }
            }
            
            echo json_encode(['success' => true, 'books' => $konyvek]);
            exit;
        }
        
        if($action === 'getTop20'){
            $sql = "SELECT b.*, AVG(r.rating) as atlag_ertekeles, COUNT(r.rating) as ertekelesek_szama 
                    FROM books b 
                    LEFT JOIN ratings r ON b.id = r.book_id 
                    GROUP BY b.id 
                    HAVING ertekelesek_szama > 0 
                    ORDER BY atlag_ertekeles DESC, ertekelesek_szama DESC 
                    LIMIT 20";
            $eredmeny = $conn->query($sql);
            
            $konyvek = [];
            if ($eredmeny && $eredmeny->num_rows > 0) {
                while ($konyv = $eredmeny->fetch_assoc()) {
                    $konyvek[] = [
                        'id' => $konyv['id'],
                        'title' => $konyv['title'],
                        'author' => $konyv['author'],
                        'summary' => $konyv['summary'],
                        'cover' => $konyv['cover'],
                        'atlag_ertekeles' => round($konyv['atlag_ertekeles'], 1),
                        'ertekelesek_szama' => $konyv['ertekelesek_szama']
                    ];
                }
            }
            
            echo json_encode(['success' => true, 'books' => $konyvek]);
        }
        
        if($action === 'getRandom'){
            $limit = $_GET['limit'] ?? 5;
            $sql = "SELECT * FROM books ORDER BY RAND() LIMIT $limit";
            $eredmeny = $conn->query($sql);
            
            $konyvek = [];
            if ($eredmeny && $eredmeny->num_rows > 0) {
                while ($konyv = $eredmeny->fetch_assoc()) {
                    $konyvek[] = [
                        'id' => $konyv['id'],
                        'title' => $konyv['title'],
                        'author' => $konyv['author'],
                        'summary' => $konyv['summary'],
                        'cover' => $konyv['cover']
                    ];
                }
            }
            
            echo json_encode(['success' => true, 'books' => $konyvek]);
        }
        
        if($action === 'getAll'){
            $sql = "SELECT * FROM books ORDER BY id DESC";
            $eredmeny = $conn->query($sql);
            
            $konyvek = [];
            if ($eredmeny && $eredmeny->num_rows > 0) {
                while ($konyv = $eredmeny->fetch_assoc()) {
                    $konyvek[] = [
                        'id' => $konyv['id'],
                        'title' => $konyv['title'],
                        'author' => $konyv['author'],
                        'summary' => $konyv['summary'],
                        'cover' => $konyv['cover']
                    ];
                }
            }
            
            echo json_encode(['success' => true, 'books' => $konyvek]);
            exit;
        }
        
        if($action === 'getById'){
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
        
        if($action === 'search'){
            $query = $_GET['q'] ?? '';
            
            if(empty($query)){
                echo json_encode(['success' => false, 'message' => 'Keresési kifejezés megadása kötelező!']);
                exit;
            }
            
            $sql = "SELECT * FROM books WHERE title LIKE '%$query%' OR author LIKE '%$query%' ORDER BY title";
            $eredmeny = $conn->query($sql);
            
            $konyvek = [];
            if ($eredmeny && $eredmeny->num_rows > 0) {
                while ($konyv = $eredmeny->fetch_assoc()) {
                    $konyvek[] = [
                        'id' => $konyv['id'],
                        'title' => $konyv['title'],
                        'author' => $konyv['author'],
                        'summary' => $konyv['summary'],
                        'cover' => $konyv['cover']
                    ];
                }
            }
            
            echo json_encode(['success' => true, 'books' => $konyvek, 'count' => count($konyvek)]);
            exit;
        }
        
        echo json_encode(['success' => false, 'message' => 'Érvénytelen művelet!']);
        exit;
    }
    
    // HTML oldal (eredeti funkció)
    // Könyv értékelés kezelése
    if(isset($_POST['rating']) && isset($_POST['book_id']) && isset($_COOKIE['id'])){
        $ertekeles = $_POST['rating'];
        $konyv_id = $_POST['book_id'];
        $felhasznalo_id = $_COOKIE['id'];
        
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
        
        echo "<script>alert('Értékelés sikeresen mentve!');</script>";
    }
    
    // Legutóbb hozzáadott könyvek lekérdezése
    $uj_konyvek_sql = "SELECT * FROM books ORDER BY created_at DESC LIMIT 5";
    $uj_konyvek_eredmeny = $conn->query($uj_konyvek_sql);
?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>BookBase - Főoldal</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 min-h-screen">
    <?php include "db/navbar.php"; ?>
    
    <div class="container mx-auto px-4 py-8">
        <div class="text-center mb-12">
            <h1 class="text-5xl font-bold text-blue-700 mb-4">Üdvözöl a BookBase!</h1>
            <p class="text-xl text-gray-600">Fedezd fel a világ legjobb könyveit</p>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <div class="bg-white rounded-lg shadow-lg p-6 text-center">
                <h3 class="text-2xl font-bold text-blue-700 mb-4">Könyv Keresés</h3>
                <p class="text-gray-600 mb-4">Találd meg a tökéletes könyvet</p>
                <a href="search.php" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Keresés</a>
            </div>
            
            <div class="bg-white rounded-lg shadow-lg p-6 text-center">
                <h3 class="text-2xl font-bold text-blue-700 mb-4">Top 20</h3>
                <p class="text-gray-600 mb-4">A legnépszerűbb könyvek</p>
                <a href="top20list.php" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Megtekintés</a>
            </div>
            
            <div class="bg-white rounded-lg shadow-lg p-6 text-center">
                <h3 class="text-2xl font-bold text-blue-700 mb-4">Véletlen Könyv</h3>
                <p class="text-gray-600 mb-4">Fedezz fel valami újat</p>
                <a href="randombooks.php" class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">Kipróbálás</a>
            </div>
        </div>
        
        <div class="bg-white rounded-lg shadow-lg p-8">
            <h2 class="text-3xl font-bold text-blue-700 mb-6">Legutóbb Hozzáadott Könyvek</h2>
            
            <?php if($uj_konyvek_eredmeny && $uj_konyvek_eredmeny->num_rows > 0): ?>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <?php while($konyv = $uj_konyvek_eredmeny->fetch_assoc()): ?>
                        <div class="border rounded-lg p-4">
                            <h3 class="text-xl font-bold text-blue-700 mb-2"><?php echo htmlspecialchars($konyv['title']); ?></h3>
                            <p class="text-gray-600 mb-2">Szerző: <?php echo htmlspecialchars($konyv['author']); ?></p>
                            <?php if($konyv['summary']): ?>
                                <p class="text-gray-700 mb-4"><?php echo htmlspecialchars(substr($konyv['summary'], 0, 100)) . '...'; ?></p>
                            <?php endif; ?>
                            
                            <div class="flex justify-between items-center">
                                <a href="bookdetails.php?id=<?php echo $konyv['id']; ?>" 
                                   class="text-blue-600 hover:underline">Részletek</a>
                                
                                <?php if(isset($_COOKIE['id'])): ?>
                                    <form method="POST" class="flex items-center gap-2">
                                        <input type="hidden" name="book_id" value="<?php echo $konyv['id']; ?>">
                                        <select name="rating" class="border rounded px-2 py-1">
                                            <option value="">Értékelés</option>
                                            <option value="1">1 ⭐</option>
                                            <option value="2">2 ⭐⭐</option>
                                            <option value="3">3 ⭐⭐⭐</option>
                                            <option value="4">4 ⭐⭐⭐⭐</option>
                                            <option value="5">5 ⭐⭐⭐⭐⭐</option>
                                        </select>
                                        <button type="submit" class="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700">Mentés</button>
                                    </form>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php endwhile; ?>
                </div>
            <?php else: ?>
                <p class="text-gray-500 text-center">Még nincsenek könyvek az adatbázisban.</p>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
