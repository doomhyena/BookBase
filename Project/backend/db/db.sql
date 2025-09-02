
--
-- Tábla szerkezet ehhez a táblához `books`
--

CREATE TABLE `books` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `author` varchar(255) NOT NULL,
  `summary` text NOT NULL,
  `cover` varchar(255) DEFAULT NULL,
  `category` varchar(100) DEFAULT 'Egyéb',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `books`
--

INSERT INTO `books` (`id`, `title`, `author`, `summary`, `cover`, `category`, `created_at`) VALUES
(1, 'A Gyűrűk Ura', 'J.R.R. Tolkien', 'Egy epikus fantasy regény, amely egy varázsgyűrűről és annak megsemmisítéséért vívott küzdelemről szól.', NULL, 'Fantasy', '2025-09-02 17:56:10'),
(2, '1984', 'George Orwell', 'Egy disztopikus regény, amely egy totalitárius társadalomról és a gondolatszabadság elnyomásáról szól.', NULL, 'Disztópia', '2025-09-02 17:56:10'),
(3, 'A Kicsi Herceg', 'Antoine de Saint-Exupéry', 'Egy filozofikus meseregény, amely az élet értelméről és a szeretet fontosságáról szól.', NULL, 'Meseregény', '2025-09-02 17:56:10'),
(4, 'Harry Potter és a Bölcsek Köve', 'J.K. Rowling', 'A híres varázslótanonc első kalandja a Roxfortban.', NULL, 'Fantasy', '2025-09-02 17:56:10'),
(5, 'Bűn és bűnhődés', 'Fjodor Mihajlovics Dosztojevszkij', 'Egy fiatal férfi erkölcsi dilemmájáról és lelkiismeret-furdalásáról szóló klasszikus.', NULL, 'Klasszikus', '2025-09-02 17:56:10'),
(6, 'Pride and Prejudice', 'Jane Austen', 'Romantikus történet szerelemről, társadalmi elvárásokról és előítéletekről.', NULL, 'Romantika', '2025-09-02 17:56:10'),
(7, 'Az idő rövid története', 'Stephen Hawking', 'Könnyen érthető bevezetés a modern kozmológiába és a világegyetem titkaiba.', NULL, 'Tudomány', '2025-09-02 17:56:10'),
(8, 'A szolgálólány meséje', 'Margaret Atwood', 'Disztópikus regény egy elnyomó társadalomról, ahol a nőknek alig van joguk.', NULL, 'Disztópia', '2025-09-02 17:56:10'),
(9, 'Hobbit', 'J.R.R. Tolkien', 'Bilbó kalandja a törpökkel és Smaug sárkánnyal.', NULL, 'Fantasy', '2025-09-02 17:56:10'),
(10, 'Az Alkimista', 'Paulo Coelho', 'Filoszofikus regény az álmok követéséről és az élet értelméről.', NULL, 'Inspiráció', '2025-09-02 17:56:10'),
(11, 'Sherlock Holmes kalandjai', 'Arthur Conan Doyle', 'Nyomozások és rejtélyek a híres detektívvel és Watson doktorral.', NULL, 'Krimi', '2025-09-02 17:56:10'),
(12, 'Háború és béke', 'Lev Tolsztoj', 'Egy epikus regény a Napóleoni háborúk idejéből, szerelemmel, politikával és filozófiával.', NULL, 'Klasszikus', '2025-09-02 17:56:10'),
(13, 'Dűne', 'Frank Herbert', 'Egy sivatagos bolygó és annak fűszere körüli politikai és spirituális harc.', NULL, 'Sci-fi', '2025-09-02 17:56:10'),
(14, 'A Nagy Gatsby', 'F. Scott Fitzgerald', 'Egy gazdag férfi tragikus története az 1920-as évek Amerikájában.', NULL, 'Klasszikus', '2025-09-02 17:56:10'),
(15, 'Az Éhezők Viadala', 'Suzanne Collins', 'Egy disztópikus jövőben játszódó történet egy lány túléléséről és lázadásáról.', NULL, 'Disztópia', '2025-09-02 17:56:10'),
(16, 'A Gyűrű Szövetsége', 'J.R.R. Tolkien', 'A Gyűrűk Ura trilógia első része, amely a gyűrű megsemmisítéséről szóló küldetést követi.', NULL, 'Fantasy', '2025-09-02 17:56:10'),
(17, 'A Vihar Kapujában', 'Ken Follett', 'Egy történelmi regény a középkori Angliában játszódó intrikákról és hatalmi harcokról.', NULL, 'Történelmi', '2025-09-02 17:56:10'),
(18, 'A Mester és Margarita', 'Mihail Bulgakov', 'Egy szatirikus regény, amely a jó és a rossz harcáról szól Moszkvában.', NULL, 'Klasszikus', '2025-09-02 17:56:10'),
(19, 'Az Időutazó felesége', 'Audrey Niffenegger', 'Egy romantikus történet egy férfiról, aki időutazó képességgel rendelkezik.', NULL, 'Romantika', '2025-09-02 17:56:10'),
(20, 'A Szél neve', 'Patrick Rothfuss', 'Egy fiatal varázsló kalandjai és élete egy epikus fantasy világban.', NULL, 'Fantasy', '2025-09-02 17:56:10'),
(21, 'A Katedrális', 'Ken Follett', 'Egy történelmi regény a középkori Angliában játszódó intrikákról és hatalmi harcokról.', NULL, 'Történelmi', '2025-09-02 17:56:10'),
(22, 'A Százéves Magány', 'Gabriel García Márquez', 'Egy mágikus realizmus stílusában írt regény egy család több generációjának történetéről.', NULL, 'Klasszikus', '2025-09-02 17:56:10'),
(23, 'A Vörös és a Fekete', 'Stendhal', 'Egy fiatal férfi ambícióiról és szerelmi életéről szóló regény a 19. századi Franciaországban.', NULL, 'Klasszikus', '2025-09-02 17:56:10'),
(24, 'A Gyűrűk Ura: A Két Torony', 'J.R.R. Tolkien', 'A Gyűrűk Ura trilógia második része, amely a gyűrű megsemmisítéséért folytatott harcot követi.', NULL, 'Fantasy', '2025-09-02 17:56:10'),
(25, 'A Gyűrűk Ura: A Király Visszatér', 'J.R.R. Tolkien', 'A Gyűrűk Ura trilógia befejező része, amely a gyűrű megsemmisítésének végső csatáját mutatja be.', NULL, 'Fantasy', '2025-09-02 17:56:10'),
(26, 'A Hobbit, avagy a Váratlan Utazás', 'J.R.R. Tolkien', 'Bilbó kalandja a törpökkel és Smaug sárkánnyal.', NULL, 'Fantasy', '2025-09-02 17:56:10'),
(27, 'János vitéz', 'Petőfi Sándor', 'Egy árva fiú kalandjai, aki hőssé válik, miközben hazáját és szerelmét keresi.', NULL, 'Klasszikus', '2025-09-02 17:56:10'),
(28, 'Toldi', 'Arany János', 'A parasztfiúból hőssé váló Toldi Miklós története.', NULL, 'Klasszikus', '2025-09-02 17:56:10'),
(29, 'Az arany ember', 'Jókai Mór', 'Egy kettős életet élő férfi története szerelemről, családról és tisztességről.', NULL, 'Klasszikus', '2025-09-02 17:56:10'),
(30, 'Szent Péter esernyője', 'Mikszáth Kálmán', 'Egy különleges esernyő körüli szerencsés és balszerencsés események regénye.', NULL, 'Klasszikus', '2025-09-02 17:56:10'),
(31, 'Légy jó mindhalálig', 'Móricz Zsigmond', 'Nyilas Misi története, aki tiszta szívvel próbál helytállni az igazságtalanságok között.', NULL, 'Klasszikus', '2025-09-02 17:56:10'),
(32, 'A Pál utcai fiúk', 'Molnár Ferenc', 'A grundért küzdő fiúk története, amely barátságról és hűségről szól.', NULL, 'Ifjúsági', '2025-09-02 17:56:10'),
(33, 'Ember tragédiája', 'Madách Imre', 'Filozofikus dráma az emberiség történetéről és jövőjéről.', NULL, 'Dráma', '2025-09-02 17:56:10');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `community_comments`
--

