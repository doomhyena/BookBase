import React, { useState } from 'react'; // React importálása és useState hook használata

export default function ForgotPassword() {
  // useState a felhasználó email címének tárolására
  const [email, setEmail] = useState('');
  
  // useState az üzenetek (pl. hiba vagy siker) tárolására
  const [message, setMessage] = useState('');

  // Form elküldésekor futó függvény
  const handleSubmit = async (e) => {
    e.preventDefault(); //  Alapértelmezett form submit letiltása

    try {
      // POST kérés küldése a backendnek, email adatot JSON-ban
      const response = await fetch('http://localhost/BookBase-Dev/Project/backend/forgotpassword.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // JSON formátumú adatküldés
        },
        body: JSON.stringify({ email }), // Email csomagolása JSON objektumba
      });

      const result = await response.json(); // Válasz JSON-ná alakítása

      if (result.success) {
        setMessage(result.message); // Sikerüzenet megjelenítése

        // 2 másodperc múlva átirányítás a reset-password oldalra a tokennel
        setTimeout(() => {
          window.location.href = result.redirect_url || (`/reset-password?token=${result.token}`);
        }, 2000);
      } else {
        // Hiba esetén az üzenet beállítása
        setMessage(result.message || result.error || 'Hiba történt');
      }
    } catch (error) {
      // Hálózati hiba kezelése
      setMessage('Hálózati hiba történt.');
    }
  };

  // JSX visszaadása a form megjelenítéséhez
  return (
    <form 
      onSubmit={handleSubmit} // Form submit esemény kezelése
      autoComplete="on" // Böngésző autocomplete engedélyezése
      className="w-full max-w-md mx-auto mt-16 flex flex-col items-center bg-white/90 rounded-3xl shadow-2xl p-8 gap-6 border-2 border-blue-300 backdrop-blur-lg" // 🔹 TailwindCSS stílusok
    >
      <h2 className="text-3xl font-black text-blue-700 mb-2 tracking-tight drop-shadow-lg">Elfelejtett jelszó</h2>
      <div className="w-full flex flex-col gap-4">
        <input
          name="email" // Input mező neve
          type="email" // Email típus
          placeholder="Email cím" // Placeholder szöveg
          value={email} //  Bemeneti érték kötése state-hez
          onChange={e => setEmail(e.target.value)} // State frissítése írás közben
          required //  Kötelező mező
          className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md placeholder:text-blue-300 transition-all duration-200" // 🔹 TailwindCSS stílusok
        />
      </div>
      <button 
        type="submit" // Submit gomb
        className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors" // 🔹 TailwindCSS stílusok
      >
        Jelszó visszaállítása
      </button>
      {message && (
        // Üzenet megjelenítése, ha van
        <div className="mt-4 text-blue-700 font-semibold text-center bg-blue-50 rounded p-2 w-full">{message}</div>
      )}
    </form>
  );
}
