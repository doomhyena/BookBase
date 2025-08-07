import React from 'react';
import { Link } from 'react-router-dom';

const top20Books = [
  { id: '1', title: 'Harry Potter és a bölcsek köve', author: 'J.K. Rowling' },
  { id: '2', title: 'A Gyűrűk Ura', author: 'J.R.R. Tolkien' },
  { id: '3', title: 'A Da Vinci-kód', author: 'Dan Brown' },
  { id: '4', title: 'Az alkimista', author: 'Paulo Coelho' },
  { id: '5', title: '1984', author: 'George Orwell' },
  { id: '6', title: 'A kis herceg', author: 'Antoine de Saint-Exupéry' },
  { id: '7', title: 'A szél árnyéka', author: 'Carlos Ruiz Zafón' },
  { id: '8', title: 'Az időutazó felesége', author: 'Audrey Niffenegger' },
  { id: '9', title: 'A szürke ötven árnyalata', author: 'E.L. James' },
  { id: '10', title: 'A Hobbit', author: 'J.R.R. Tolkien' },
  { id: '11', title: 'Az elveszett jelkép', author: 'Dan Brown' },
  { id: '12', title: 'Az arany ember', author: 'Jókai Mór' }
];


function Top20List() {
  return (
      <ul>
        {top20Books.map((book) => (
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

export default Top20List;
