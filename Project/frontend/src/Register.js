import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ firstname: '', lastname: '', email: '', password: '' });
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
    <div style={{
      maxWidth: 420,
      margin: '2.5rem auto',
      background: 'rgba(255,255,255,0.97)',
      padding: '2.5rem 2rem 2rem 2rem',
      borderRadius: '1.5rem',
      boxShadow: '0 4px 32px #ffb34755',
      border: '1.5px solid #ffb34733',
      fontFamily: 'Montserrat, sans-serif',
    }}>
      <h2 style={{ color: '#ff6f61', fontFamily: 'inherit', fontWeight: 800, letterSpacing: 1, fontSize: '2rem', marginBottom: 24, textShadow: '0 2px 8px #ffb34733' }}>Regisztráció</h2>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div style={{ display: 'flex', gap: 10 }}>
          <input name="lastname" placeholder="Vezetéknév" value={form.lastname} onChange={handleChange} required style={{ flex: 1, marginBottom: 12, padding: 10, borderRadius: 8, border: '1.5px solid #ffb34755', fontSize: 16, background: '#fff8', boxShadow: '0 1px 4px #ffb34722' }} />
          <input name="firstname" placeholder="Keresztnév" value={form.firstname} onChange={handleChange} required style={{ flex: 1, marginBottom: 12, padding: 10, borderRadius: 8, border: '1.5px solid #ffb34755', fontSize: 16, background: '#fff8', boxShadow: '0 1px 4px #ffb34722' }} />
        </div>
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ width: '100%', marginBottom: 12, padding: 10, borderRadius: 8, border: '1.5px solid #ffb34755', fontSize: 16, background: '#fff8', boxShadow: '0 1px 4px #ffb34722' }} />
        <input name="password" type="password" placeholder="Jelszó" value={form.password} onChange={handleChange} required style={{ width: '100%', marginBottom: 18, padding: 10, borderRadius: 8, border: '1.5px solid #ffb34755', fontSize: 16, background: '#fff8', boxShadow: '0 1px 4px #ffb34722' }} />
        <button type="submit" style={{ width: '100%', padding: 12, background: 'linear-gradient(90deg, #ff6f61 0%, #ffb347 100%)', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 18, letterSpacing: 0.5, boxShadow: '0 2px 8px #ffb34744', cursor: 'pointer', marginBottom: 8 }}>Regisztráció</button>
      </form>
      <div style={{ marginTop: 18, textAlign: 'center', fontSize: 15 }}>
        <span style={{ color: '#4a5568' }}>Van már fiókod?</span>{' '}
        <Link to="/login" style={{ color: '#ff6f61', textDecoration: 'underline', fontWeight: 600 }}>Jelentkezz be itt!</Link>
      </div>
      {message && <div style={{ marginTop: 14, color: '#ff6f61', fontWeight: 600, textAlign: 'center', fontSize: 15 }}>{message}</div>}
    </div>
  );
}
