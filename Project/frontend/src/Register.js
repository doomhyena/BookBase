// React hook-ok és komponensek importálása
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  // Form state: a felhasználónév, email és jelszó tárolására
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  // Message: visszajelző üzenet a felhasználónak (hiba vagy siker)
  const [message, setMessage] = useState('');

  // Loading: betöltési állapot (pl. gomb disable, animáció)
  const [loading, setLoading] = useState(false);

  // navigate: átirányítás React Routerrel
  const navigate = useNavigate();

  // Input változás kezelése: mindig frissítjük a form state-et
  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Form elküldésekor fut le
  const handleSubmit = async e => {
    e.preventDefault(); // alap viselkedést (oldal újratöltés) tiltjuk
    setMessage('');     // töröljük az előző üzenetet
    setLoading(true);   // loading állapot -> gomb disable + "Regisztráció..."

    try {
      // POST kérés küldése a backend felé
      const res = await fetch('http://localhost/BookBase-Dev/Project/backend/reg.php?api=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // JSON formátum
        body: JSON.stringify(form) // form state átküldése
      });

      // Backend válasz JSON formátumban
      const data = await res.json();
      
      if (data.success) {
        // Ha a regisztráció sikeres
        setMessage(data.message || 'Sikeres regisztráció!');

        // 2 másodperc múlva átirányít a login oldalra
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Ha a backend hibát ad
        setMessage(data.message || 'Hiba történt a regisztráció során!');
      }
    } catch (error) {
      // Ha hálózati hiba van (pl. nem fut a szerver)
      setMessage('Hálózati hiba történt!');
    } finally {
      // Mindig lefut -> loading visszaáll false-ra
      setLoading(false);
    }
  };

  return (
      // Regisztrációs form UI
      <form 
        onSubmit={handleSubmit} 
        autoComplete="on" 
        className="w-full max-w-md mx-auto mt-16 flex flex-col items-center 
                   bg-white/90 rounded-3xl shadow-2xl p-8 gap-6 
                   border-2 border-blue-300 backdrop-blur-lg"
      >
        {/* Cím */}
        <h2 className="text-3xl font-black text-blue-700 mb-2 tracking-tight drop-shadow-lg">
          Regisztráció
        </h2>

        {/* Input mezők */}
        <div className="w-full flex flex-col gap-4">
          {/* Felhasználónév */}
          <input 
            name="username" 
            placeholder="Felhasználónév" 
            value={form.username} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 
                       focus:border-blue-600 focus:ring-2 focus:ring-blue-200 
                       outline-none text-base bg-blue-50/80 shadow-md 
                       placeholder:text-blue-300 transition-all duration-200" 
          />

          {/* Email */}
          <input 
            name="email" 
            type="email" 
            placeholder="Email" 
            value={form.email} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 
                       focus:border-blue-600 focus:ring-2 focus:ring-blue-200 
                       outline-none text-base bg-blue-50/80 shadow-md 
                       placeholder:text-blue-300 transition-all duration-200" 
          />

          {/* Jelszó */}
          <input 
            name="password" 
            type="password" 
            placeholder="Jelszó" 
            value={form.password} 
            onChange={handleChange} 
            required 
            className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 
                       focus:border-blue-600 focus:ring-2 focus:ring-blue-200 
                       outline-none text-base bg-blue-50/80 shadow-md 
                       placeholder:text-blue-300 transition-all duration-200" 
          />
        </div>

        {/* Regisztráció gomb */}
        <button 
          type="submit" 
          disabled={loading} // ha loading true, a gomb le van tiltva
          className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 
                     disabled:bg-blue-400 text-white font-bold rounded-lg 
                     shadow transition-colors"
        >
          {loading ? 'Regisztráció...' : 'Regisztráció'}
        </button>

        {/* Üzenet (hiba vagy siker) */}
        {message && (
          <div 
            className={`mt-4 font-semibold text-center rounded p-2 w-full ${
              message.includes('Sikeres') 
                ? 'bg-green-100 text-green-700' // siker: zöld háttér
                : 'bg-red-100 text-red-700'     // hiba: piros háttér
            }`}
          >
            {message}
          </div>
        )}

        {/* Link a login oldalra */}
        <div className="w-full text-center mt-2 text-sm text-gray-600">
          Van már fiókod?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">
            Jelentkezz be itt!
          </Link>
        </div>
      </form>
  );
}
