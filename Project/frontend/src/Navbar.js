import React from 'react';
import { Link } from 'react-router-dom';


export default function Navbar() {
  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 to-yellow-400 py-4 px-2 shadow flex flex-col sm:flex-row items-center justify-between rounded-b-2xl mb-2">
      <div className="flex items-center gap-4 mb-2 sm:mb-0">
        <span className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg select-none font-serif italic">BookBase</span>
      </div>
      <div className="flex gap-2 sm:gap-4">
        <Link to="/" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Főoldal</Link>
        <Link to="/search" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Keresés</Link>
        <Link to="/community" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Közösség</Link>
        <Link to="/random" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Random</Link>
        <Link to="/login" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Bejelentkezés</Link>
      </div>
    </nav>
  );
}