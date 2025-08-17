<?php
    // Navigációs menü a BookBase oldalhoz
    if(isset($_COOKIE['id'])){
        // Bejelentkezett felhasználó navigációja
        echo '<nav class="bg-blue-600 text-white p-4 mb-8">';
        echo '<div class="container mx-auto flex justify-between items-center">';
        echo '<a href="index.php" class="text-xl font-bold">BookBase</a>';
        echo '<div class="flex space-x-4">';
        echo '<a href="search.php" class="hover:text-blue-200">Keresés</a>';
        echo '<a href="randombooks.php" class="hover:text-blue-200">Véletlenszerű</a>';
        echo '<a href="top20list.php" class="hover:text-blue-200">Top 20</a>';
        echo '<a href="recentlyread.php" class="hover:text-blue-200">Legutóbb olvasott</a>';
        echo '<a href="recommendedbooks.php" class="hover:text-blue-200">Ajánlott</a>';
        echo '<a href="community.php" class="hover:text-blue-200">Közösség</a>';
        echo '<a href="userprofile.php" class="hover:text-blue-200">Profil</a>';
        echo '<a href="logout.php" class="hover:text-blue-200">Kijelentkezés</a>';
        echo '</div>';
        echo '</div>';
        echo '</nav>';
    } else {
        // Nem bejelentkezett felhasználó navigációja
        echo '<nav class="bg-blue-600 text-white p-4 mb-8">';
        echo '<div class="container mx-auto flex justify-between items-center">';
        echo '<a href="index.php" class="text-xl font-bold">BookBase</a>';
        echo '<div class="flex space-x-4">';
        echo '<a href="login.php" class="hover:text-blue-200">Bejelentkezés</a>';
        echo '<a href="reg.php" class="hover:text-blue-200">Regisztráció</a>';
        echo '</div>';
        echo '</div>';
        echo '</nav>';
    }
?>