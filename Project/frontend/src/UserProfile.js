import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ProfilKepUpload from './ProfilKepUpload';

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState('');
  const [file, setFile] = useState(null);

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
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUserProfile();
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
          profile_picture: data.user.profile_picture
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-4 md:px-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-8">

        {/* Fejléc */}
        <div className="flex flex-col items-center gap-4">
          <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden shadow-lg">
            {user.profile_picture ? (
              <img src={user.profile_picture} alt={user.username} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">Avatar</div>
            )}
          </div>
          <h1 className="text-4xl font-bold text-blue-700">{user.username}</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setEditing(!editing)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-xl transition">
              {editing ? 'Mégse' : 'Szerkesztés'}
            </button>
          </div>
        </div>

        {/* Alapadatok & form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          {editing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Profilkép feltöltés */}
              <ProfilKepUpload
                currentPicture={user.profile_picture}
                onUpload={(selectedFile, previewUrl) => setFile(selectedFile)}
              />

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

              {message && <div className={`p-4 rounded-lg ${message.includes('sikeresen') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition">Mentés</button>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Születési dátum:</strong> {user.birthdate}</div>
                <div><strong>Nem:</strong> {user.gender}</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
