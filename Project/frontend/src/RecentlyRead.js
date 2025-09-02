import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function RecentlyRead() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const userId = document.cookie.match(/id=([^;]+)/)?.[1];
    if (!userId) return setLoading(false);
    fetch(`http://localhost/BookBase-Dev/Project/backend/userprofile.php?action=getById&id=${userId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.success && data.user && data.user.recentlyRead) {
          setBooks(data.user.recentlyRead.slice(0, 5));
        }
      })
      .finally(() => setLoading(false));
  }, []);
  if (loading) {
    return (
      <ul>
        <li className="py-3 text-gray-500">Betöltés...</li>
      </ul>
    );
  }
  if (!books.length) {
    return (
      <ul>
        <li className="py-3 text-gray-500">Még nincsenek olvasási előzmények</li>
      </ul>
    );
  }
  return (
    <ul>
      {books.map(book => (
        <li key={book.id} className="py-3 flex flex-col gap-1">
          <strong className="text-blue-700 font-semibold text-base">
            <Link to={`/book/${book.id}`} className="hover:underline hover:text-blue-900 transition-colors">{book.title}</Link>
          </strong>
          <span className="text-gray-500 text-sm">{book.author}</span>
          <span className="text-sm text-blue-600">Státusz: <span className="font-bold">{book.status || 'Nincs megadva'}</span></span>
        </li>
      ))}
    </ul>
  );
}

export default RecentlyRead;