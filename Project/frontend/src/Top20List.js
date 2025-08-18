import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost/BookBase-Dev/Project/backend';

// fetchTop20List példa
export async function fetchTop20List() {
  try {
    const res = await fetch(`${API_BASE}/top20list.php`);
    if (!res.ok) throw new Error('A szerver nem elérhető vagy hibás választ adott!');
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: 'A szerver nem elérhető vagy hibás választ adott!' };
  }
}

function Top20List() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTop20List = async () => {
      try {
  const res = await fetch('http://localhost/BookBase-Dev/Project/backend/top20list.php', { credentials: 'include' });
        if (!res.ok) throw new Error('A szerver nem elérhető vagy hibás választ adott!');
        const data = await res.json();

        if (data.success) {
          setBooks(data.books);
        }
      } catch (error) {
        console.error('Hiba a top 20 könyvek betöltésekor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTop20List();
  }, []);

  if (loading) {
    return (
      <ul>
        <li className="py-3 text-gray-500">Betöltés...</li>
      </ul>
    );
  }

  if (books.length === 0) {
    return (
      <ul>
        <li className="py-3 text-gray-500">Még nincsenek értékelések</li>
      </ul>
    );
  }

  return (
    <ul>
      {books.slice(0, 5).map((book, index) => (
        <li key={book.id} className="py-3 flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-yellow-500 font-bold text-sm">#{index + 1}</span>
            <strong className="text-blue-700 font-semibold text-base">
              <Link to={`/book/${book.id}`} className="hover:underline hover:text-blue-900 transition-colors">{book.title}</Link>
            </strong>
          </div>
          <span className="text-gray-500 text-sm">{book.author}</span>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>★ {book.atlag_ertekeles}/5</span>
            <span>({book.ertekelesek_szama} értékelés)</span>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default Top20List;
