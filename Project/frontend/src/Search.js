import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Search() {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/books.php?action=search&q=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setBooks(data.books);
      } else {
        setBooks([]);
      }
      setSearched(true);
    } catch (error) {
      console.error('Hiba a keresés során:', error);
      setBooks([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-2 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-blue-700">Könyv keresése</h1>
        
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4 max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
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

        {searched && (
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6 text-blue-700">
              Keresési eredmények ({books.length} találat)
            </h2>
            
            {books.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {books.map((book) => (
                  <div key={book.id} className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 hover:shadow-xl transition-shadow">
                    {book.cover ? (
                      <img 
                        src={book.cover} 
                        alt={`${book.title} borítókép`} 
                        className="w-full h-48 object-cover rounded-xl mb-4"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                        <span className="text-gray-500">Nincs borítókép</span>
                      </div>
                    )}
                    
                    <h3 className="text-lg font-bold text-blue-700 mb-2 line-clamp-2">
                      {book.title}
                    </h3>
                    <p className="text-gray-600 mb-3">Szerző: {book.author}</p>
                    {book.summary && (
                      <p className="text-sm text-gray-500 line-clamp-3 mb-4">
                        {book.summary}
                      </p>
                    )}
                    <Link
                      to={`/book/${book.id}`}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                    >
                      Részletek
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg mb-2">
                  Nem találtunk könyvet a "{query}" keresési feltétellel.
                </p>
                <p className="text-gray-400">
                  Próbáld meg másik kulcsszóval keresni.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}