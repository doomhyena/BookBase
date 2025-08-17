import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function RecentlyRead() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyRead = async () => {
      try {
        // Mivel nincs specifikus API végpont a legutóbb olvasott könyvekhez,
        // használjuk a véletlenszerű könyveket placeholder-ként
        const response = await fetch('/api/books.php?action=getRandom&limit=4');
        const data = await response.json();
        
        if (data.success) {
          setBooks(data.books);
        }
      } catch (error) {
        console.error('Hiba a legutóbb olvasott könyvek betöltésekor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentlyRead();
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
        <li className="py-3 text-gray-500">Még nincsenek olvasási előzmények</li>
      </ul>
    );
  }

  return (
    <ul>
      {books.map((book) => (
        <li key={book.id} className="py-3 flex flex-col gap-1">
          <strong className="text-blue-700 font-semibold text-base">
            <Link to={`/book/${book.id}`} className="hover:underline hover:text-blue-900 transition-colors">{book.title}</Link>
          </strong>
          <span className="text-gray-500 text-sm">{book.author}</span>
        </li>
      ))}
    </ul>
  );
}

export default RecentlyRead; 