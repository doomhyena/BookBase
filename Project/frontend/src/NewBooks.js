import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Backend alap URL-je
const API_BASE = 'http://localhost/BookBase-Dev/Project/backend';

// Külön exportált függvény, amit akár más komponensek is használhatnak
// Ez fetch-eli a véletlen/új könyveket a backendről
export async function fetchNewBooks() {
  try {
    const res = await fetch(`${API_BASE}/randombooks.php`);
    if (!res.ok) throw new Error('A szerver nem elérhető vagy hibás választ adott!');
    const data = await res.json();
    return data; // visszaadjuk a backend által küldött adatot
  } catch (error) {
    return { success: false, message: 'A szerver nem elérhető vagy hibás választ adott!' };
  }
}

// NewBooks komponens – az új könyvek listázásáért felel
function NewBooks() {
  // books → a betöltött könyvek tömbje
  const [books, setBooks] = useState([]);
  // loading → jelzi, hogy folyamatban van-e a betöltés
  const [loading, setLoading] = useState(true);

  // useEffect → komponens betöltődésekor fut le
  useEffect(() => {
    const fetchNewBooks = async () => {
      try {
        // fetch a backendhez, credentials: 'include' → cookie-kat is küldünk (pl. user session miatt)
        const res = await fetch('http://localhost/BookBase-Dev/Project/backend/randombooks.php', { credentials: 'include' });
        if (!res.ok) throw new Error('A szerver nem elérhető vagy hibás választ adott!');
        const data = await res.json();

        if (data.success) {
          setBooks(data.books); // ha sikeres, eltároljuk a könyveket a state-ben
        }
      } catch (error) {
        console.error('Hiba a könyvek betöltésekor:', error); // hiba logolása a konzolra
      } finally {
        setLoading(false); // minden esetben jelzés a betöltés befejezéséről
      }
    };

    fetchNewBooks(); // függvény meghívása a komponens betöltődésekor
  }, []); // üres dependency array → csak egyszer fut le

  // Loading állapot kezelése
  if (loading) {
    return (
      <ul>
        <li className="py-3 text-gray-500">Betöltés...</li>
      </ul>
    );
  }

  // Ha nincs könyv → üzenet megjelenítése
  if (books.length === 0) {
    return (
      <ul>
        <li className="py-3 text-gray-500">Még nincsenek könyvek</li>
      </ul>
    );
  }

  // Lista renderelése, ha van könyv
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id} className="py-3 flex flex-col gap-1">
          {/* Könyv cím → link a könyv részleteihez */}
          <strong className="text-blue-700 font-semibold text-base">
            <Link 
              to={`/book/${book.id}`} 
              className="hover:underline hover:text-blue-900 transition-colors"
            >
              {book.title}
            </Link>
          </strong>
          {/* Szerző kiírása */}
          <span className="text-gray-500 text-sm">{book.author}</span>
        </li>
      ))}
    </ul>
  );
}

// Komponens exportálása, hogy más komponensek is használhassák
export default NewBooks;