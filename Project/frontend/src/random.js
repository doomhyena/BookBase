import React, { useEffect, useState } from 'react';

const API_BASE = 'http://localhost/BookBase-Dev/Project/backend';


const Random = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRandom = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/randombooks.php`);
      if (!response.ok) throw new Error('A szerver nem elérhető vagy hibás választ adott!');
      const data = await response.json();

      if (data.success && data.books.length > 0) {
        setBooks(data.books); // 👉 Most az összes random könyvet eltároljuk
      } else {
        setBooks([]);
      }
    } catch (e) {
      console.error('Hiba a véletlenszerű könyvek betöltésekor:', e);
      setBooks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandom();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Véletlen könyvek</h2>
      {loading && <div className="text-blue-600 font-semibold mb-4">Betöltés...</div>}
      {!loading && books.length > 0 && (
        <div className="space-y-6">
          {books.map((book) => (
            <div key={book.id} className="border-b border-gray-200 pb-4">
              <h3 className="text-lg font-bold text-blue-700">{book.title}</h3>
              <p><b>Író:</b> {book.author}</p>
              {book.summary && <p><b>Leírás:</b> {book.summary}</p>}
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
      {!loading && books.length === 0 && (
        <div className="text-gray-500">Nincs elérhető könyv.</div>
      )}

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