CREATE TABLE `community_comments` (
  `id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `author` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `community_comments`
--

INSERT INTO `community_comments` (`id`, `post_id`, `content`, `author`, `user_id`, `date`, `created_at`) VALUES
(1, 1, 'Szia, jöhetne majd Ádám könyvei ha megjelenik :3', 'profilepictureteszt', 2, '2025-09-02', '2025-09-02 20:33:42');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `community_posts`
--

CREATE TABLE `community_posts` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `author` varchar(100) NOT NULL,
  `user_id` int(11) NOT NULL,
  `date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `community_posts`
--

INSERT INTO `community_posts` (`id`, `title`, `content`, `author`, `user_id`, `date`, `created_at`) VALUES
(1, 'Admin vagyok', 'Ki milyen könyvet látna még?', 'csontoskincso05', 1, '2025-09-02', '2025-09-02 17:59:03');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `favorites`
--

CREATE TABLE `favorites` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `password_resets`
--

CREATE TABLE `password_resets` (
  `id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `token` varchar(64) DEFAULT NULL,
  `expires` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `password_resets`
--

INSERT INTO `password_resets` (`id`, `user_id`, `token`, `expires`) VALUES
(1, 2, 'a9f25970cc4a3e349e807fdbbe8db5812e5d0c898d385dc458dd509c4a0c5fdb', '2025-09-02 23:16:57'),
(2, 2, 'e3c1e985dcbe64a0d90de63614b9db45bca17f987da859bb7b475f709268208b', '2025-09-02 23:17:08'),
(3, 2, '7a10b453ccaa0dd94512c341dedd0d59cc3f833aacb62fc0c1ffe4b0030e47e5', '2025-09-02 23:19:15'),
(4, 2, '56121753c248b16f63ac61d12fbe86bc13f5a0832dadea83f58129df7afdf42c', '2025-09-02 23:26:08');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `ratings`
--

CREATE TABLE `ratings` (
  `id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `ratings`
--

INSERT INTO `ratings` (`id`, `book_id`, `user_id`, `rating`, `created_at`) VALUES
(1, 33, 1, 5, '2025-09-02 18:12:51'),
(5, 14, 1, 5, '2025-09-02 18:18:44'),
(6, 12, 1, 1, '2025-09-02 18:20:21'),
(9, 2, 1, 5, '2025-09-02 19:19:36'),
(11, 21, 1, 5, '2025-09-02 19:24:20');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reading_history`
--

CREATE TABLE `reading_history` (
  `user_id` int(11) NOT NULL,
  `book_id` int(11) NOT NULL,
  `status` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `reading_history`
--

INSERT INTO `reading_history` (`user_id`, `book_id`, `status`, `created_at`) VALUES
(1, 33, 'Befejeztem', '2025-09-02 19:47:18');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `birthdate` date DEFAULT NULL,
  `gender` enum('ferfi','no','egyeb') DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `admin` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `custom_css` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `username`, `birthdate`, `gender`, `email`, `password`, `profile_picture`, `admin`, `created_at`, `custom_css`) VALUES
(1, 'csontoskincso05', '2005-04-04', 'no', 'csontoskincso05@proton.me', '$2y$10$0ujZ1SIircp7gIO48SNxluz833r.MzNJ5q9EshpxD0K0QXmwx6kVC', 'doomhyena_logo_version_github_3.png', 1, '2025-09-02 17:57:40', NULL),
(2, 'profilepictureteszt', '2010-10-22', 'ferfi', 'profilepictureteszt@gmail.com', '$2y$10$TdAyQlS87no8q02K5Xwrme4xZJRllPijt/Ap9Fy3K6E97NaOnvH5O', '3821-spiderman.png', 0, '2025-09-02 20:11:38', 'h1 { color: red; }\r\n.card { background: pink; }');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `books`
--
ALTER TABLE `books`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `community_comments`
--
ALTER TABLE `community_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `post_id` (`post_id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `community_posts`
--
ALTER TABLE `community_posts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `favorites`
--
ALTER TABLE `favorites`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_favorite` (`user_id`,`book_id`),
  ADD KEY `book_id` (`book_id`);

--
-- A tábla indexei `password_resets`
--
ALTER TABLE `password_resets`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `ratings`
--
ALTER TABLE `ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_rating` (`book_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `reading_history`
--
ALTER TABLE `reading_history`
  ADD PRIMARY KEY (`user_id`,`book_id`),
  ADD KEY `book_id` (`book_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `books`
--
ALTER TABLE `books`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT a táblához `community_comments`
--
ALTER TABLE `community_comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `community_posts`
--
ALTER TABLE `community_posts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT a táblához `favorites`
--
ALTER TABLE `favorites`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `password_resets`
--
ALTER TABLE `password_resets`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `ratings`
--
ALTER TABLE `ratings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `community_comments`
--
ALTER TABLE `community_comments`
  ADD CONSTRAINT `community_comments_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `community_posts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `community_comments_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `community_posts`
--
ALTER TABLE `community_posts`
  ADD CONSTRAINT `community_posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `favorites`
--
ALTER TABLE `favorites`
  ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `ratings`
--
ALTER TABLE `ratings`
  ADD CONSTRAINT `ratings_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `ratings_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `reading_history`
--
ALTER TABLE `reading_history`
  ADD CONSTRAINT `reading_history_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `reading_history_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`) ON DELETE CASCADE;
COMMIT;
