import React from 'react';
import { Link } from 'react-router-dom';

const newBooks = [
  { id: '20', title: 'A láthatatlan ember', author: 'H.G. Wells' },
  { id: '12', title: 'Az arany ember', author: 'Jókai Mór' },
  { id: '21', title: 'A szolgálólány meséje', author: 'Margaret Atwood' },
  { id: '22', title: 'A nagy Gatsby', author: 'F. Scott Fitzgerald' },
];

function NewBooks() {
  return (
    <ul>
      {newBooks.map((book) => (
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

export default NewBooks; 