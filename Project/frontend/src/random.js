import React, { useEffect, useState } from 'react';

// Backend alap URL
const API_BASE = 'http://localhost/BookBase-Dev/Project/backend';

const Random = () => {
  // books -> ide kerülnek a véletlenszerűen lekért könyvek
  // loading -> állapotjelző, hogy éppen töltés alatt vagyunk-e
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Függvény, ami lekéri a backendből a random könyveket
  const fetchRandom = async () => {
    setLoading(true); // mutatjuk, hogy most töltés alatt van
    try {
      // Lekérés a randombooks.php végpontra
      const response = await fetch(`${API_BASE}/randombooks.php`);
      if (!response.ok) throw new Error('A szerver nem elérhető vagy hibás választ adott!');

      // JSON adat átalakítása JS objektummá
      const data = await response.json();

      // Ha a backend válasza sikeres és vannak könyvek
      if (data.success && data.books.length > 0) {
        setBooks(data.books); // tároljuk az összes random könyvet
      } else {
        setBooks([]); // ha nincs könyv, ürítjük a listát
      }
    } catch (e) {
      // Hibakezelés
      console.error('Hiba a véletlenszerű könyvek betöltésekor:', e);
      setBooks([]); // üres lista hibánál
    }
    setLoading(false); // betöltés vége
  };

  // useEffect -> a komponens első betöltésekor egyszer lefut
  useEffect(() => {
    fetchRandom(); // induláskor töltse be a random könyveket
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mt-10">
      {/* Címsor */}
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Véletlen könyvek</h2>

      {/* Betöltés állapot */}
      {loading && <div className="text-blue-600 font-semibold mb-4">Betöltés...</div>}

      {/* Ha van könyv (és már nem tölt) -> kilistázzuk */}
      {!loading && books.length > 0 && (
        <div className="space-y-6">
          {books.map((book) => (
            <div key={book.id} className="border-b border-gray-200 pb-4">
              {/* Könyv címe */}
              <h3 className="text-lg font-bold text-blue-700">{book.title}</h3>

              {/* Szerző neve */}
              <p><b>Író:</b> {book.author}</p>

              {/* Rövid leírás, ha van */}
              {book.summary && <p><b>Leírás:</b> {book.summary}</p>}

              {/* Borítókép, ha van */}
              {book.cover && (
                <img
                  src={book.cover}
                  alt={book.title}
                  className="mt-2 rounded-lg shadow-md max-h-40"
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Ha nincs elérhető könyv */}
      {!loading && books.length === 0 && (
        <div className="text-gray-500">Nincs elérhető könyv.</div>
      )}

      {/* Gomb -> új véletlen könyvek betöltése */}
      <button
        onClick={fetchRandom}
        className="mt-6 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors"
      >
        Új véletlen könyvek
      </button>
    </div>
  );
};

export default Random;