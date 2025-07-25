import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{
      background: 'linear-gradient(90deg, #ff6f61 0%, #ffb347 100%)',
      padding: '1rem',
      display: 'flex',
      gap: '1.5rem',
      justifyContent: 'center',
      boxShadow: '0 2px 16px rgba(0,0,0,0.08)'
    }}>
      <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontFamily: 'sans-serif', fontSize: '1.1rem' }}>Főoldal</Link>
      <Link to="/search" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontFamily: 'sans-serif', fontSize: '1.1rem' }}>Keresés</Link>
      <Link to="/upload" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontFamily: 'sans-serif', fontSize: '1.1rem' }}>Könyv feltöltése</Link>
      <Link to="/random" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontFamily: 'sans-serif', fontSize: '1.1rem' }}>Random</Link>
      <Link to="/login" style={{ color: '#fff', textDecoration: 'none', fontWeight: 500, fontFamily: 'sans-serif', fontSize: '1.1rem' }}>Bejelentkezés</Link>
    </nav>
  );
}