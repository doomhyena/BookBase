import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function RecentlyRead() {
  // books -> itt tároljuk a felhasználó legutóbb olvasott könyveit
  // loading -> jelzi, hogy töltés alatt vagyunk-e
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // useEffect -> komponens betöltésekor lefut
  useEffect(() => {
    // Megnézzük, hogy van-e userId cookie-ban (pl. amikor be van jelentkezve a user)
    const userId = document.cookie.match(/id=([^;]+)/)?.[1];

    // Ha nincs userId, akkor nem tudunk mit lekérdezni -> nincs olvasási előzmény
    if (!userId) return setLoading(false);

    // Lekérés a backend felé az adott user ID alapján
    fetch(`http://localhost/BookBase-Dev/Project/backend/userprofile.php?action=getById&id=${userId}`)
      .then(res => res.ok ? res.json() : null) // ha válasz OK, akkor JSON-t olvasunk ki
      .then(data => {
        // Ha van válasz, sikeres, és tartalmaz "recentlyRead" adatot
        if (data && data.success && data.user && data.user.recentlyRead) {
          // Csak az első 5 könyvet tároljuk
          setBooks(data.user.recentlyRead.slice(0, 5));
        }
      })
      .finally(() => setLoading(false)); // akkor is lefut, ha siker vagy hiba volt
  }, []); // [] -> csak egyszer fusson le

  // Ha még töltődik az adat
  if (loading) {
    return (
      <ul>
        <li className="py-3 text-gray-500">Betöltés...</li>
      </ul>
    );
  }

  // Ha nincs egyetlen könyv sem
  if (!books.length) {
    return (
      <ul>
        <li className="py-3 text-gray-500">Még nincsenek olvasási előzmények</li>
      </ul>
    );
  }

  // Ha vannak könyvek, akkor listázzuk ki
  return (
    <ul>
      {books.map(book => (
        <li key={book.id} className="py-3 flex flex-col gap-1">
          {/* Könyv címe -> kattintható, átvisz a könyv részleteire */}
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

          {/* Könyv státusza (pl. "olvasás alatt", "befejezve") */}
          <span className="text-sm text-blue-600">
            Státusz: <span className="font-bold">{book.status || 'Nincs megadva'}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default RecentlyRead;