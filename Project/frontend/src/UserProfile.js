import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfilKepUpload from './ProfilePictureUpload';

export default function UserProfile() {
  // URL-ből kivesszük az :id paramétert (pl. /profile/12 → id=12)
  const { id } = useParams();

  // React state-ek
  const [user, setUser] = useState(null);         // felhasználó adatai
  const [loading, setLoading] = useState(true);   // betöltés állapota (spinnerhez)
  const [editing, setEditing] = useState(false);  // szerkesztő mód be/ki
  const [form, setForm] = useState({});           // form inputok adatai
  const [customCss, setCustomCss] = useState(''); // user által beírt egyedi CSS
  const [message, setMessage] = useState('');     // visszajelzés üzenetek (siker/hiba)
  const [file, setFile] = useState(null);         // feltöltött kép fájl
  const [isOwner, setIsOwner] = useState(false);  // saját profil-e (vagy csak másét nézi)

  // Komponens betöltéskor lefut → user adatokat lekéri backendről
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
          // ha sikeres, akkor feltöltjük a state-eket a user adataival
          setUser(data.user);
          setForm({
            email: data.user.email || '',
            birthdate: data.user.birthdate || '',
            gender: data.user.gender || ''
          });
          setCustomCss(data.user.custom_css || '');
          setIsOwner(!!data.owner); // ha backend visszaadja, hogy "owner=true"
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // betöltés vége
      }
    };

    fetchUserProfile();

    // ha navigáció történik (vissza/előre gomb), frissítse újra a profilt
    window.addEventListener('popstate', fetchUserProfile);
    return () => window.removeEventListener('popstate', fetchUserProfile);
  }, [id]);

  // Input változás handler → beállítja a form state-et
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Form submit → elküldi a backendnek az új adatokat
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
        // ha siker, akkor a lokális user state-et is frissítjük
        setUser(prev => ({
          ...prev,
          email: data.user.email,
          birthdate: data.user.birthdate,
          gender: data.user.gender,
          profile_picture: data.user.profile_picture,
          custom_css: data.user.custom_css
        }));
        setEditing(false); // szerkesztő mód kikapcs
        setFile(null);     // feltöltött file törlés
      }
    } catch (error) {
      console.error(error);
      setMessage('Hiba történt a profil frissítésekor!');
    }
  };

  // Ha még tölt a backend → loading képernyő
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200">
        <div className="text-2xl font-semibold text-blue-700">Betöltés...</div>
      </div>
    );

  // Ha nincs user (pl. nem létezik ilyen ID) → hiba képernyő
  if (!user)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200">
        <div className="text-2xl text-red-700 mb-4">A felhasználó nem található!</div>
        <Link to="/" className="text-blue-600 hover:underline">Vissza a főoldalra</Link>
      </div>
    );

  return (
    <div id="profile-page" className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-4 md:px-8">

      {/* Egyedi CSS hozzáadása wrapperrel → hogy csak a profil oldalra érvényes legyen */}
      {customCss && (
        <style>{`#profile-page { } ${customCss.replace(/(^|\})\s*([^@])/g, '$1 #profile-page $2')}`}</style>
      )}
    
      {/* Fehér doboz a profil tartalomhoz */}
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-8">
        
        {/* --- FEJLÉC (profil kép + név + gombok) --- */}
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

          {/* Szerkesztés / Mégse gombok csak ha a saját profil */}
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

        {/* --- PROFIL ADATOK --- */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {editing ? (
            // Ha szerkesztő módban van → űrlap
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Profilkép feltöltés */}
              <div className="mb-6">
                <ProfilKepUpload
                  currentPicture={user.profile_picture ? (user.profile_picture.startsWith('http') ? user.profile_picture : `/BookBase-Dev/Project/backend/users/${user.username}/${user.profile_picture}`) : null}
                  onUpload={file => setFile(file)}
                  noForm={true}
                />
              </div>

              {/* Email mező */}
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

              {/* Születési dátum és nem */}
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

              {/* Egyedi CSS editor */}
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

              {/* Visszajelzés üzenet */}
              {message && <div className={`p-4 rounded-lg ${message.includes('sikeresen') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}

              {/* Mentés gomb */}
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
            // Ha nem szerkesztő módban van → sima adat megjelenítés
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Születési dátum:</strong> {user.birthdate}</div>
                <div><strong>Nem:</strong> {user.gender}</div>
              </div>

              {/* Legutóbb olvasott könyvek lista */}
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

      {/* Extra biztonsági fallback → csak saját profilnál rakjuk be a CSS-t teljesen nyersen */}
      {isOwner && customCss && (
        <style>{customCss}</style>
      )}
    </div>
  );
}