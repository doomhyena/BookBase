import React, { useState } from 'react';

// ProfilKepUpload komponens
// Props:
//   - currentPicture: a jelenlegi profilkép (ha van)
//   - onUpload: callback, amit akkor hív meg, ha új fájl kerül feltöltésre
//   - noForm: ha true → nincs külön submit gomb, azonnali előnézet + fájl kiválasztás
export default function ProfilKepUpload({ currentPicture, onUpload, noForm = false }) {
  // preview -> az aktuális vagy újonnan kiválasztott kép előnézete
  const [preview, setPreview] = useState(
    currentPicture
      ? currentPicture.startsWith('http')
        ? currentPicture // ha teljes URL, azt használjuk
        : `/BookBase-Dev/Project/backend/users/${window?.userName || ''}/${currentPicture}` // különben a backend mappából
      : null // ha nincs kép
  );

  // file -> a kiválasztott kép fájlja
  const [file, setFile] = useState(null);

  // message -> üzenetek megjelenítésére (pl. hiba vagy siker)
  const [message, setMessage] = useState('');

  // Fájl kiválasztás kezelése
  const handleFileChange = (e) => {
    const selected = e.target.files[0]; // az első kiválasztott fájl
    if (selected) {
      // ellenőrizzük, hogy kép-e
      if (!selected.type.startsWith('image/')) {
        setMessage('Csak képfájl tölthető fel!');
        return;
      }
      setFile(selected); // eltároljuk a fájlt
      setPreview(URL.createObjectURL(selected)); // előnézetet generálunk
      setMessage('');
      onUpload && onUpload(selected); // ha van onUpload callback → átadjuk a fájlt a szülő komponensnek
    }
  };

  // 🔹 Ha noForm = true → nincs submit gomb, csak preview + input mező
  if (noForm) {
    return (
      <div className="flex flex-col items-center gap-4">
        {/* Profilkép kör alakban */}
        <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 shadow-lg flex items-center justify-center">
          {preview ? (
            // ha van előnézet → mutatjuk a képet
            <img
              src={preview}
              alt="Profilkép" 
              className="object-cover rounded-full"
              style={{ width: '128px', height: '128px', objectFit: 'cover', borderRadius: '50%' }}
            />
          ) : (
            // ha nincs kép → szöveges "Avatar"
            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
              Avatar
            </div>
          )}
        </div>
        {/* Fájl kiválasztó mező */}
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {/* Hiba vagy státusz üzenet */}
        {message && <div className="text-red-600 font-semibold">{message}</div>}
      </div>
    );
  }

  // 🔹 Ha noForm = false → külön feltöltés gombbal ellátott form
  const handleUpload = async (e) => {
    e.preventDefault(); // megakadályozzuk az oldal újratöltését
    if (!file) {
      setMessage('Válassz egy képfájlt!');
      return;
    }

    // FormData → így tudunk fájlokat küldeni POST-ban
    const formData = new FormData();
    formData.append('profile_picture', file);

    try {
      // fetch → POST kérés a backend felé
      const res = await fetch('http://localhost/BookBase-Dev/Project/backend/userprofile.php?action=updateProfile', {
        method: 'POST',
        credentials: 'include', // cookie küldése (pl. user session miatt)
        body: formData
      });

      // válasz feldolgozása JSON-ként
      const data = await res.json();
      setMessage(data.message);

      // ha sikeres a feltöltés → frissítjük a szülőben a képet
      if (data.success) {
        onUpload && onUpload(data.user.profile_picture);
      }
    } catch (err) {
      setMessage('Hiba történt a feltöltéskor!');
    }
  };

  return (
    // Form a kép feltöltéséhez
    <form onSubmit={handleUpload} className="flex flex-col items-center gap-4">
      {/* Profilkép előnézet */}
      <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 shadow-lg flex items-center justify-center">
        {preview ? (
          <img src={preview} alt="Előnézet" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-xl">
            Avatar
          </div>
        )}
      </div>

      {/* Fájl kiválasztó */}
      <input type="file" accept="image/*" onChange={handleFileChange} />

      {/* Feltöltés gomb */}
      <button
        type="submit"
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-xl"
      >
        Feltöltés
      </button>

      {/* Üzenet kiírása */}
      {message && (
        <div
          className={`p-2 rounded ${
            message.includes('sikeresen')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
}
