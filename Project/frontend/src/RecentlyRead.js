import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost/BookBase-Dev/Project/backend';

export async function fetchRecentlyRead() {
  try {
    const res = await fetch(`${API_BASE}/recentlyread.php`);
    if (!res.ok) throw new Error('A szerver nem elérhető vagy hibás választ adott!');
    const data = await res.json();
    return data;
  } catch (error) {
    return { success: false, message: 'A szerver nem elérhető vagy hibás választ adott!' };
  }
}

// Cookie olvasó segédfüggvény
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

function RecentlyRead() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentlyReadBooks = async () => {
      try {
        const userId = getCookie('id');
  const res = await fetch(`http://localhost/BookBase-Dev/Project/backend/recentlyread.php?api=true&userId=${userId}`, { credentials: 'include' });
        if (!res.ok) throw new Error('A szerver nem elérhető vagy hibás választ adott!');
        const data = await res.json();
        if (data.success) {
          setBooks(data.books);
        } else {
          setBooks([]);
        }
      } catch (error) {
        console.error('Hiba a legutóbb olvasott könyvek betöltésekor:', error);
        setBooks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchRecentlyReadBooks();
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