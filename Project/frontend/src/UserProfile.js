import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfilKepUpload from './ProfilePictureUpload';


export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [customCss, setCustomCss] = useState('');
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(
          `http://localhost/BookBase-Dev/Project/backend/userprofile.php?action=getById&id=${id}`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error('A szerver nem elérhető!');
        const data = await res.json();
        if (data.success) {
          setUser(data.user);
          setForm({
            email: data.user.email || '',
            birthdate: data.user.birthdate || '',
            gender: data.user.gender || ''
          });
          setCustomCss(data.user.custom_css || '');
          setIsOwner(!!data.owner);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
    // Frissítés navigációnál is
    window.addEventListener('popstate', fetchUserProfile);
    return () => window.removeEventListener('popstate', fetchUserProfile);
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    const formData = new FormData();
    formData.append('email', form.email);
    formData.append('birthdate', form.birthdate);
    formData.append('gender', form.gender);
  if (file) formData.append('profile_picture', file);
  formData.append('custom_css', customCss);

    try {
      const res = await fetch(
        `http://localhost/BookBase-Dev/Project/backend/userprofile.php?action=updateProfile`,
        {
          method: 'POST',
          credentials: 'include',
          body: formData
        }
      );
      const data = await res.json();
      setMessage(data.message);

      if (data.success) {
        setUser(prev => ({
          ...prev,
          email: data.user.email,
          birthdate: data.user.birthdate,
          gender: data.user.gender,
          profile_picture: data.user.profile_picture,
          custom_css: data.user.custom_css
        }));
        setEditing(false);
        setFile(null);
      }
    } catch (error) {
      console.error(error);
      setMessage('Hiba történt a profil frissítésekor!');
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200">
        <div className="text-2xl font-semibold text-blue-700">Betöltés...</div>
      </div>
    );

  if (!user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200">
        <div className="text-2xl text-red-700 mb-4">A felhasználó nem található!</div>
        <Link to="/" className="text-blue-600 hover:underline">Vissza a főoldalra</Link>
      </div>
    );

  return (
  <div id="profile-page" className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-4 md:px-8">
    {customCss && (
      <style>{`#profile-page { } ${customCss.replace(/(^|\})\s*([^@])/g, '$1 #profile-page $2')}`}</style>
    )}
    
    <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-8">
        {/* Fejléc */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden shadow-lg flex items-center justify-center">
            {user.profile_picture ? (
            <img 
                src={user.profile_picture_url || "/placeholder.png"} 
                alt="Profilkép" 
                className="object-cover rounded-full"
                style={{ width: '128px', height: '128px', objectFit: 'cover', borderRadius: '50%' }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">Avatar</div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-blue-700">{user.username}</h1>
          {isOwner && (
            <div className="flex gap-4">
              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition">
                  Szerkesztés
                </button>
              ) : (
                <button
                  onClick={() => setEditing(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-xl transition">
                  Mégse
                </button>
              )}
            </div>
          )}
        </div>

        {/* Alapadatok & form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profilkép feltöltés */}
              <div className="mb-6">
                <ProfilKepUpload
                  currentPicture={user.profile_picture ? (user.profile_picture.startsWith('http') ? user.profile_picture : `/BookBase-Dev/Project/backend/users/${user.username}/${user.profile_picture}`) : null}
                  onUpload={file => setFile(file)}
                  noForm={true}
                />
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Email cím</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Születési dátum</label>
                  <input type="date" name="birthdate" value={form.birthdate} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none"/>
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">Nem</label>
                  <select name="gender" value={form.gender} onChange={handleChange} className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none">
                    <option value="">Válassz...</option>
                    <option value="ferfi">Férfi</option>
                    <option value="no">Nő</option>
                    <option value="egyeb">Egyéb</option>
                  </select>
                </div>
              </div>
              {/* Egyedi CSS szerkesztő */}
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">Egyedi CSS a profilodhoz</label>
                <textarea
                  value={customCss}
                  onChange={e => setCustomCss(e.target.value)}
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none font-mono text-sm"
                  placeholder={"Pl. .profile-title { color: red; }"}
                />
                <div className="text-xs text-gray-500 mt-1">Csak a saját profilodra érvényes. Vigyázz, mit írsz be!</div>
              </div>
              {message && <div className={`p-4 rounded-lg ${message.includes('sikeresen') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
              <div className="flex justify-end w-full mt-6">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl"
                >
                  Mentés
                </button>                
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Születési dátum:</strong> {user.birthdate}</div>
                <div><strong>Nem:</strong> {user.gender}</div>
              </div>
              {/* Legutóbb olvasott könyvek státusszal */}
              {user.recentlyRead && user.recentlyRead.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200 rounded-2xl p-6 shadow-lg">
                  <h3 className="text-2xl font-extrabold mb-4 text-blue-700 tracking-tight drop-shadow">Legutóbb olvasott könyvek</h3>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {user.recentlyRead.map(book => (
                      <li key={book.id} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow hover:scale-[1.02] transition-transform">
                        {book.cover && (
                          <img src={book.cover} alt={book.title} className="w-14 h-20 object-cover rounded-lg border-2 border-blue-200 shadow" />
                        )}
                        <div className="flex-1">
                          <div className="font-bold text-blue-700 text-lg leading-tight mb-1">{book.title}</div>
                          <div className="text-gray-500 text-sm mb-2">{book.author}</div>
                          <div className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold shadow">
                            Státusz: <span className="font-bold">{book.status || 'Nincs megadva'}</span>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    {/* Egyedi CSS alkalmazása csak a saját profilon */}
    {isOwner && customCss && (
      <style>{customCss}</style>
    )}
    </div>
  );
}
