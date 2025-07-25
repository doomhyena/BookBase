
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setMessage('');
    const res = await fetch('/api/users.php?action=login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    const data = await res.json();
    setMessage(data.message || (data.success ? 'Sikeres bejelentkezés!' : 'Hibás adatok!'));
  };

  return (
    <div style={{
      maxWidth: 420,
      margin: '5rem auto 2.5rem auto',
      background: 'rgba(255,255,255,0.98)',
      padding: '2.7rem 2.2rem 2.2rem 2.2rem',
      borderRadius: '2rem',
      boxShadow: '0 6px 36px #ffb34777',
      border: '1.5px solid #ffb34744',
      fontFamily: 'Montserrat, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'box-shadow 0.2s',
    }}>
      <h2 style={{
        color: '#ff6f61',
        fontFamily: 'inherit',
        fontWeight: 900,
        letterSpacing: 1.2,
        fontSize: '2.1rem',
        marginBottom: 26,
        textShadow: '0 2px 12px #ffb34733',
        textAlign: 'center',
        textTransform: 'uppercase',
        letterSpacing: 2
      }}>Bejelentkezés</h2>
      <form onSubmit={handleSubmit} autoComplete="off" style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 0, width: '100%' }}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            marginBottom: 16,
            padding: '13px 14px',
            borderRadius: 12,
            border: '1.5px solid #ffb34777',
            fontSize: 17,
            background: '#fff9',
            boxShadow: '0 2px 8px #ffb34722',
            transition: 'box-shadow 0.2s, border 0.2s',
            outline: 'none',
            fontWeight: 500,
            color: '#4a5568',
            letterSpacing: 0.2
          }}
        />
        <input
          name="password"
          type="password"
          placeholder="Jelszó"
          value={form.password}
          onChange={handleChange}
          required
          style={{
            width: '100%',
            marginBottom: 22,
            padding: '13px 14px',
            borderRadius: 12,
            border: '1.5px solid #ffb34777',
            fontSize: 17,
            background: '#fff9',
            boxShadow: '0 2px 8px #ffb34722',
            transition: 'box-shadow 0.2s, border 0.2s',
            outline: 'none',
            fontWeight: 500,
            color: '#4a5568',
            letterSpacing: 0.2
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '13px 0',
            background: 'linear-gradient(90deg, #ff6f61 0%, #ffb347 100%)',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontWeight: 800,
            fontSize: 19,
            letterSpacing: 1,
            boxShadow: '0 3px 12px #ffb34744',
            cursor: 'pointer',
            marginBottom: 10,
            marginTop: 2,
            textTransform: 'uppercase',
            transition: 'background 0.2s, box-shadow 0.2s',
          }}
        >
          Bejelentkezés
        </button>
      </form>
      <div style={{
        marginTop: 20,
        textAlign: 'center',
        fontSize: 15.5,
        width: '100%',
        color: '#4a5568',
        fontWeight: 500,
        letterSpacing: 0.1
      }}>
        Még nincs fiókod?{' '}
        <Link
          to="/register"
          style={{
            color: '#ff6f61',
            textDecoration: 'underline',
            fontWeight: 700,
            fontSize: 16,
            marginLeft: 2,
            letterSpacing: 0.2,
            transition: 'color 0.2s',
          }}
        >
          Regisztrálj itt!
        </Link>
      </div>
      {message && (
        <div style={{
          marginTop: 16,
          color: '#ff6f61',
          fontWeight: 700,
          textAlign: 'center',
          fontSize: 16,
          width: '100%',
          letterSpacing: 0.2,
          background: '#fff3',
          borderRadius: 8,
          padding: '7px 0',
          boxShadow: '0 1px 6px #ffb34722',
        }}>{message}</div>
      )}
    </div>
  );
}
