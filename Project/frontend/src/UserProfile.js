import React from 'react';
import { useParams } from 'react-router-dom';


const users = [
  {
    id: '1',
    username: 'Anna123',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    birthday: '2001-04-12',
    bio: 'Könyvmoly, fantasy rajongó, Tolkien fan.',
    status: 'online',
  },
  {
    id: '2',
    username: 'BelaTheReader',
    avatar: '',
    birthday: '',
    bio: '',
    status: 'offline',
  },
];

const placeholderAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

function UserProfile() {
  const { id } = useParams();
  const user = users.find(u => u.id === id);

  // Demo data for recently read and favorites
  const recentlyRead = [
    { id: '101', title: 'A Gyűrűk Ura', author: 'J.R.R. Tolkien', cover: 'https://covers.openlibrary.org/b/id/8231856-L.jpg', date: '2025-07-20' },
    { id: '102', title: 'Harry Potter', author: 'J.K. Rowling', cover: 'https://covers.openlibrary.org/b/id/7984916-L.jpg', date: '2025-07-10' },
  ];
  const favorites = [
    { id: '201', title: 'Az útvesztő', author: 'James Dashner', cover: 'https://covers.openlibrary.org/b/id/8107896-L.jpg' },
    { id: '202', title: 'A szolgálólány meséje', author: 'Margaret Atwood', cover: 'https://covers.openlibrary.org/b/id/8228691-L.jpg' },
  ];

  return (
    <section className="flex justify-center items-center min-h-[40vh]">
      <div className={`bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-8 items-center w-full max-w-xl ${user?.status === 'online' ? 'border-2 border-green-400' : 'border border-gray-200'}`}>
        <div className="flex flex-col md:flex-row gap-8 items-center w-full">
          <div className="relative flex flex-col items-center">
            <img src={user?.avatar || placeholderAvatar} alt="Profilkép" className="w-28 h-28 rounded-full object-cover border-4 border-blue-200" />
            <span className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${user?.status === 'online' ? 'bg-green-400' : 'bg-gray-400'}`}></span>
          </div>
          <div className="flex flex-col gap-2 w-full">
            <div className="text-xl font-bold text-blue-700">{user?.username || 'Névtelen'}</div>
            <div><b>Születésnap:</b> {user?.birthday || '—'}</div>
            <div><b>Bio:</b> {user?.bio || 'Nincs bemutatkozás'}</div>
            <div><b>Státusz:</b> <span className={user?.status === 'online' ? 'text-green-500' : 'text-gray-500'}>{user?.status || '—'}</span></div>
          </div>
        </div>

        {/* Recently Read Section */}
        <div className="w-full mt-4">
          <h3 className="text-lg font-bold text-blue-600 mb-2">Legutóbb olvasott könyvek</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {recentlyRead.length === 0 ? (
              <span className="text-gray-400">Nincs adat</span>
            ) : recentlyRead.map(book => (
              <div key={book.id} className="min-w-[120px] bg-blue-50 rounded-lg shadow p-2 flex flex-col items-center">
                <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded mb-1" />
                <div className="text-sm font-semibold text-blue-700 text-center">
                  <a href={`/book/${book.id}`} className="hover:underline">{book.title}</a>
                </div>
                <div className="text-xs text-gray-500">{book.author}</div>
                <div className="text-xs text-gray-400">{book.date}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Favorites Section */}
        <div className="w-full mt-4">
          <h3 className="text-lg font-bold text-blue-600 mb-2">Kedvenc könyvek</h3>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {favorites.length === 0 ? (
              <span className="text-gray-400">Nincs adat</span>
            ) : favorites.map(book => (
              <div key={book.id} className="min-w-[120px] bg-yellow-50 rounded-lg shadow p-2 flex flex-col items-center">
                <img src={book.cover} alt={book.title} className="w-16 h-24 object-cover rounded mb-1" />
                <div className="text-sm font-semibold text-yellow-700 text-center">
                  <a href={`/book/${book.id}`} className="hover:underline">{book.title}</a>
                </div>
                <div className="text-xs text-gray-500">{book.author}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Backend schema suggestion:
// GET /api/user/:id
// Response:
/*
{
  id: string,
  username: string,
  avatar: string,
  birthday: string,
  bio: string,
  status: 'online' | 'offline',
  recentlyRead: [
    { id: string, title: string, author: string, cover: string, date: string }
  ],
  favorites: [
    { id: string, title: string, author: string, cover: string }
  ]
}
*/

export default UserProfile;