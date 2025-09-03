// React hook-ok importálása
import React, { useState, useEffect } from 'react';
// Link komponens a React Router-ből (könyv részleteihez navigáláshoz)
import { Link } from 'react-router-dom';

// API alap URL – innen kérjük majd le az adatokat
const API_BASE = 'http://localhost/BookBase-Dev/Project/backend';

// Ez egy külön exportált függvény, amivel bárhol le lehet kérni a top20 listát
export async function fetchTop20List() {
  try {
    // Fetch kérés a backendhez
    const res = await fetch(`${API_BASE}/top20list.php`);
    if (!res.ok) throw new Error('A szerver nem elérhető vagy hibás választ adott!');
    
    // JSON válasz átalakítása
    const data = await res.json();
    return data;
  } catch (error) {
    // Ha hiba van, egy objektummal tér vissza
    return { success: false, message: 'A szerver nem elérhető vagy hibás választ adott!' };
  }
}

// A fő komponens, ami megjeleníti a top20 listát
function Top20List() {
  // Állapotok: könyvek listája + betöltés állapot
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect akkor fut le, amikor a komponens betölt
  useEffect(() => {
    // Aszinkron függvény a top20 könyvek lekérésére
    const fetchTop20List = async () => {
      try {
        // Fetch hívás a backendhez (itt credentials is van, pl. session miatt)
        const res = await fetch('http://localhost/BookBase-Dev/Project/backend/top20list.php', { credentials: 'include' });
        if (!res.ok) throw new Error('A szerver nem elérhető vagy hibás választ adott!');
        
        // Backend válasz JSON formátumban
        const data = await res.json();

        // Ha sikeres volt a lekérés, állítsuk be a könyvek listáját
        if (data.success) {
          setBooks(data.books);
        }
      } catch (error) {
        // Hibakezelés a konzolra
        console.error('Hiba a top 20 könyvek betöltésekor:', error);
      } finally {
        // Mindig leállítjuk a "Betöltés..." státuszt
        setLoading(false);
      }
    };

    // Meghívjuk a lekérő függvényt
    fetchTop20List();
  }, []); // Üres dependency tömb -> csak egyszer fusson le betöltéskor

  // Ha még tölt az adat
  if (loading) {
    return (
      <ul>
        <li className="py-3 text-gray-500">Betöltés...</li>
      </ul>
    );
  }

  // Ha nincs könyv az adatbázisban
  if (books.length === 0) {
    return (
      <ul>
        <li className="py-3 text-gray-500">Még nincsenek értékelések</li>
      </ul>
    );
  }

  // Ha van adat, akkor megjelenítjük a könyveket
  return (
    <ul>
      {books.slice(0, 5).map((book, index) => ( // Csak az első 5 könyv jelenjen meg
        <li key={book.id} className="py-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            {/* Sorszám (#1, #2, stb.) */}
            <span className="text-yellow-500 font-bold text-sm">#{index + 1}</span>
            
            {/* Könyv címe linkként, ami a könyv részleteihez vezet */}
            <strong className="text-blue-700 font-semibold text-base">
              <Link to={`/book/${book.id}`} className="hover:underline hover:text-blue-900 transition-colors">
                {book.title}
              </Link>
            </strong>
          </div>

          {/* Könyv szerzője */}
          <span className="text-gray-500 text-sm">{book.author}</span>

          {/* Értékelések (átlag és darabszám) */}
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>★ {book.atlag_ertekeles}/5</span>
            <span>({book.ertekelesek_szama} értékelés)</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

// A komponens exportálása
export default Top20List;
