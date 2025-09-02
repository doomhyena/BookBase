// src/Search.jsx
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost/BookBase-Dev/Project/backend';

export default function Search() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // szűrők
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('title_asc');
  const [inStock, setInStock] = useState(false);

  // fetch függvény (override lehetőséggel)
  const fetchBooks = async (override = {}) => {
    setLoading(true);
    try {
      const q = override.q ?? query;
      const cat = override.category ?? category;
      const srt = override.sort ?? sort;
      const stk = override.inStock ?? inStock;

      const params = new URLSearchParams({
        api: 'true',
        q,
        category: cat || '',
        sort: srt || 'title_asc',
        inStock: stk ? '1' : '0'
      });

      const res = await fetch(`${API_BASE}/search.php?${params.toString()}`);
      if (!res.ok) throw new Error('Hibás válasz a szervertől');
      const data = await res.json();

      if (data.success) {
        setBooks(data.books || []);
      } else {
        setBooks([]);
      }
      setSearched(true);
    } catch (err) {
      console.error('Keresési hiba:', err);
      setBooks([]);
      setSearched(true);
    } finally {
      setLoading(false);
    }
  };


  // Debounce keresés gépelés közben
  const debounceRef = useRef();
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchBooks({ q: e.target.value });
    }, 350);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    fetchBooks();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-2 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">Könyv keresése</h1>

        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Írd be a könyv címét vagy szerzőjét..."
              className="flex-1 px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-white/90 shadow-md"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow transition-colors"
            >
              {loading ? 'Keresés...' : 'Keresés'}
            </button>
          </div>
        </form>

        {/* Szűrők */}
        <div className="bg-white/90 rounded-2xl shadow-lg p-6 mb-8 flex flex-wrap gap-4 items-center justify-center">
          <select
            value={category}
            onChange={(e) => { const v = e.target.value; setCategory(v); fetchBooks({ category: v }); }}
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
          >
            <option value="">Összes kategória</option>
            <option value="Fantasy">Fantasy</option>
            <option value="Sci-Fi">Sci-Fi</option>
            <option value="Disztópia">Disztópia</option>
            <option value="Szépirodalom">Szépirodalom</option>
            <option value="Ismeretterjesztő">Ismeretterjesztő</option>
            <option value="Horror">Horror</option>
            <option value="Romantikus">Romantikus</option>
            <option value="Történelem">Történelem</option>
            <option value="Krimi">Krimi</option>
            <option value="Ifjúsági">Ifjúsági</option>
            <option value="Meseregény">Meseregény</option>
          </select>

          <select
            value={sort}
            onChange={(e) => { const v = e.target.value; setSort(v); fetchBooks({ sort: v }); }}
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm"
          >
            <option value="title_asc">Cím (A-Z)</option>
            <option value="title_desc">Cím (Z-A)</option>
            <option value="author_asc">Szerző (A-Z)</option>
            <option value="author_desc">Szerző (Z-A)</option>
            <option value="created_desc">Legújabb elöl</option>
            <option value="created_asc">Legrégebbi elöl</option>
          </select>

          {loading && <span className="text-sm text-gray-500">Betöltés…</span>}
        </div>

        {/* Eredmények */}
        {searched && (
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">Keresési eredmények ({books.length} találat)</h2>

            {books.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map(book => (
                  <div key={book.id} className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                    {book.cover ? (
                      <div className="flex justify-center mb-4">
                        <img
                          src={`http://localhost/BookBase-Dev/Project/backend/${book.cover}`}
                          alt={`${book.title} borítókép`}
                          style={{ width: '160px', height: '240px', objectFit: 'cover', borderRadius: '1rem', boxShadow: '0 4px 16px rgba(0,0,0,0.10)' }}
                          className="border border-blue-200"
                        />
                      </div>
                    ) : (
                      <div className="flex justify-center mb-4">
                        <div style={{ width: '160px', height: '240px' }} className="bg-gray-200 rounded-xl flex items-center justify-center border border-blue-100">
                          <span className="text-gray-500">Nincs borítókép</span>
                        </div>
                      </div>
                    )}
                    <h3 className="text-lg font-bold text-blue-700 mb-2 line-clamp-2">{book.title}</h3>
                    <p className="text-gray-600 mb-1">Szerző: {book.author}</p>
                    {book.category && <p className="text-sm text-gray-500 mb-3">Kategória: {book.category}</p>}
                    {book.summary && <p className="text-sm text-gray-500 line-clamp-3 mb-4">{book.summary}</p>}
                    <Link to={`/book/${book.id}`} className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors">Részletek</Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">Nem találtunk könyvet a keresési feltételek alapján.</p>
                <p className="text-gray-400">Próbáld meg más kulcsszóval vagy szűrővel.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
