import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      const res = await fetch('http://localhost/BookBase-Dev/Project/backend/login.php?api=true', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (data.success && data.user) {
        document.cookie = `id=${data.user.id}; path=/;`;
        setMessage(data.message || 'Sikeres bejelentkezés!');
        setTimeout(() => {
          navigate(`/user/${data.user.id}`);
          window.location.reload();
        }, 1000);
      } else {
        setMessage(data.message || 'Hibás adatok!');
      }
    } catch (error) {
      setMessage('Hálózati hiba történt!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} autoComplete="on" className="w-full max-w-md mx-auto mt-16 flex flex-col items-center bg-white/90 rounded-3xl shadow-2xl p-8 gap-6 border-2 border-blue-300 backdrop-blur-lg">
      <h2 className="text-3xl font-black text-blue-700 mb-2 tracking-tight drop-shadow-lg">Bejelentkezés</h2>
      <div className="w-full flex flex-col gap-4">
        <input
          name="username"
          type="text"
          placeholder="Felhasználónév"
          value={form.username}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md placeholder:text-blue-300 transition-all duration-200"
        />
        <input
          name="password"
          type="password"
          placeholder="Jelszó"
          value={form.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md placeholder:text-blue-300 transition-all duration-200"
        />
      </div>
      <button 
        type="submit" 
        disabled={loading}
        className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-lg shadow transition-colors"
      >
        {loading ? 'Bejelentkezés...' : 'Bejelentkezés'}
      </button>
      {message && (
        <div className={`mt-4 font-semibold text-center rounded p-2 w-full ${
          message.includes('Sikeres') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message}
        </div>
      )}
      <div className="w-full text-center mt-2 text-sm text-gray-600">
        Még nincs fiókod?{' '}
        <Link to="/register" className="text-blue-600 hover:underline font-semibold">Regisztrálj!</Link>
      </div>
      <div className="w-full text-center mt-2 text-sm text-gray-600">
    <Link to="/forgot-password" className="text-blue-600 hover:underline font-semibold">Elfelejtetted a jelszavad?</Link>
      </div>
    </form>
  );
}
