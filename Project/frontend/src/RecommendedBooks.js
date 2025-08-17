import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function RecommendedBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedBooks = async () => {
      try {
        // Mivel nincs specifikus API végpont az ajánlott könyvekhez,
        // használjuk a top 20 könyveket placeholder-ként
        const response = await fetch('/api/books.php?action=getTop20');
        const data = await response.json();
        
        if (data.success) {
          // Csak az első 11 könyvet jelenítjük meg
          setBooks(data.books.slice(0, 11));
        }
      } catch (error) {
        console.error('Hiba az ajánlott könyvek betöltésekor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendedBooks();
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
        <li className="py-3 text-gray-500">Még nincsenek ajánlott könyvek</li>
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

export default RecommendedBooks; 