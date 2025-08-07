import React, { useState } from 'react';
import { Link } from 'react-router-dom';


export default function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/users.php?action=register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setMessage(data.message || 'Sikeres regisztráció!');
  };

  return (
      <form onSubmit={handleSubmit} autoComplete="on" className="w-full max-w-md mx-auto mt-16 flex flex-col items-center bg-white/90 rounded-3xl shadow-2xl p-8 gap-6 border-2 border-blue-300 backdrop-blur-lg">
        <h2 className="text-3xl font-black text-blue-700 mb-2 tracking-tight drop-shadow-lg">Regisztráció</h2>
        <div className="w-full flex flex-col gap-4">
          <input name="username" placeholder="Felhasználónév" value={form.username} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md placeholder:text-blue-300 transition-all duration-200" />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md placeholder:text-blue-300 transition-all duration-200" />
          <input name="password" type="password" placeholder="Jelszó" value={form.password} onChange={handleChange} required className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md placeholder:text-blue-300 transition-all duration-200" />
        </div>
        <button type="submit" className="w-full py-3 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors">Regisztráció</button>
        {message && <div className="mt-4 text-blue-700 font-semibold text-center bg-blue-50 rounded p-2 w-full">{message}</div>}
        <div className="w-full text-center mt-2 text-sm text-gray-600">
          Van már fiókod?{' '}
          <Link to="/login" className="text-blue-600 hover:underline font-semibold">Jelentkezz be itt!</Link>
        </div>
      </form>
  );
}
