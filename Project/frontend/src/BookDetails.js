import React from 'react';
import { useParams } from 'react-router-dom';


// Mock adatbázis
const books = [
  {
    id: '1',
    title: 'A Gyűrűk Ura',
    author: 'J.R.R. Tolkien',
    volume: '1-3',
    publishDate: '1954',
    translator: 'Göncz Árpád',
    publisher: 'Európa Könyvkiadó',
    uploadedAt: '2024-05-01',
    coverUrl: 'https://m.media-amazon.com/images/I/81t2CVWEsUL.jpg',
  },
  {
    id: '2',
    title: '1984',
    author: 'George Orwell',
    volume: '',
    publishDate: '1949',
    translator: 'Szíjgyártó László',
    publisher: 'Európa Könyvkiadó',
    uploadedAt: '2024-05-02',
    coverUrl: 'https://m.media-amazon.com/images/I/71kxa1-0mfL.jpg',
  },
  // ... további könyvek
];

const placeholderCover = 'https://via.placeholder.com/160x240?text=No+Cover';

function BookDetails() {
  const { id } = useParams();
  const book = books.find(b => b.id === id);

  if (!book) {
    return (
      <>
        <div className="flex-shrink-0 w-40 h-60 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mx-auto mt-10">
          <img src={placeholderCover} alt="Nincs borító" className="object-cover w-full h-full" />
        </div>
        <div className="flex flex-col gap-2 justify-center max-w-2xl mx-auto mt-4 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-blue-700 mb-2">—</h2>
          <div><b>Szerző:</b> —</div>
          <div><b>Kötetszám:</b> —</div>
          <div><b>Kiadás dátuma:</b> —</div>
          <div><b>Fordító:</b> —</div>
          <div><b>Kiadó:</b> —</div>
          <div><b>Feltöltés dátuma:</b> —</div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="flex-shrink-0 w-40 h-60 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden mx-auto mt-10">
        <img src={book.coverUrl} alt={book.title + ' borító'} className="object-cover w-full h-full" />
      </div>
      <div className="flex flex-col gap-2 justify-center max-w-2xl mx-auto mt-4 bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-xl font-bold text-blue-700 mb-2">{book.title}</h2>
        <div><b>Szerző:</b> {book.author}</div>
        {book.volume && <div><b>Kötetszám:</b> {book.volume}</div>}
        <div><b>Kiadás dátuma:</b> {book.publishDate}</div>
        {book.translator && <div><b>Fordító:</b> {book.translator}</div>}
        <div><b>Kiadó:</b> {book.publisher}</div>
        <div><b>Feltöltés dátuma:</b> {book.uploadedAt}</div>
      </div>
    </>
  );
}

export default BookDetails; 