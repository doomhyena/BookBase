<div align="center">

<h1> BookBase </h1>

<hr>

A BookBase egy modern, felhasználóbarát online könyvplatform, amely lehetővé teszi a felhasználók számára könyvek böngészését, értékelését, közösségi interakciókat

<br> ![BookBase Logó](img/logo.png)<br>

</div>

<div style="page-break-before: always;"></div>

<div align="center">
<h1> „Schola Europa Akadémia” Technikum, Gimnázium és Alapfokú Művészeti Iskola a Magyarországi Metodista Egyház fenntartásában </h1>

<br> ![Schola Europa Akadémia logó](img/scholalogo.png)<br>

**SZOFTVERFEJLESZTŐ ÉS -TESZTELŐ**<br>
5 0613 12 03

Dokumentáció

Készítette:<br>
Csontos Kincső <br>

**2025**

</div>

<div style="page-break-before: always;"></div>

<style>
body {
	 margin: 2cm;
}
</style>

# BookBase-Dev - Online Könyvplatform Dokumentáció

## Tartalomjegyzék

1. [Bevezetés](#1-bevezetés)
	- 1.1. [A Projekt Célja](#11-a-projekt-célja)
	- 1.2. [Főbb Funkciók](#12-főbb-funkciók)
	- 1.3. [Technológiai Stack](#13-technológiai-stack)

2. [Rendszerarchitektúra](#2-rendszerarchitektúra)
	- 2.1. [Magas Szintű Architektúra](#21-magas-szintű-architektúra)
	- 2.2. [Komponensek](#22-komponensek)
	- 2.3. [Adatbázis Séma](#23-adatbázis-séma)

3. [Frontend Architektúra](#3-frontend-architektúra)
	- 3.1. [Komponens Hierarchia](#31-komponens-hierarchia)
	- 3.2. [Állapotkezelés](#32-állapotkezelés)
	- 3.3. [Routing](#33-routing)
	- 3.4. [UI/UX Design](#34-uiux-design)

4. [Backend Architektúra](#4-backend-architektúra)
	- 4.1. [API Réteg](#41-api-réteg)
	- 4.2. [Szolgáltatások](#42-szolgáltatások)
	- 4.3. [Adatbázis Kapcsolat](#43-adatbázis-kapcsolat)
	- 4.4. [Fájlkezelés](#44-fájlkezelés)

5. [Biztonság](#5-biztonság)
	- 5.1. [Autentikáció](#51-autentikáció)
	- 5.2. [Jogosultságkezelés (RBAC)](#52-jogosultságkezelés-rbac)
	- 5.3. [CORS Beállítások](#53-cors-beállítások)

6. [Tesztelés](#6-tesztelés)
	- 6.1. [Manuális Tesztek](#62-manuális-tesztek)

7. [Deployment](#7-deployment)
	- 7.1. [Környezetek](#71-környezetek)
	- 7.2. [CI/CD Pipeline](#72-cicd-pipeline)
	- 7.3. [Monitoring](#73-monitoring)
	- 7.4. [Hibaelhárítás](#74-hibaelhárítás)

8. [API Dokumentáció](#8-api-dokumentáció)
	- 8.1. [Felhasználói Végpontok](#81-felhasználói-végpontok)
	- 8.2. [Könyv Végpontok](#82-könyv-végpontok)
	- 8.3. [Közösségi Végpontok](#83-közösségi-végpontok)
	- 8.4. [Admin Végpontok](#84-admin-végpontok)
	- 8.5. [Értékelés Végpontok](#85-értékelés-végpontok)
	- 8.6. [Olvasási Előzmények Végpontok](#86-olvasási-előzmények-végpontok)
	- 8.7. [Általános API Hívások](#87-általános-api-hívások)

9. [Felhasználói Dokumentáció](#9-felhasználói-dokumentáció)
	- 9.1. [Telepítési Útmutató](#91-telepítési-útmutató)
	- 9.2. [Használati Útmutató](#92-használati-útmutató)
	- 9.3. [Hibaelhárítási Útmutató](#93-hibaelhárítási-útmutató)

10. [Fejlesztői Dokumentáció](#10-fejlesztői-dokumentáció)
	 - 10.1. [Fejlesztői Környezet Beállítása](#101-fejlesztői-környezet-beállítása)
	 - 10.2. [Kódolási Konvenciók](#102-kódolási-konvenciók)
	 - 10.3. [Verziókezelési Stratégia](#103-verziókezelési-stratégia)

11. [Licensz](#11-licensz)

---

## 1. Bevezetés

### 1.1. A Projekt Célja

A BookBase egy modern, felhasználóbarát online könyvplatform, amely lehetővé teszi a felhasználók számára könyvek böngészését, értékelését, közösségi interakciókat, valamint saját profiljuk kezelését. A cél, hogy:

- Egyszerű, intuitív felületet biztosítson könyvgyűjtéshez, olvasáshoz, ajánlásokhoz
- Közösségi funkciókat nyújtson (vélemények, kedvencek, toplisták)
- Biztonságos és megbízható adatkezelést biztosítson
- Rugalmasan bővíthető legyen új funkciókkal

### 1.2. Főbb Funkciók

- Könyvek böngészése, részletek megtekintése
- Felhasználói regisztráció, bejelentkezés, profilkezelés
- Könyvek értékelése, kedvencek, toplisták
- Közösségi funkciók: fórum, ajánlások, aktivitás
- Admin felület (könyvkezelés, felhasználók kezelése)
- Fájlkezelés (borítókép, dokumentumok)

### 1.3. Technológiai Stack

#### Frontend
- React
- React Router
- Tailwind CSS
- JavaScript

#### Backend
- PHP
- REST API
- MySQL

#### Infrastruktúra
- XAMPP (Apache, MySQL, PHP)
- Windows 10/11 fejlesztői környezet

#### Hardverek

- Videókártya (GPU): NVIDIA RTX 3050 6gb Laptop GPU
- Processzor (CPU): AMD Ryzen 5 7235HS
- RAM: 16GB DDR5 4800 MHz

---

## 2. Rendszerarchitektúra

### 2.1. Magas Szintű Architektúra

```mermaid
graph TD
	 A[Kezdőlap] --> B[Bejelentkezés]
	 A --> C[Regisztráció]
	 B --> D[Felhasználói Profil]
	 C --> D
	 D --> E[Könyvek]
	 D --> F[Közösség]
	 D --> G[AdminPanel]
	 E --> E1[Könyv Részletek]
	 E --> E2[Kedvencek]
	 E --> E3[Toplista]
	 F --> F1[Ajánlások]
	 F --> F2[Fórum]
	 G --> G1[Könyvkezelés]
	 G --> G2[Felhasználók kezelése]
```

### 2.2. Komponensek

#### Frontend
- `App.js`: fő alkalmazás, routing
- `Navbar.js`: navigációs sáv, profil elérés
- `Books.js`, `BookDetails.js`: könyvlista, részletek
- `UserProfile.js`: profil megtekintése/szerkesztése
- `Community.js`: közösségi funkciók
- `AdminPanel.js`: admin felület
- `Login.js`: Bejelentkezési felület
- `Register.js`: Regisztrációs felület
- `Search.js`: Könyvkereső felület
- `Random.js`: Véletlenszerű könyvek megjelenítése
- `RecentlyRead.js`: Legutóbb olvasott könyvek listázása
- `NewBooks.js`: Újonnan hozzáadott könyvek listázása
- `RecommendedBooks.js`: Ajánlott könyvek listázása
- `Top20List.js`: Top 20 könyv listázása
- `Card.js`: Általános kártya komponens
- `Footer.js`: Lábléc

#### Backend
- `index.php`: Fő API belépési pont, általános könyvlekérdezések (új, top20, random, összes, ID alapján, keresés)
- `login.php`: Felhasználói bejelentkezés kezelése
- `reg.php`: Felhasználói regisztráció kezelése
- `logout.php`: Felhasználói kijelentkezés kezelése
- `bookdetails.php`: Egyedi könyv részleteinek lekérdezése és értékelések kezelése
- `randombooks.php`: Véletlenszerű könyvek lekérdezése
- `top20list.php`: Top 20 legmagasabb értékelésű könyv lekérdezése
- `userprofile.php`: Felhasználói profil adatok lekérdezése és módosítása, profilkép feltöltés, jelszóváltoztatás
- `edit_email.php`: Felhasználói email cím módosítása
- `forgotpassword.php`: Elfelejtett jelszó kezelése (token generálás)
- `reset_password.php`: Jelszó visszaállítása token alapján
- `community.php`: Közösségi felhasználók listázása
- `community_posts.php`: Közösségi bejegyzések lekérdezése és létrehozása
- `community_comments.php`: Közösségi bejegyzésekhez tartozó kommentek lekérdezése és létrehozása
- `adminpanel.php`: Adminisztrációs felület könyvek hozzáadására
- `ratings.php`: Könyvértékelések mentése és frissítése
- `recentlyread.php`: Legutóbb olvasott könyvek lekérdezése
- `recommendedbooks.php`: Ajánlott könyvek lekérdezése
- `search.php`: Könyvek keresése cím, szerző, kategória és raktárkészlet alapján
- `test_cookie.php`: Cookie tesztelésére szolgáló végpont
- `db/db.php`: Adatbázis kapcsolat kezelése, hiba naplózás
- `db/navbar.php`: (Régi, HTML alapú navigáció, API-val nem használt)

### 2.3. Adatbázis Séma

Az adatbázis MySQL alapú, főbb táblák:

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  firstname VARCHAR(50),
  lastname VARCHAR(50),
  birthdate DATE,
  gender VARCHAR(10),
  registration_date DATETIME,
  admin TINYINT(1) DEFAULT 0,
  profile_picture VARCHAR(255), -- Hozzáadva a profilkép útvonalához
  bio TEXT, -- Hozzáadva a felhasználó bemutatkozásához
  is_active TINYINT(1) DEFAULT 1 -- Hozzáadva a felhasználó státuszához (online/offline)
);

CREATE TABLE books (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255),
  author VARCHAR(255),
  summary TEXT, -- description helyett summary
  cover VARCHAR(255),
  created_at DATETIME, -- published helyett created_at
  category VARCHAR(50), -- Hozzáadva a könyv kategóriájához
  stock INT DEFAULT 0 -- Hozzáadva a raktárkészlethez
);

CREATE TABLE favorites (
  user_id INT,
  book_id INT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP, -- Hozzáadva a létrehozás dátumához
  PRIMARY KEY(user_id, book_id)
);

CREATE TABLE reading_history ( -- recently_read helyett reading_history
  user_id INT,
  book_id INT,
  read_date DATETIME DEFAULT CURRENT_TIMESTAMP, -- read_date DATETIME
  PRIMARY KEY(user_id, book_id, read_date) -- Kompozit kulcs a többszöri olvasás rögzítéséhez
);

CREATE TABLE ratings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  book_id INT,
  user_id INT,
  rating TINYINT(1), -- 1-5 közötti értékelés
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(book_id, user_id) -- Egy felhasználó csak egyszer értékelhet egy könyvet
);

CREATE TABLE community_posts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT,
  title VARCHAR(255),
  content TEXT,
  author VARCHAR(255),
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE community_comments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  post_id INT,
  user_id INT,
  content TEXT,
  author VARCHAR(255),
  date DATETIME DEFAULT CURRENT_TIMESTAMP,
  profile_picture VARCHAR(255) -- Hozzáadva a kommentelő profilképéhez
);

CREATE TABLE password_resets ( -- Hozzáadva az elfelejtett jelszó funkcióhoz
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  token VARCHAR(64),
  expires DATETIME
);
```

Kapcsolatok:
- Egy user több könyvet olvashat/kedvelhet
- Könyvekhez borítókép, leírás, szerző, kategória és raktárkészlet tartozik
- Értékelések kapcsolódnak könyvekhez és felhasználókhoz
- Közösségi bejegyzések és kommentek kapcsolódnak felhasználókhoz

---

## 3. Frontend Architektúra

### 3.1. Komponens Hierarchia

```mermaid
graph TD
	 A[App] --> B[Navbar]
	 A --> C[Main Content]
	 A --> D[Footer]
	 C --> E[Home]
	 C --> F[Register]
	 C --> G[Login]
	 C --> H[Community]
	 C --> I[Search]
	 C --> J[Random]
	 C --> K[Top20List]
	 C --> L[BookDetails]
	 C --> M[UserProfile]
	 E --> E1[NewBooks]
	 E --> E2[RecommendedBooks]
	 E --> E3[RecentlyRead]
	 E --> E4[Top20List]
	 L --> L1[Ratings]
	 H --> H1[CommunityPosts]
	 H --> H2[CommunityComments]
	 M --> M1[EditEmail]
	 M --> M2[ChangePassword]
	 M --> M3[ProfilePictureUpload]
	 B --> B1[UserDropdown]
	 B --> B2[AdminLink]
```

### 3.2. Állapotkezelés

- **React `useState`**: Lokális komponens szintű állapotok kezelésére szolgál (pl. űrlap adatok, betöltési állapot, megjelenített adatok).
- **React `useEffect`**: Mellékhatások kezelésére, mint például API hívások adatok lekérésére, vagy cookie-k olvasására a komponens életciklusában.
- **Szerver oldali adatok lekérése**: A `fetch` API-val történik, aszinkron módon.
- **Felhasználói azonosítás**: A bejelentkezett felhasználó azonosítója (`id`) egy HTTP cookie-ban tárolódik, amelyet a `getCookie('id')` segédfüggvény olvas ki. Ez alapján történik a felhasználó jogosultságainak és személyes adatainak lekérése.

### 3.3. Routing

- **React Router v6**: A navigációt és az URL-ek kezelését a `react-router-dom` könyvtár biztosítja.
- **Fő útvonalak**:
    - `/`: Kezdőlap (`Home` komponens)
    - `/register`: Regisztrációs oldal (`Register` komponens)
    - `/login`: Bejelentkezési oldal (`Login` komponens)
    - `/community`: Közösségi fórum (`Community` komponens)
    - `/search`: Könyvkereső oldal (`Search` komponens)
    - `/random`: Véletlenszerű könyvek oldal (`Random` komponens)
    - `/top20`: Top 20 könyv lista oldal (`Top20List` komponens)
- **Dinamikus útvonalak**:
    - `/book/:id`: Egy adott könyv részleteinek megtekintése (`BookDetails` komponens), ahol `:id` a könyv azonosítója.
    - `/user/:id`: Egy adott felhasználó profiljának megtekintése (`UserProfile` komponens), ahol `:id` a felhasználó azonosítója.
- **Admin útvonal**:
    - `/AdminPanel`: Adminisztrációs felület (`AdminPanel` komponens), csak admin jogosultsággal rendelkező felhasználók számára elérhető.

### 3.4. UI/UX Design

- **Tailwind CSS**: A stílusok és a reszponzív design kialakításához a Tailwind CSS utility-first keretrendszerét használjuk. Ez lehetővé teszi a gyors és konzisztens UI fejlesztést.
- **Komponens alapú felépítés**: A felhasználói felület moduláris komponensekből épül fel, ami elősegíti az újrafelhasználhatóságot és a karbantarthatóságot.
- **Felhasználóbarát formok és visszajelzések**: Az űrlapok egyszerűek és intuitívak, a felhasználói interakciókhoz (pl. sikeres regisztráció, hibaüzenetek) megfelelő visszajelzések tartoznak.
- **Reszponzív design**: A felület alkalmazkodik a különböző képernyőméretekhez (mobil, tablet, desktop), biztosítva az optimális felhasználói élményt minden eszközön.

---

## 4. Backend Architektúra

### 4.1. API Réteg

- **REST API PHP-ban**: A backend egy RESTful API-t biztosít, amely PHP nyelven íródott. Minden funkció egy dedikált PHP fájlon keresztül érhető el, amely JSON formátumban adja vissza a válaszokat.
- **Végpontok**: A végpontok logikusan vannak csoportosítva a funkciók alapján (pl. `login.php`, `bookdetails.php`, `community_posts.php`).
- **JSON válaszok**: Minden API válasz JSON formátumú, `success` mezővel, amely jelzi a művelet sikerességét, és `message` vagy `data` mezővel a releváns információk számára.
- **CORS beállítások**: A `header('Access-Control-Allow-Origin: http://localhost:3000');` beállítás biztosítja, hogy a frontend (amely `http://localhost:3000`-en fut) hozzáférhessen a backend API-hoz. Az `Access-Control-Allow-Credentials: true` beállítás engedélyezi a cookie-k küldését a kérésekkel.

### 4.2. Szolgáltatások

- **Könyvkezelés**:
    - Könyvek listázása (új, top 20, véletlenszerű, összes).
    - Egyedi könyv részleteinek lekérdezése.
    - Könyvek keresése cím és szerző alapján.
    - Admin felületen keresztül új könyvek hozzáadása (cím, szerző, összefoglaló, borítókép).
- **Felhasználókezelés**:
    - Regisztráció új felhasználók számára.
    - Bejelentkezés felhasználónév és jelszó alapján.
    - Profil adatok (email, születési dátum, nem) módosítása.
    - Jelszó megváltoztatása.
    - Elfelejtett jelszó visszaállítása token alapú mechanizmussal.
    - Profilkép feltöltése.
- **Közösségi funkciók**:
    - Közösségi bejegyzések (posztok) lekérdezése és létrehozása.
    - Kommentek lekérdezése és hozzáadása bejegyzésekhez.
    - Felhasználók listázása a közösségi oldalon.
- **Értékelés és olvasási előzmények**:
    - Könyvek értékelése 1-től 5-ig.
    - Értékelések frissítése, ha egy felhasználó már értékelt egy könyvet.
    - Legutóbb olvasott könyvek rögzítése és lekérdezése.
- **Admin funkciók**:
    - Könyvek hozzáadása az adatbázishoz.
    - Admin jogosultság ellenőrzése a műveletek előtt.

### 4.3. Adatbázis Kapcsolat

- **`db/db.php`**: Ez a fájl felelős az adatbázis kapcsolódásért.
    - `mysqli` kiterjesztést használ a MySQL adatbázishoz való kapcsolódáshoz.
    - A kapcsolódási adatok (szerver, felhasználónév, jelszó, adatbázis neve) fixen vannak beállítva (`localhost`, `root`, ``, `bookbase`).
    - Hiba esetén JSON formátumú hibaüzenetet ad vissza, és leállítja a szkript futását.
    - `error_reporting(E_ALL); ini_set('display_errors', 0); ini_set('log_errors', 1); ini_set('error_log', __DIR__ . '/php_error.log');`: Részletes hibanaplózást biztosít a `php_error.log` fájlba, miközben a felhasználó felé nem jelenít meg érzékeny hibaüzeneteket.
    - `register_shutdown_function`: Ez a funkció biztosítja, hogy a szkript futásának váratlan leállása (pl. fatális hiba) esetén is JSON formátumú hibaüzenet kerüljön visszaadásra a kliensnek.
- **Biztonságos lekérdezések**: Ahol lehetséges, `prepared statement`-ek (pl. `search.php`, `community_comments.php`, `community_posts.php`, `ratings.php`, `userprofile.php`) kerülnek felhasználásra az SQL injection támadások megelőzésére. Azonban a jelenlegi implementációban még vannak helyek, ahol direkt string összefűzés történik a lekérdezésekben (pl. `adminpanel.php`, `bookdetails.php`, `index.php`), ami biztonsági kockázatot jelent.

### 4.4. Fájlkezelés

- **Borítókép feltöltés**:
    - Az `adminpanel.php` kezeli a könyv borítóképek feltöltését.
    - A feltöltött képek az `uploads/` mappába kerülnek.
    - A fájlnév egy időbélyeggel egészül ki a duplikációk elkerülése érdekében (`time() . '_' . $_FILES['cover']['name']`).
    - Ellenőrzi a fájltípust (JPEG, JPG, PNG, GIF) a biztonság és a kompatibilitás érdekében.
    - Létrehozza az `uploads` mappát, ha az nem létezik (`mkdir('uploads', 0777, true)`).
- **Profilkép feltöltés**:
    - A `userprofile.php` kezeli a felhasználói profilképek feltöltését.
    - A képek a `users/<username>/` mappába kerülnek, ahol `<username>` a felhasználóneve.
    - Törli a régi profilképet, mielőtt feltöltené az újat, hogy elkerülje a felesleges fájlokat.
    - Hasonlóan ellenőrzi a fájltípust és létrehozza a mappát, ha szükséges.
- **Fájl elérési út tárolása**: A feltöltött fájlok elérési útja az adatbázisban kerül tárolásra (pl. `books.cover`, `users.profile_picture`).

---

## 5. Biztonság

### 5.1. Autentikáció

- **Regisztráció**:
    - Felhasználónév és email egyediségének ellenőrzése.
    - Jelszavak hash-elése a `password_hash()` függvénnyel (`PASSWORD_DEFAULT` algoritmussal) az adatbázisba mentés előtt.
    - Felhasználói mappák létrehozása a `users/` könyvtárban.
- **Bejelentkezés**:
    - Felhasználónév alapján keresés az adatbázisban.
    - Jelszó ellenőrzése a `password_verify()` függvénnyel a hash-elt jelszóval szemben.
    - Sikeres bejelentkezés esetén a felhasználó `id`-je egy HTTP cookie-ban (`id`) kerül tárolásra, amely 1 óráig érvényes.
- **Jelszó visszaállítás**:
    - `forgotpassword.php`: Email cím alapján ellenőrzi a felhasználó létezését, majd egy egyedi tokent generál (`bin2hex(random_bytes(32))`) és ment el a `password_resets` táblába, lejárati idővel (1 óra).
    - `reset_password.php`: Ellenőrzi a token érvényességét és lejáratát, majd hash-eli az új jelszót és frissíti az adatbázisban. A token felhasználása után törli azt.
- **Kijelentkezés**: A `logout.php` törli az `id` cookie-t, ezzel megszüntetve a felhasználó munkamenetét.

### 5.2. Jogosultságkezelés (RBAC)

- **Admin jogkör**:
    - Az `adminpanel.php` és más adminisztrációs funkciók eléréséhez a felhasználónak bejelentkezettnek kell lennie, és az `users` táblában az `admin` mezőjének `1`-nek kell lennie.
    - A jogosultság ellenőrzése a felhasználó `id` cookie-ja alapján történik.
- **Felhasználói jogkör**:
    - A legtöbb funkció (profil megtekintése/szerkesztése, könyvek böngészése, értékelés, közösségi interakciók) bejelentkezett felhasználók számára elérhető.
    - A `community.php`, `top20list.php`, `recentlyread.php`, `recommendedbooks.php` fájlok ellenőrzik az `id` cookie meglétét.
- **Jogosultságok ellenőrzése backend oldalon**: Minden érzékeny művelet (pl. könyv hozzáadása, profil módosítása, kommentelés) előtt a backend ellenőrzi a felhasználó bejelentkezési státuszát és jogosultságait.

### 5.3. CORS Beállítások

- Minden backend PHP fájl elején szerepelnek a CORS (Cross-Origin Resource Sharing) beállítások:
    ```php
    header_remove();
    header('Access-Control-Allow-Origin: http://localhost:3000');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
    header('Access-Control-Allow-Credentials: true'); // Fontos a cookie-k küldéséhez
    header('Content-Type: application/json');
    ```
- Ezek a beállítások biztosítják, hogy a frontend alkalmazás (amely `http://localhost:3000`-en fut) kommunikálhasson a backenddel, és küldhessen/fogadhasson cookie-kat (pl. a felhasználói `id` cookie-t) a hitelesített kérésekhez.
- Az `OPTIONS` metódus kezelése (preflight kérések) is implementálva van több végponton (pl. `login.php`, `community_comments.php`, `community_posts.php`, `ratings.php`, `recentlyread.php`, `recommendedbooks.php`, `search.php`, `userprofile.php`), ami szükséges a komplexebb HTTP kérések (pl. `POST` JSON body-val) megfelelő működéséhez.

## 6. Tesztelés

### 6.1. Manuális Tesztek

- **Felhasználói folyamatok tesztelése**:
    - Regisztráció: Érvényes és érvénytelen adatokkal, már létező felhasználónévvel/email címmel.
    - Bejelentkezés: Helyes és helytelen adatokkal, nem létező felhasználóval.
    - Jelszó visszaállítás: Érvényes és érvénytelen email címmel, token érvényességének ellenőrzése.
    - Profil módosítás: Email, születési dátum, nem, profilkép frissítése. Email egyediségének ellenőrzése.
    - Jelszó változtatás: Helyes és helytelen jelenlegi jelszóval, nem egyező új jelszavakkal.
    - Könyv böngészés: Újonnan hozzáadott, top 20, véletlenszerű, ajánlott könyvek listázása.
    - Könyv részletek: Egyedi könyv adatainak és értékeléseinek megjelenítése.
    - Könyv értékelés: Értékelés hozzáadása és frissítése.
    - Keresés: Különböző keresési kifejezésekkel, kategóriákkal, raktárkészlettel.
    - Közösségi funkciók: Bejegyzések létrehozása, kommentelés, felhasználók listázása.
- **Admin funkciók tesztelése**:
    - Admin felhasználóval történő bejelentkezés.
    - Könyv hozzáadása az adminpanelen keresztül: Minden mező kitöltésével, hiányzó adatokkal, borítókép feltöltésével.
    - Admin jogosultság nélküli hozzáférés próbálkozása az adminpanelhez.
- **Fájl feltöltés tesztelése**:
    - Érvényes képfájlok feltöltése (JPG, PNG, GIF).
    - Érvénytelen fájltípusok feltöltése (pl. PDF, TXT).
    - Nagy méretű fájlok feltöltése.
- **Reszponzivitás tesztelése**: A felület megjelenésének és működésének ellenőrzése különböző eszközökön és képernyőméreteken (böngésző fejlesztői eszközeivel).
- **Hibakezelés tesztelése**: A rendszer viselkedésének ellenőrzése hibahelyzetekben (pl. adatbázis kapcsolat megszakadása, érvénytelen API kérések).

## 7. Deployment

### 7.1. Környezetek

- **Fejlesztői**: XAMPP környezetben, lokális gépen fut. Ez a fő fejlesztési és tesztelési környezet.
- **Tesztelési (Staging)**: Jelenleg nincs dedikált staging környezet, de a jövőben tervezett. Itt történne a funkciók integrációs tesztelése és a hibák felderítése éles környezethez hasonló körülmények között.
- **Produkciós**: Éles szerveren futó környezet, amely a végfelhasználók számára elérhető.

### 7.2. CI/CD Pipeline

- **Git verziókezelés**: A projekt forráskódja Git verziókezelő rendszerrel van kezelve, ami lehetővé teszi a változások nyomon követését, a kollaborációt és a verziók közötti váltást.
- **Automatikus tesztelés, build**: Jelenleg nincs automatizált CI/CD pipeline. A tesztelés manuálisan történik, a build folyamat (frontend esetén `npm run build`) pedig helyileg fut.
- **Deployment script**: A deployment jelenleg manuális fájlmásolással (pl. FTP, rsync) történik a fejlesztői környezetből az éles szerverre.

### 7.3. Monitoring

- **Szerver logok**: Az Apache és PHP hibanaplók (`php_error.log`) figyelése a backend oldali hibák azonosítására.
- **Felhasználói visszajelzések**: A felhasználóktól érkező visszajelzések gyűjtése és elemzése a felmerülő problémák és fejlesztési igények azonosítására.
- **Böngésző konzol**: A frontend oldali hibák és figyelmeztetések nyomon követése a böngésző fejlesztői eszközeinek konzolján keresztül.

### 7.4. Hibaelhárítás

- **Adatbázis kapcsolat hibák**:
    - Ellenőrizze a `db/db.php` fájlban megadott adatbázis kapcsolódási adatokat (szerver, felhasználónév, jelszó, adatbázis neve).
    - Győződjön meg róla, hogy a MySQL szerver fut.
    - Ellenőrizze a `php_error.log` fájlt a részletes hibaüzenetekért.
- **Fájl feltöltési hibák**:
    - Ellenőrizze a feltöltési mappák (pl. `uploads/`, `users/<username>/`) létezését és írási jogosultságait.
    - Győződjön meg róla, hogy a feltöltött fájlméret nem haladja meg a PHP beállításokban (`php.ini`) engedélyezett maximális méretet (`upload_max_filesize`, `post_max_size`).
    - Ellenőrizze a fájltípust, hogy az engedélyezett formátumok közé tartozik-e.
- **Bejelentkezési problémák**:
    - Ellenőrizze a felhasználónév és jelszó helyességét.
    - Győződjön meg róla, hogy a cookie-k engedélyezve vannak a böngészőben.
    - Ellenőrizze a böngésző konzolját és a szerver logokat a hitelesítési hibákért.
- **Általános API hibák**:
    - Használjon böngésző fejlesztői eszközöket (Network fül) az API kérések és válaszok ellenőrzésére.
    - Ellenőrizze a backend PHP fájlok szintaktikai hibáit.
    - Tekintse meg a `php_error.log` fájlt a részletes szerver oldali hibaüzenetekért.

## 8. API Dokumentáció

Minden API végpont JSON formátumban ad vissza választ, `success` (boolean) és `message` (string) vagy `data` (object/array) mezőkkel. Ahol releváns, a `credentials: 'include'` beállítás szükséges a frontend oldalon a cookie-k küldéséhez.

### 8.1. Felhasználói Végpontok

| Végpont | Metódus | Leírás | Kérés (JSON) | Válasz (JSON) |
|---|---|---|---|---|
| `/backend/reg.php?api=true` | `POST` | Felhasználói regisztráció. | `{ "username": "user123", "email": "user@example.com", "password": "password123" }` | `{ "success": true, "message": "Sikeres regisztráció!" }` |
| `/backend/login.php?api=true` | `POST` | Felhasználói bejelentkezés. | `{ "username": "user123", "password": "password123" }` | `{ "success": true, "message": "Sikeres bejelentkezés!", "user": { "id": 1, "username": "user123", "email": "user@example.com", "firstname": "", "lastname": "", "admin": 0 } }` |
| `/backend/logout.php?api=true` | `GET` | Felhasználói kijelentkezés. | N/A | `{ "success": true, "message": "Sikeres kijelentkezés!" }` |
| `/backend/userprofile.php?action=getCurrentUser` | `GET` | A jelenleg bejelentkezett felhasználó adatainak lekérdezése. | N/A | `{ "success": true, "user": { "id": 1, "username": "user123", "email": "user@example.com", "profile_picture": "path/to/pic.jpg" } }` |
| `/backend/userprofile.php?action=getById&id=<user_id>` | `GET` | Egy adott felhasználó profil adatainak lekérdezése ID alapján. | N/A | `{ "success": true, "user": { "id": 1, "username": "user123", "email": "user@example.com", "birthdate": "2000-01-01", "gender": "male", "profile_picture": "path/to/pic.jpg", "recentlyRead": [...], "favorites": [...] } }` |
| `/backend/userprofile.php?action=updateProfile` | `POST` | Felhasználói profil adatainak frissítése (email, születési dátum, nem, profilkép). | `FormData` (email, birthdate, gender, profile_picture (file)) | `{ "success": true, "message": "Profil sikeresen frissítve!", "user": {...} }` |
| `/backend/userprofile.php?action=changePassword` | `POST` | Felhasználói jelszó megváltoztatása. | `{ "current_password": "old_password", "new_password": "new_password123", "new_password_again": "new_password123" }` | `{ "success": true, "message": "Jelszó sikeresen megváltoztatva!" }`` |
| `/backend/edit_email.php` | `POST` | Felhasználói email cím módosítása. | `{ "email": "new_email@example.com" }` | `{ "success": true, "message": "Email cím sikeresen frissítve!" }` |
| `/backend/forgotpassword.php` | `POST` | Jelszó visszaállítási token generálása. | `{ "email": "user@example.com" }` | `{ "success": true, "message": "Email cím megtalálva!...", "token": "generated_token", "redirect_url": "/reset-password?token=..." }` |
| `/backend/reset_password.php` | `POST` | Jelszó visszaállítása token alapján. | `{ "token": "received_token", "new_password": "new_password123" }` | `{ "success": true, "message": "Jelszó sikeresen frissítve!" }` |
| `/backend/test_cookie.php` | `GET` | Cookie meglétének tesztelése. | N/A | `{ "success": true, "cookie_id": "user_id" }` vagy `{ "success": false, "message": "Nincs id cookie a request-ben!" }` |

### 8.2. Könyv Végpontok

| Végpont | Metódus | Leírás | Kérés (JSON) | Válasz (JSON) |
|---|---|---|---|---|
| `/backend/index.php?api=true&action=getNew&limit=<num>` | `GET` | Legújabb könyvek lekérdezése. | N/A | `{ "success": true, "books": [...] }` |
| `/backend/index.php?api=true&action=getTop20` | `GET` | Top 20 legmagasabb értékelésű könyv lekérdezése. | N/A | `{ "success": true, "books": [...] }` |
| `/backend/index.php?api=true&action=getRandom&limit=<num>` | `GET` | Véletlenszerű könyvek lekérdezése. | N/A | `{ "success": true, "books": [...] }` |
| `/backend/index.php?api=true&action=getAll` | `GET` | Összes könyv lekérdezése. | N/A | `{ "success": true, "books": [...] }` |
| `/backend/index.php?api=true&action=getById&id=<book_id>` | `GET` | Egy adott könyv részleteinek lekérdezése ID alapján. | N/A | `{ "success": true, "book": { "id": 1, "title": "Book Title", "author": "Author Name", "summary": "...", "cover": "path/to/cover.jpg", "atlag_ertekeles": 4.5, "ertekelesek_szama": 10 } }` |
| `/backend/index.php?api=true&action=search&q=<query>` | `GET` | Könyvek keresése cím vagy szerző alapján. | N/A | `{ "success": true, "books": [...], "count": 5 }` |
| `/backend/bookdetails.php?api=true&id=<book_id>` | `GET` | Egy adott könyv részleteinek lekérdezése (értékelésekkel). | N/A | `{ "success": true, "book": { "id": 1, "title": "Book Title", "author": "Author Name", "summary": "...", "cover": "path/to/cover.jpg", "atlag_ertekeles": 4.5, "ertekelesek_szama": 10 } }` |
| `/backend/randombooks.php` | `GET` | Véletlenszerű könyvek lekérdezése (5 db). | N/A | `{ "success": true, "books": [...] }` |
| `/backend/recommendedbooks.php` | `GET` | Ajánlott könyvek lekérdezése (jelenleg véletlenszerűen). | N/A | `{ "success": true, "books": [...] }` |
| `/backend/search.php?api=true&q=<query>&category=<cat>&sort=<sort_key>&inStock=<0/1>` | `GET` | Könyvek keresése részletes paraméterekkel. | N/A | `{ "success": true, "books": [...], "count": 5 }` |
| `/backend/top20list.php` | `GET` | Top 20 könyv lekérdezése (jelenleg ID alapján). | N/A | `{ "success": true, "books": [...] }` |

### 8.3. Közösségi Végpontok

| Végpont | Metódus | Leírás | Kérés (JSON) | Válasz (JSON) |
|---|---|---|---|---|
| `/backend/community.php` | `GET` | Közösségi felhasználók listázása. | N/A | `{ "success": true, "users": [...] }` |
| `/backend/community_posts.php` | `GET` | Közösségi bejegyzések lekérdezése. | N/A | `{ "success": true, "posts": [...] }` |
| `/backend/community_posts.php` | `POST` | Új közösségi bejegyzés létrehozása. | `{ "title": "Post Title", "content": "Post Content" }` | `{ "success": true, "message": "Bejegyzés létrehozva." }` |
| `/backend/community_comments.php?postId=<post_id>` | `GET` | Kommentek lekérdezése egy adott bejegyzéshez. | N/A | `{ "success": true, "comments": [...] }` |
| `/backend/community_comments.php` | `POST` | Új komment létrehozása egy bejegyzéshez. | `{ "postId": 1, "content": "My comment" }` | `{ "success": true, "message": "Komment létrehozva." }` |

### 8.4. Admin Végpontok

| Végpont | Metódus | Leírás | Kérés (FormData) | Válasz (JSON) |
|---|---|---|---|---|
| `/backend/adminpanel.php?api=true` | `POST` | Új könyv hozzáadása az adatbázishoz (admin jogosultság szükséges). | `FormData` (title, author, description, cover (file)) | `{ "success": true, "message": "Könyv sikeresen hozzáadva!" }` |

### 8.5. Értékelés Végpontok

| Végpont | Metódus | Leírás | Kérés (JSON) | Válasz (JSON) |
|---|---|---|---|---|
| `/backend/ratings.php` | `POST` | Könyv értékelésének mentése vagy frissítése. | `{ "book_id": 1, "rating": 5 }` | `{ "success": true, "message": "Értékelés mentve!" }` |

### 8.6. Olvasási Előzmények Végpontok

| Végpont | Metódus | Leírás | Kérés (JSON) | Válasz (JSON) |
|---|---|---|---|---|
| `/backend/recentlyread.php?api=true` | `GET` | Legutóbb olvasott könyvek lekérdezése a bejelentkezett felhasználó számára. | N/A | `{ "success": true, "books": [...] }` |

### 8.7. Általános API Hívások

| Végpont | Metódus | Leírás | Kérés (JSON) | Válasz (JSON) |
|---|---|---|---|---|
| `/backend/db/db.php` | N/A | Adatbázis kapcsolat ellenőrzése és hiba naplózás. | N/A | `{ "success": false, "message": "Kapcsolat sikertelen! ..." }` (hiba esetén) |

## 9. Felhasználói Dokumentáció

### 9.1. Telepítési Útmutató

1. **XAMPP telepítése**: Töltse le és telepítse az XAMPP-ot (Apache, MySQL, PHP) a hivatalos weboldalról.
2. **Projekt mappák bemásolása**:
    - Másolja a `backend` mappát az XAMPP `htdocs` könyvtárába (pl. `C:\xampp\htdocs\BookBase-Dev\backend`).
    - Másolja a `frontend` mappát egy tetszőleges helyre (pl. `C:\BookBase-Dev\frontend`).
3. **Adatbázis importálása**:
    - Indítsa el az Apache és MySQL szolgáltatásokat az XAMPP vezérlőpultján.
    - Nyissa meg a böngészőben a `http://localhost/phpmyadmin` címet.
    - Hozzon létre egy új adatbázist `bookbase` néven.
    - Importálja a `backend/db/db.sql` fájlt az újonnan létrehozott `bookbase` adatbázisba.
4. **Szükséges csomagok telepítése frontendhez**:
    - Nyisson meg egy parancssort (CMD vagy PowerShell) és navigáljon a `frontend` mappa gyökerébe:
        ```bash
        cd C:\BookBase-Dev\frontend
        ```
    - Telepítse a szükséges Node.js csomagokat:
        ```bash
        npm install
        ```
5. **Frontend fejlesztői szerver indítása**:
    - Ugyanebben a parancssorban indítsa el a React fejlesztői szervert:
        ```bash
        npm start
        ```
    - Ez általában automatikusan megnyitja a böngészőben a `http://localhost:3000` címet.
6. **Backend szerver elérése**:
    - Győződjön meg róla, hogy az Apache fut az XAMPP-ban.
    - A backend API-k a `http://localhost/BookBase-Dev/backend/` címen keresztül érhetők el.

### 9.2. Használati Útmutató

1. **Regisztráció**:
    - Navigáljon a `http://localhost:3000/register` címre.
    - Töltse ki a felhasználónév, email és jelszó mezőket, majd kattintson a "Regisztráció" gombra.
2. **Bejelentkezés**:
    - Navigáljon a `http://localhost:3000/login` címre.
    - Adja meg felhasználónevét és jelszavát, majd kattintson a "Bejelentkezés" gombra.
3. **Könyvek böngészése**:
    - A kezdőlapon (`http://localhost:3000/`) megtekintheti az újonnan hozzáadott, ajánlott, legutóbb olvasott és top 20 könyveket.
    - A "Keresés" menüpont alatt (`http://localhost:3000/search`) kereshet könyveket cím vagy szerző alapján.
    - A "Random" menüpont alatt (`http://localhost:3000/random`) véletlenszerű könyveket láthat.
    - A "Top 20" menüpont alatt (`http://localhost:3000/top20`) megtekintheti a legmagasabb értékelésű könyveket.
    - Kattintson egy könyvre a részletek megtekintéséhez.
4. **Profil megtekintése és szerkesztése**:
    - Bejelentkezés után a "Profilom" menüpont alatt (`http://localhost:3000/user/<saját_id>`) megtekintheti saját profilját.
    - Itt módosíthatja az email címét, születési dátumát, nemét és profilképét.
    - Lehetősége van a jelszavát is megváltoztatni.
5. **Közösségi funkciók használata**:
    - A "Közösség" menüpont alatt (`http://localhost:3000/community`) megtekintheti a közösségi bejegyzéseket.
    - Bejelentkezve új bejegyzéseket hozhat létre és kommentelhet mások posztjaihoz.
6. **Könyvek értékelése**:
    - Egy könyv részleteinek oldalán értékelheti a könyvet 1-től 5-ig.
7. **Kijelentkezés**:
    - A "Profilom" menüpont alatti legördülő menüben kattintson a "Kijelentkezés" gombra.
8. **Admin panel (csak adminoknak)**:
    - Ha admin jogosultsággal rendelkezik, a "Admin" menüpont alatt (`http://localhost:3000/AdminPanel`) új könyveket adhat hozzá az adatbázishoz.

### 9.3. Hibaelhárítási Útmutató

- **"Nincs adatbázis kapcsolat!" hibaüzenet**:
    - Ellenőrizze, hogy az XAMPP vezérlőpultján fut-e az Apache és a MySQL szolgáltatás.
    - Győződjön meg róla, hogy a `bookbase` nevű adatbázis létezik a phpMyAdmin-ban, és importálta bele a `db.sql` fájlt.
    - Ellenőrizze a `backend/db/db.php` fájlban a kapcsolódási adatokat.
- **"Hiányzó adatok!" vagy "Hiba történt a regisztráció során!" hibaüzenet regisztrációnál**:
    - Győződjön meg róla, hogy minden kötelező mezőt kitöltött.
    - Ellenőrizze, hogy a felhasználónév vagy az email cím nem létezik-e már az adatbázisban.
- **"Nincs ilyen felhasználó!" vagy "Hibás jelszó!" hibaüzenet bejelentkezésnél**:
    - Ellenőrizze a felhasználónevet és a jelszót.
    - Győződjön meg róla, hogy regisztrált már a rendszerbe.
- **Képfeltöltési problémák**:
    - Ellenőrizze, hogy a `backend/uploads` és `backend/users/<username>` mappák léteznek-e, és van-e írási jogosultságuk.
    - Győződjön meg róla, hogy a feltöltött fájl kép formátumú (JPG, PNG, GIF) és nem túl nagy méretű.
- **A weboldal nem töltődik be a `http://localhost:3000` címen**:
    - Ellenőrizze, hogy a `npm start` parancs fut-e a `frontend` mappában.
    - Győződjön meg róla, hogy a 3000-es port szabad és nem használja más alkalmazás.
- **Általános hibák, üres oldalak**:
    - Nyissa meg a böngésző fejlesztői eszközeit (általában F12 gomb), és ellenőrizze a "Console" és "Network" füleket a hibaüzenetekért.
    - Tekintse meg a `backend/db/php_error.log` fájlt a szerver oldali PHP hibákért.

## 10. Fejlesztői Dokumentáció

### 10.1. Fejlesztői Környezet Beállítása

1. **XAMPP telepítése**: Telepítse az XAMPP-ot a PHP, Apache és MySQL futtatásához.
2. **Git klónozás**: Klónozza a projekt repository-ját:
    ```bash
    git clone <repository_url> BookBase-Dev
    ```
3. **Backend beállítása**:
    - Helyezze a `backend` mappát az XAMPP `htdocs` könyvtárába (pl. `C:\xampp\htdocs\BookBase-Dev\backend`).
    - Győződjön meg róla, hogy az Apache és MySQL szolgáltatások futnak.
    - Hozza létre a `bookbase` adatbázist a phpMyAdmin-ban és importálja a `backend/db/db.sql` fájlt.
4. **Frontend beállítása**:
    - Navigáljon a `frontend` mappába a parancssorban.
    - Telepítse a Node.js függőségeket:
        ```bash
        npm install
        ```
    - Indítsa el a fejlesztői szervert:
        ```bash
        npm start
        ```
5. **Környezeti változók**: Jelenleg nincsenek külső környezeti változók használatban, minden konfiguráció a kódban van rögzítve (pl. adatbázis adatok, API_BASE URL). Javasolt a jövőben `.env` fájlok használata a konfigurációk kezelésére.

### 10.2. Kódolási Konvenciók

- **PHP**:
    - **Formázás**: 4 szóköz behúzás, PSR-12 konvenciók követése (ha lehetséges).
    - **OOP**: Objektumorientált programozási elvek alkalmazása a komplexebb logikákhoz.
    - **Biztonságos lekérdezések**: Előnyben részesítendő a `prepared statement`-ek használata az SQL injection megelőzésére. Jelenleg még vannak helyek, ahol direkt string összefűzés történik, ezeket refaktorálni kell.
    - **Hiba naplózás**: Részletes hibanaplózás a `php_error.log` fájlba, a felhasználó felé pedig általános hibaüzenetek.
    - **CORS**: Minden API végponton egységes CORS fejlécek beállítása.
- **JavaScript/React**:
    - **Komponensek**: Funkcionális komponensek használata React Hooks-szal.
    - **Stílus**: Tailwind CSS osztályok használata a komponensek stílusozásához.
    - **Prop validáció**: Javasolt a `PropTypes` vagy TypeScript használata a komponens prop-ok validálására.
    - **Állapotkezelés**: `useState` és `useEffect` használata a komponens szintű állapotokhoz és mellékhatásokhoz.
    - **API hívások**: `fetch` API használata aszinkron kérésekhez.
- **Kommentek**: Minden főbb függvényhez, osztályhoz és komplexebb logikai blokkhoz adjon hozzá magyarázó kommenteket.

### 10.3. Verziókezelési Stratégia

- **Git használata**: A projekt verziókezelésére a Git-et használjuk.
- **Feature branch workflow**:
    - Minden új funkciót vagy hibajavítást külön feature branch-en kell fejleszteni (pl. `feature/uj-funkcio`, `bugfix/hiba-javitas`).
    - A `main` branch mindig stabil és deployolható állapotban van.
    - A feature branch-eket a `main` branch-be kell merge-elni `pull request` (vagy `merge request`) és `code review` után.
- **Commit üzenetek**: Használjon leíró és konzisztens commit üzeneteket (pl. "feat: Új felhasználói regisztráció implementálása", "fix: Bejelentkezési hiba javítása").

## 11. Licensz

Ez a projekt saját projektmunkás licensz alatt áll. A forráskód és a dokumentáció kizárólag oktatási célokra használható fel, kereskedelmi felhasználása nem engedélyezett.

A felhasználók vállalják, hogy nem töltenek fel jogvédett tartalmat.