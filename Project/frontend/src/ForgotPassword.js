import React, { useState } from 'react';

export default function ForgotPassword() {

  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
  const response = await fetch('http://localhost/BookBase-Dev/Project/backend/forgotpassword.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        
        const result = await response.json();
        
        if (result.success) {
        setMessage(result.message);
        // Átirányítás a jelszó módosítás oldalra, token átadással
        setTimeout(() => {
          window.location.href = result.redirect_url || (`/reset-password?token=${result.token}`);
        }, 2000);
        } else {
            setMessage(result.message || result.error || 'Hiba történt');
        }
    } catch (error) {
        setMessage('Hálózati hiba történt.');
    }
};

  return (
    <form onSubmit={handleSubmit} autoComplete="on" className="w-full max-w-md mx-auto mt-16 flex flex-col items-center bg-white/90 rounded-3xl shadow-2xl p-8 gap-6 border-2 border-blue-300 backdrop-blur-lg">
      <h2 className="text-3xl font-black text-blue-700 mb-2 tracking-tight drop-shadow-lg">Elfelejtett jelszó</h2>
      <div className="w-full flex flex-col gap-4">
        <input
          name="email"
          type="email"
          placeholder="Email cím"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md placeholder:text-blue-300 transition-all duration-200"
        />
      </div>
      <button type="submit" className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors">Jelszó visszaállítása</button>
      {message && (
        <div className="mt-4 text-blue-700 font-semibold text-center bg-blue-50 rounded p-2 w-full">{message}</div>
      )}
    </form>
  );
}
