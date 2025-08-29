import React, { useState } from 'react';

export default function ProfilKepUpload({ currentPicture, onUpload }) {
  const [preview, setPreview] = useState(currentPicture || null);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      if (!selected.type.startsWith('image/')) {
        setMessage('Csak képfájl tölthető fel!');
        return;
      }
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setMessage('');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Válassz egy képfájlt!');
      return;
    }

    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      const res = await fetch('http://localhost/BookBase-Dev/Project/backend/userprofile.php?action=updateProfile', {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      const data = await res.json();
      setMessage(data.message);
      if (data.success) {
        onUpload && onUpload(data.user.profile_picture);
      }
    } catch (err) {
      setMessage('Hiba történt a feltöltéskor!');
    }
  };

  return (
    <form onSubmit={handleUpload} className="flex flex-col items-center gap-4">
      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 shadow-lg">
        {preview ? (
          <img src={preview} alt="Előnézet" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
            Avatar
          </div>
        )}
      </div>
      <input type="file" accept="image/*" onChange={handleFileChange} />
      <button type="submit" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl">
        Feltöltés
      </button>
      {message && <div className={`p-2 rounded ${message.includes('sikeresen') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</div>}
    </form>
  );
}
