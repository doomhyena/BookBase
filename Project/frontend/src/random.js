import React, { useEffect, useState } from 'react';

const Random = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRandom = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/books.php?action=getRandom&limit=1');
      const data = await response.json();
      if (data.success && data.books.length > 0) {
        setBook(data.books[0]);
      } else {
        setBook(null);
      }
    } catch (e) {
      console.error('Hiba a véletlenszerű könyv betöltésekor:', e);
      setBook(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandom();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-xl mx-auto mt-10">
      <h2 className="text-2xl font-bold text-blue-700 mb-6">Véletlen könyv</h2>
      {loading && <div className="text-blue-600 font-semibold mb-4">Betöltés...</div>}
      {!loading && book && (
        <div className="mb-4">
          <h3 className="text-lg font-bold text-blue-700 mb-2">{book.title}</h3>
          <p><b>Író:</b> {book.author}</p>
          {book.summary && <p><b>Leírás:</b> {book.summary}</p>}
          <button onClick={fetchRandom} className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors">Másik könyv</button>
        </div>
      )}
      {!loading && !book && <div className="text-gray-500">Nincs elérhető könyv.</div>}
    </div>
  );
};

export default Random;
