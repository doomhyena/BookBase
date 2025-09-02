import React, { useState, useEffect, useRef } from 'react';
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
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownButtonRef = useRef(null);
  const dropdownRef = useRef(null);
  const [dropdownStyle, setDropdownStyle] = useState({ left: 0 });
  const navigate = useNavigate();

  // Felhasználói adatok lekérése
  useEffect(() => {
    fetchUserData();
    const unlisten = navigate((location) => {
      fetchUserData();
    });
    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  const fetchUserData = async () => {
    try { 
      const response = await fetch(`http://localhost/BookBase-Dev/Project/backend/userprofile.php?action=getCurrentUser`, { credentials: 'include' });
      const data = await response.json();
      if (data.success && data.user) {
        setIsAdmin(String(data.user.admin) === "1");        setUserId(data.user.id);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Hiba a felhasználói adatok betöltésekor:', error);
      setIsAdmin(false);
    }
  };

  const handleLogout = () => {
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUserId(null);
    setIsAdmin(false);
    navigate('/');
  };

  // Oldalsó scroll tiltása dropdown nyitáskor
  useEffect(() => {
    document.body.style.overflowX = showDropdown ? 'hidden' : 'auto';
    return () => { document.body.style.overflowX = 'auto'; };
  }, [showDropdown]);

  // Dropdown pozíció számítása
  useEffect(() => {
    if (showDropdown && dropdownButtonRef.current && dropdownRef.current) {
      const btnRect = dropdownButtonRef.current.getBoundingClientRect();
      const ddRect = dropdownRef.current.getBoundingClientRect();
      const screenWidth = window.innerWidth;

      let left = 0;
      if (btnRect.left + ddRect.width > screenWidth - 8) {
        // ha kilógna jobbra, toljuk balra
        left = screenWidth - 8 - ddRect.width - btnRect.left;
      }

      setDropdownStyle({ left });
    }
  }, [showDropdown]);

  return (
    <nav className="w-full bg-gradient-to-r from-blue-600 to-yellow-400 py-4 px-2 shadow flex flex-col sm:flex-row items-center justify-between rounded-b-2xl mb-2">
      <div className="flex items-center gap-4 mb-2 sm:mb-0">
        <Link to="/" className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg select-none font-serif italic hover:text-yellow-200 transition-colors">
          BookBase
        </Link>
      </div>
      <div className="flex gap-2 sm:gap-4 relative">
        <Link to="/" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Főoldal</Link>
        <Link to="/search" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Keresés</Link>
        <Link to="/community" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Közösség</Link>
        <Link to="/random" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Random</Link>
        {isAdmin && (
          <Link to="/AdminPanel" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Admin</Link>
        )}
        {userId ? (
          <div className="relative">
            <button
              ref={dropdownButtonRef}
              className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition flex items-center gap-2"
              onClick={() => setShowDropdown(prev => !prev)}
              type="button"
            >
              Profilom
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full mt-2 w-40 bg-white rounded-lg shadow-lg z-10 border border-blue-200"
                style={{ left: dropdownStyle.left }}
              >
                <button
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-t-lg text-blue-700 font-semibold"
                  onClick={() => { setShowDropdown(false); navigate(`/user/${userId}`); }}
                >
                  Saját profilom
                </button>
                <button
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-b-lg text-red-600 font-semibold"
                  onClick={() => { setShowDropdown(false); handleLogout(); }}
                >
                  Kijelentkezés
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link to="/login" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Bejelentkezés</Link>
        )}
      </div>
    </nav>
  );
}
