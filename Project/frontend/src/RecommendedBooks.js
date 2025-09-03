import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Backend API alap URL-je (ezt azért jó kivenni konstansba, hogy ha változik, csak itt kell átírni)
const API_BASE = 'http://localhost/BookBase-Dev/Project/backend';

function RecommendedBooks() {
  // books -> itt tároljuk az ajánlott könyvek listáját
  // loading -> jelzi, hogy éppen töltünk adatot vagy sem
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect -> a komponens betöltésekor egyszer lefut
  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        // Adatok lekérése a backendből
        const res = await fetch(`${API_BASE}/recommendedbooks.php`, {
          credentials: 'include', // ha session/cookie kell, de ha nem fontos, ki is veheted
        });

        // Ha nem kaptunk jó választ, hibát dobunk
        if (!res.ok) throw new Error('A szerver nem elérhető vagy hibás választ adott!');

        // JSON válasz feldolgozása
        const data = await res.json();
        
        if (data.success) {
          // Csak az első 11 könyvet tároljuk el a state-be
          setBooks(data.books.slice(0, 11));
        }
      } catch (error) {
        // Ha hiba történik, azt logoljuk a konzolra (fejlesztői hibakereséshez jó)
        console.error('Hiba az ajánlott könyvek betöltésekor:', error);
      } finally {
        // Mindig leállítjuk a "loading" állapotot, akár sikerült, akár nem
        setLoading(false);
      }
    };

    // Meghívjuk a függvényt
    fetchRecommendedBooks();
  }, []); // [] => csak egyszer fusson le, mikor a komponens betöltődik

  // Ha még töltjük az adatokat
  if (loading) {
    return (
      <ul>
        <li className="py-3 text-gray-500">Betöltés...</li>
      </ul>
    );
  }

  // Ha nincs ajánlott könyv (pl. üres adatbázis esetén)
  if (books.length === 0) {
    return (
      <ul>
        <li className="py-3 text-gray-500">Még nincsenek ajánlott könyvek</li>
      </ul>
    );
  }

  // Ha van adat, akkor listázzuk ki a könyveket
  return (
    <ul>
      {books.map((book) => (
        <li key={book.id} className="py-3 flex flex-col gap-1">
          {/* Könyv címe -> kattintható, átvisz a könyv oldalára */}
          <strong className="text-blue-700 font-semibold text-base">
            <Link
              to={`/book/${book.id}`}
              className="hover:underline hover:text-blue-900 transition-colors"
            >
              {book.title}
            </Link>
          </strong>

          {/* Könyv szerzője */}
          <span className="text-gray-500 text-sm">{book.author}</span>
        </li>
      ))}
    </ul>
  );
}

export default RecommendedBooks;