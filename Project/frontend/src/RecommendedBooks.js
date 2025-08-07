import React from 'react';
import { Link } from 'react-router-dom';

const recommendedBooks = [
  { id: '8', title: 'A kis herceg', author: 'Antoine de Saint-Exupéry' },
  { id: '9', title: 'Az öreg halász és a tenger', author: 'Ernest Hemingway' },
  { id: '10', title: 'Bűn és bűnhődés', author: 'Fjodor Dosztojevszkij' },
  { id: '11', title: 'A Mester és Margarita', author: 'Mihail Bulgakov' },
  { id: '12', title: 'A katedrális', author: 'Ken Follett' },
  { id: '13', title: 'A három test problémája', author: 'Cixin Liu' },
  { id: '14', title: 'A nevem Piros', author: 'Orhan Pamuk' },
  { id: '15', title: 'A szél árnyéka', author: 'Carlos Ruiz Zafón' },
  { id: '16', title: 'A titkos kert', author: 'Frances Hodgson Burnett' },
  { id: '17', title: 'A vakond és a hóember', author: 'Zdeněk Miler' },
  { id: '18', title: 'A varázshegy', author: 'Thomas Mann' },
  { id: '19', title: 'A végtelen történet', author: 'Michael Ende' },
];

function RecommendedBooks() {
  return (
    <ul>
      {recommendedBooks.map((book) => (
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