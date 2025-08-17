import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Cookie olvasó segédfüggvény
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
}

export default function Navbar() {
  const [userId, setUserId] = useState(getCookie('id'));
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Felhasználói adatok lekérése, ha be van jelentkezve
    if (userId) {
      fetchUserData();
    }
  }, [userId]);

  const fetchUserData = async () => {
    try {
      const response = await fetch(`/api/profile.php?action=getById&id=${userId}`);
      const data = await response.json();
      if (data.success) {
        setIsAdmin(data.user.admin == 1);
      }
    } catch (error) {
      console.error('Hiba a felhasználói adatok betöltésekor:', error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/users.php?action=logout');
      const data = await response.json();
      if (data.success) {
        setUserId(null);
        setIsAdmin(false);
        navigate('/');
      }
    } catch (error) {
      console.error('Hiba a kijelentkezéskor:', error);
    }
  };

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 to-yellow-400 py-4 px-2 shadow flex flex-col sm:flex-row items-center justify-between rounded-b-2xl mb-2">
      <div className="flex items-center gap-4 mb-2 sm:mb-0">
        <Link to="/" className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg select-none font-serif italic hover:text-yellow-200 transition-colors">
          BookBase
        </Link>
      </div>
      <div className="flex gap-2 sm:gap-4">
        <Link to="/" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Főoldal</Link>
        <Link to="/search" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Keresés</Link>
        <Link to="/community" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Közösség</Link>
        <Link to="/random" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Random</Link>
        {isAdmin && (
          <Link to="/admin/AdminPanel" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Admin</Link>
        )}
        {userId ? (
          <>
            <Link to={`/user/${userId}`} className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Fiókom</Link>
            <button 
              onClick={handleLogout}
              className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition"
            >
              Kijelentkezés
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Bejelentkezés</Link>
          </>
        )}
      </div>
    </nav>
  );
}