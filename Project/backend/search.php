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
    
    // HTML keresés (eredeti funkció)
    $keresesi_eredmeny = [];
    $keresesi_szoveg = '';
    
    if(isset($_GET['q']) && !empty($_GET['q'])){
        $keresesi_szoveg = $_GET['q'];
        $sql = "SELECT * FROM books WHERE title LIKE '%$keresesi_szoveg%' OR author LIKE '%$keresesi_szoveg%' ORDER BY title";
        $eredmeny = $conn->query($sql);
        
        if($eredmeny && $eredmeny->num_rows > 0){
            while($konyv = $eredmeny->fetch_assoc()){
                $keresesi_eredmeny[] = $konyv;
            }
        }
    }
?>

<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Könyv Keresés - BookBase</title>
    <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 min-h-screen">
    <?php include "db/navbar.php"; ?>
    
    <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto">
            <h1 class="text-4xl font-bold text-blue-700 text-center mb-8">Könyv Keresés</h1>
            
            <form method="GET" class="mb-8">
                <div class="flex gap-4">
                    <input type="text" name="q" value="<?php echo htmlspecialchars($keresesi_szoveg); ?>" 
                           placeholder="Könyv címe vagy szerzője..." 
                           class="flex-1 px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-lg">
                    <button type="submit" 
                            class="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors">
                        Keresés
                    </button>
                </div>
            </form>
            
            <?php if(!empty($keresesi_szoveg)): ?>
                <div class="bg-white rounded-lg shadow-lg p-6">
                    <h2 class="text-2xl font-bold text-blue-700 mb-4">
                        Keresési eredmények: "<?php echo htmlspecialchars($keresesi_szoveg); ?>"
                    </h2>
                    
                    <?php if(count($keresesi_eredmeny) > 0): ?>
                        <p class="text-gray-600 mb-4"><?php echo count($keresesi_eredmeny); ?> könyv található.</p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <?php foreach($keresesi_eredmeny as $konyv): ?>
                                <div class="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <?php if($konyv['cover']): ?>
                                        <img src="<?php echo htmlspecialchars($konyv['cover']); ?>" 
                                             alt="Borítókép" 
                                             class="w-full h-48 object-cover rounded mb-3">
                                    <?php else: ?>
                                        <div class="w-full h-48 bg-gray-200 rounded mb-3 flex items-center justify-center">
                                            <span class="text-gray-500">Nincs borítókép</span>
                                        </div>
                                    <?php endif; ?>
                                    
                                    <h3 class="text-xl font-bold text-blue-700 mb-2">
                                        <?php echo htmlspecialchars($konyv['title']); ?>
                                    </h3>
                                    <p class="text-gray-600 mb-2">
                                        Szerző: <?php echo htmlspecialchars($konyv['author']); ?>
                                    </p>
                                    <?php if($konyv['summary']): ?>
                                        <p class="text-gray-700 mb-3 text-sm">
                                            <?php echo htmlspecialchars(substr($konyv['summary'], 0, 100)) . '...'; ?>
                                        </p>
                                    <?php endif; ?>
                                    
                                    <a href="bookdetails.php?id=<?php echo $konyv['id']; ?>" 
                                       class="text-blue-600 hover:underline font-semibold">
                                        Részletek →
                                    </a>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    <?php else: ?>
                        <div class="text-center py-8">
                            <p class="text-gray-500 text-lg">Nem található könyv a keresési feltételekkel.</p>
                            <p class="text-gray-400 mt-2">Próbáld meg másik kulcsszóval keresni.</p>
                        </div>
                    <?php endif; ?>
                </div>
            <?php else: ?>
                <div class="bg-white rounded-lg shadow-lg p-8 text-center">
                    <h2 class="text-2xl font-bold text-blue-700 mb-4">Kezdj el keresni!</h2>
                    <p class="text-gray-600">Írd be a könyv címét vagy a szerző nevét a fenti mezőbe.</p>
                </div>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>

