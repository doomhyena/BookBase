-- Felhasználók tábla
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    birthdate DATE NULL,
    gender ENUM('ferfi', 'no', 'egyeb') NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    profile_picture VARCHAR(255) NULL,
    admin TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Könyvek tábla
CREATE TABLE IF NOT EXISTS books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    summary TEXT NOT NULL,
    cover VARCHAR(255),
    category VARCHAR(100) DEFAULT 'Egyéb',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Értékelések tábla
CREATE TABLE IF NOT EXISTS ratings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    user_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_rating (book_id, user_id)
);

-- Olvasási státusz tábla (könyv státusz mentéséhez)
CREATE TABLE reading_history (
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    status VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, book_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);

-- Kedvencek tábla
CREATE TABLE IF NOT EXISTS favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_favorite (user_id, book_id)
);

-- Közösségi bejegyzések tábla
CREATE TABLE IF NOT EXISTS community_posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Közösségi kommentek tábla
CREATE TABLE IF NOT EXISTS community_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    content TEXT NOT NULL,
    author VARCHAR(100) NOT NULL,
    user_id INT NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES community_posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Minta könyvek (bővített lista)
INSERT INTO books (title, author, summary, category) VALUES
('A Gyűrűk Ura', 'J.R.R. Tolkien', 'Egy epikus fantasy regény, amely egy varázsgyűrűről és annak megsemmisítéséért vívott küzdelemről szól.', 'Fantasy'),
('1984', 'George Orwell', 'Egy disztopikus regény, amely egy totalitárius társadalomról és a gondolatszabadság elnyomásáról szól.', 'Disztópia'),
('A Kicsi Herceg', 'Antoine de Saint-Exupéry', 'Egy filozofikus meseregény, amely az élet értelméről és a szeretet fontosságáról szól.', 'Meseregény'),
('Harry Potter és a Bölcsek Köve', 'J.K. Rowling', 'A híres varázslótanonc első kalandja a Roxfortban.', 'Fantasy'),
('Bűn és bűnhődés', 'Fjodor Mihajlovics Dosztojevszkij', 'Egy fiatal férfi erkölcsi dilemmájáról és lelkiismeret-furdalásáról szóló klasszikus.', 'Klasszikus'),
('Pride and Prejudice', 'Jane Austen', 'Romantikus történet szerelemről, társadalmi elvárásokról és előítéletekről.', 'Romantika'),
('Az idő rövid története', 'Stephen Hawking', 'Könnyen érthető bevezetés a modern kozmológiába és a világegyetem titkaiba.', 'Tudomány'),
('A szolgálólány meséje', 'Margaret Atwood', 'Disztópikus regény egy elnyomó társadalomról, ahol a nőknek alig van joguk.', 'Disztópia'),
('Hobbit', 'J.R.R. Tolkien', 'Bilbó kalandja a törpökkel és Smaug sárkánnyal.', 'Fantasy'),
('Az Alkimista', 'Paulo Coelho', 'Filoszofikus regény az álmok követéséről és az élet értelméről.', 'Inspiráció'),
('Sherlock Holmes kalandjai', 'Arthur Conan Doyle', 'Nyomozások és rejtélyek a híres detektívvel és Watson doktorral.', 'Krimi'),
('Háború és béke', 'Lev Tolsztoj', 'Egy epikus regény a Napóleoni háborúk idejéből, szerelemmel, politikával és filozófiával.', 'Klasszikus'),
('Dűne', 'Frank Herbert', 'Egy sivatagos bolygó és annak fűszere körüli politikai és spirituális harc.', 'Sci-fi'),
('A Nagy Gatsby', 'F. Scott Fitzgerald', 'Egy gazdag férfi tragikus története az 1920-as évek Amerikájában.', 'Klasszikus'),
('Az Éhezők Viadala', 'Suzanne Collins', 'Egy disztópikus jövőben játszódó történet egy lány túléléséről és lázadásáról.', 'Disztópia'),
('A Gyűrű Szövetsége', 'J.R.R. Tolkien', 'A Gyűrűk Ura trilógia első része, amely a gyűrű megsemmisítéséről szóló küldetést követi.', 'Fantasy'),
('A Vihar Kapujában', 'Ken Follett', 'Egy történelmi regény a középkori Angliában játszódó intrikákról és hatalmi harcokról.', 'Történelmi'),
('A Mester és Margarita', 'Mihail Bulgakov', 'Egy szatirikus regény, amely a jó és a rossz harcáról szól Moszkvában.', 'Klasszikus'),
('Az Időutazó felesége', 'Audrey Niffenegger', 'Egy romantikus történet egy férfiról, aki időutazó képességgel rendelkezik.', 'Romantika'),
('A Szél neve', 'Patrick Rothfuss', 'Egy fiatal varázsló kalandjai és élete egy epikus fantasy világban.', 'Fantasy'),
('A Katedrális', 'Ken Follett', 'Egy történelmi regény a középkori Angliában játszódó intrikákról és hatalmi harcokról.', 'Történelmi'),
('A Százéves Magány', 'Gabriel García Márquez', 'Egy mágikus realizmus stílusában írt regény egy család több generációjának történetéről.', 'Klasszikus'),
('A Vörös és a Fekete', 'Stendhal', 'Egy fiatal férfi ambícióiról és szerelmi életéről szóló regény a 19. századi Franciaországban.', 'Klasszikus'),
('A Gyűrűk Ura: A Két Torony', 'J.R.R. Tolkien', 'A Gyűrűk Ura trilógia második része, amely a gyűrű megsemmisítéséért folytatott harcot követi.', 'Fantasy'),
('A Gyűrűk Ura: A Király Visszatér', 'J.R.R. Tolkien', 'A Gyűrűk Ura trilógia befejező része, amely a gyűrű megsemmisítésének végső csatáját mutatja be.', 'Fantasy'),
('A Hobbit, avagy a Váratlan Utazás', 'J.R.R. Tolkien', 'Bilbó kalandja a törpökkel és Smaug sárkánnyal.', 'Fantasy'),
('János vitéz', 'Petőfi Sándor', 'Egy árva fiú kalandjai, aki hőssé válik, miközben hazáját és szerelmét keresi.', 'Klasszikus'),
('Toldi', 'Arany János', 'A parasztfiúból hőssé váló Toldi Miklós története.', 'Klasszikus'),
('Az arany ember', 'Jókai Mór', 'Egy kettős életet élő férfi története szerelemről, családról és tisztességről.', 'Klasszikus'),
('Szent Péter esernyője', 'Mikszáth Kálmán', 'Egy különleges esernyő körüli szerencsés és balszerencsés események regénye.', 'Klasszikus'),
('Légy jó mindhalálig', 'Móricz Zsigmond', 'Nyilas Misi története, aki tiszta szívvel próbál helytállni az igazságtalanságok között.', 'Klasszikus'),
('A Pál utcai fiúk', 'Molnár Ferenc', 'A grundért küzdő fiúk története, amely barátságról és hűségről szól.', 'Ifjúsági'),
('Ember tragédiája', 'Madách Imre', 'Filozofikus dráma az emberiség történetéről és jövőjéről.', 'Dráma');
