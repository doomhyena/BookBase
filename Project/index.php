<!DOCTYPE html>
<html lang='hu'>
   <head>
       <title>Főoldal</title>
       <meta charset='UTF-8'>
       <meta name='description' content='Könyvtár kezelő weboldal, amely lehetővé teszi a könyvek keresését és kezelését.'>
       <meta name='keywords' content='könyv, keresés, könyvtár'>
       <meta name='author' content='Csontos Kincső'>
       <meta name='viewport' content='width=device-width, initial-scale=1.0'>
       <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
   </head>
   <body>
    <?php include 'assets/php/header.php'; ?>
    <main class="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto px-4 py-8">
        <section class="flex-1 space-y-8">
            <article class="bg-white rounded-lg shadow p-6">
                <h2 class="text-2xl font-bold mb-2">Üdvözöljük a BookBase könyvtárban!</h2>
                <p class="mb-2">Ez egy egyszerű könyvtár kezelő weboldal, amely lehetővé teszi a könyvek keresését és kezelését. A rendszerben regisztrált felhasználók hozzáférhetnek a könyvek adatbázisához, és kezelhetik saját könyveiket.</p>
                <p>A weboldal célja, hogy könnyen használható és felhasználóbarát felületet biztosítson a könyvek kereséséhez és kezeléséhez.</p>
            </article>
            <article class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-2">Főbb funkciók</h2>
                <ul class="list-disc list-inside space-y-1">
                    <li>Könyvek keresése cím, szerző vagy ISBN alapján</li>
                    <li>Könyvek hozzáadása, szerkesztése és törlése</li>
                    <li>Felhasználói fiókok kezelése</li>
                    <li>Adminisztrátori jogosultságok a könyvtár kezeléséhez</li>
                </ul>
            </article>
            <article class="bg-white rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-2">Hogyan kezdje el?</h2>
                <p class="mb-2">Ha még nem regisztrált, kérjük, <a href="#" class="text-blue-600 underline hover:text-blue-800">regisztráljon</a> a könyvtár használatához. Ha már regisztrált felhasználó, akkor <a href="#" class="text-blue-600 underline hover:text-blue-800">jelentkezzen be</a> a fiókjába.</p>
                <p class="mb-2">A könyvek kereséséhez használja a keresőmezőt a weboldal tetején. A könyvek adatbázisában böngészhet a cím, szerző vagy ISBN alapján.</p>
                <p>Ha bármilyen kérdése van, vagy segítségre van szüksége, kérjük, lépjen kapcsolatba velünk a <a href="#" class="text-blue-600 underline hover:text-blue-800">kapcsolatfelvételi űrlapon</a>.</p>
            </article>
            <section class="bg-gray-50 rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-2">Legnépszerűbb könyvek</h2>
                <ul class="list-decimal list-inside space-y-1 mb-2">
                    <li><a href="#" class="text-blue-600 hover:underline">Könyv 1</a></li>
                    <li><a href="#" class="text-blue-600 hover:underline">Könyv 2</a></li>
                    <li><a href="#" class="text-blue-600 hover:underline">Könyv 3</a></li>
                    <li><a href="#" class="text-blue-600 hover:underline">Könyv 4</a></li>
                    <li><a href="#" class="text-blue-600 hover:underline">Könyv 5</a></li>
                </ul>
                <p>Fedezze fel a legnépszerűbb könyveket a könyvtárunkban! Ezek a könyvek a felhasználók körében a legkeresettebbek és legjobban értékelték őket.</p>
            </section>
        </section>
        <aside class="w-full md:w-1/3 flex flex-col gap-8">
            <section class="bg-white rounded-lg shadow p-6 mb-4">
                <h2 class="text-xl font-semibold mb-2">Hírek és frissítések</h2>
                <p class="mb-2">Maradjon naprakész a legújabb könyvkiadásokkal és eseményekkel kapcsolatban! Itt találhatók a legfrissebb hírek és információk a könyvtárunkról.</p>
                <ul class="list-disc list-inside space-y-1">
                    <li><a href="#" class="text-blue-600 hover:underline">Új könyvkiadás: Könyv címe</a></li>
                    <li><a href="#" class="text-blue-600 hover:underline">Könyvbemutató esemény: Dátum és helyszín</a></li>
                    <li><a href="#" class="text-blue-600 hover:underline">Könyvtári rendezvények: Részletek</a></li>
                </ul>
            </section>
            <section class="bg-gray-50 rounded-lg shadow p-6">
                <h2 class="text-xl font-semibold mb-2">Felhasználói vélemények</h2>
                <p class="mb-2">Olvassa el, mit mondanak a felhasználóink a könyvtárunkról és a könyveinkről! Vélemények és értékelések a legnépszerűbb könyvekről.</p>
                <ul class="space-y-1">
                    <li class="italic">"Kiváló könyvtár, rengeteg jó könyvvel!" - Felhasználó 1</li>
                    <li class="italic">"Nagyszerű élmény volt a könyvtár használata!" - Felhasználó 2</li>
                    <li class="italic">"A legjobb könyvtár, amit valaha használtam!" - Felhasználó 3</li>
                </ul>
            </section>
        </aside>
    </main>
    <?php include 'assets/php/footer.php'; ?>
   </body>
</html>