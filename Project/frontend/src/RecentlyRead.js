import React from 'react';
import { Link } from 'react-router-dom';

const recentlyReadBooks = [
  { id: '2', title: 'A Gyűrűk Ura', author: 'J.R.R. Tolkien' },
  { id: '5', title: '1984', author: 'George Orwell' },
  { id: '6', title: 'A Pál utcai fiúk', author: 'Molnár Ferenc' },
  { id: '7', title: 'Az ember tragédiája', author: 'Madách Imre' },
];

function RecentlyRead() {
  return (
  <ul>
    {recentlyReadBooks.map((book) => (
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