import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch(`/api/profile.php?action=getById&id=${id}`);
        const data = await response.json();
        
        if (data.success) {
          setUser(data.user);
          setForm({
            lastname: data.user.lastname || '',
            firstname: data.user.firstname || '',
            email: data.user.email || '',
            birthdate: data.user.birthdate || '',
            gender: data.user.gender || ''
          });
        }
      } catch (error) {
        console.error('Hiba a felhasználói profil betöltésekor:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    
    try {
      const response = await fetch('/api/profile.php?action=update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      const data = await response.json();
      setMessage(data.message);
      
      if (data.success) {
        setEditing(false);
        // Frissítjük a felhasználói adatokat
        setUser({ ...user, ...form });
      }
    } catch (error) {
      console.error('Hiba a profil frissítésekor:', error);
      setMessage('Hiba történt a profil frissítésekor!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-2 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-2xl text-blue-700">Betöltés...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-2 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-2xl text-red-700 mb-4">A felhasználó nem található!</div>
          <Link to="/" className="text-blue-600 hover:underline">Vissza a főoldalra</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-2 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 mb-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold text-blue-700">
              {user.firstname} {user.lastname} profilja
            </h1>
            <button
              onClick={() => setEditing(!editing)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
            >
              {editing ? 'Mégse' : 'Szerkesztés'}
            </button>
          </div>

          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Vezetéknév</label>
                  <input
                    type="text"
                    name="lastname"
                    value={form.lastname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Keresztnév</label>
                  <input
                    type="text"
                    name="firstname"
                    value={form.firstname}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email cím</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Születési dátum</label>
                  <input
                    type="date"
                    name="birthdate"
                    value={form.birthdate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nem</label>
                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                    required
                  >
                    <option value="">Válassz...</option>
                    <option value="ferfi">Férfi</option>
                    <option value="no">Nő</option>
                    <option value="egyeb">Egyéb</option>
                  </select>
                </div>
              </div>
              
              {message && (
                <div className={`p-4 rounded-lg ${
                  message.includes('sikeresen') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {message}
                </div>
              )}
              
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Mentés
                </button>
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Mégse
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Alapadatok</h3>
                <div className="space-y-3">
                  <div><strong>Felhasználónév:</strong> {user.username}</div>
                  <div><strong>Email:</strong> {user.email}</div>
                  <div><strong>Születési dátum:</strong> {user.birthdate}</div>
                  <div><strong>Nem:</strong> {user.gender}</div>
                  <div><strong>Regisztráció:</strong> {new Date(user.registration_date).toLocaleDateString('hu-HU')}</div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Statisztikák</h3>
                <div className="space-y-3">
                  <div><strong>Legutóbb olvasott könyvek:</strong> {user.recentlyRead?.length || 0}</div>
                  <div><strong>Kedvenc könyvek:</strong> {user.favorites?.length || 0}</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Legutóbb olvasott könyvek */}
        {user.recentlyRead && user.recentlyRead.length > 0 && (
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Legutóbb olvasott könyvek</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.recentlyRead.map((book) => (
                <div key={book.id} className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                  {book.cover ? (
                    <img src={book.cover} alt={`${book.title} borítókép`} className="w-full h-32 object-cover rounded-xl mb-4" />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                      <span className="text-gray-500">Nincs borítókép</span>
                    </div>
                  )}
                  <h3 className="font-bold text-blue-700 mb-2">{book.title}</h3>
                  <p className="text-gray-600 text-sm mb-2">{book.author}</p>
                  <p className="text-gray-400 text-xs">{new Date(book.read_date).toLocaleDateString('hu-HU')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kedvenc könyvek */}
        {user.favorites && user.favorites.length > 0 && (
          <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-blue-700 mb-6">Kedvenc könyvek</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.favorites.map((book) => (
                <div key={book.id} className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100">
                  {book.cover ? (
                    <img src={book.cover} alt={`${book.title} borítókép`} className="w-full h-32 object-cover rounded-xl mb-4" />
                  ) : (
                    <div className="w-full h-32 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                      <span className="text-gray-500">Nincs borítókép</span>
                    </div>
                  )}
                  <h3 className="font-bold text-blue-700 mb-2">{book.title}</h3>
                  <p className="text-gray-600 text-sm">{book.author}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors">
            Vissza a főoldalra
          </Link>
        </div>
      </div>
    </div>
  );
}