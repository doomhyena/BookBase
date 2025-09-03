import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

// Cookie olvasó segédfüggvény, ami visszaadja a cookie értékét név alapján
function getCookie(name) {
  const value = `; ${document.cookie}`; // cookie string előkészítése
  const parts = value.split(`; ${name}=`); // szétválasztjuk a keresett cookie alapján
  if (parts.length === 2) return parts.pop().split(';').shift(); // ha van, visszaadjuk az értéket
  return null; // ha nincs, null
}

// Navbar komponens exportálása
export default function Navbar() {
  // userId → a jelenleg bejelentkezett felhasználó azonosítója cookie alapján
  const [userId, setUserId] = useState(getCookie('id'));
  // isAdmin → admin jogosultság ellenőrzés
  const [isAdmin, setIsAdmin] = useState(false);
  // showDropdown → jelzi, hogy a profil dropdown nyitva van-e
  const [showDropdown, setShowDropdown] = useState(false);
  // Ref a dropdown gombhoz, hogy tudjuk a pozícióját számolni
  const dropdownButtonRef = useRef(null);
  // Ref magához a dropdown div-hez
  const dropdownRef = useRef(null);
  // Dropdown stílus (pl. bal pozíció)
  const [dropdownStyle, setDropdownStyle] = useState({ left: 0 });
  // useNavigate → router navigációhoz
  const navigate = useNavigate();

  // Felhasználói adatok lekérése a komponens betöltődésekor
  useEffect(() => {
    fetchUserData(); // azonnali adatlekérés

    // Ha az útvonal változik, újra lekérjük a felhasználói adatokat
    const unlisten = navigate((location) => {
      fetchUserData();
    });

    // Cleanup: ha a komponens elhagyja a DOM-ot
    return () => {
      if (unlisten) unlisten();
    };
  }, []);

  // Felhasználói adatok fetch-elése a backendről
  const fetchUserData = async () => {
    try {
      const response = await fetch(`http://localhost/BookBase-Dev/Project/backend/userprofile.php?action=getCurrentUser`, { credentials: 'include' });
      const data = await response.json();

      if (data.success && data.user) {
        setIsAdmin(String(data.user.admin) === "1"); // admin ellenőrzés
        setUserId(data.user.id); // user id beállítása
      } else {
        setIsAdmin(false); // ha nincs adat, admin false
      }
    } catch (error) {
      console.error('Hiba a felhasználói adatok betöltésekor:', error);
      setIsAdmin(false);
    }
  };

  // Kijelentkezés kezelése
  const handleLogout = () => {
    // Cookie törlése
    document.cookie = "id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    setUserId(null); // userId null
    setIsAdmin(false); // admin jogosultság törlése
    navigate('/'); // vissza a főoldalra
  };

  // Oldalsó scroll tiltása, ha a dropdown nyitva van
  useEffect(() => {
    document.body.style.overflowX = showDropdown ? 'hidden' : 'auto';
    return () => { document.body.style.overflowX = 'auto'; };
  }, [showDropdown]);

  // Dropdown pozíció számítása, hogy ne lógjon ki a képernyőről
  useEffect(() => {
    if (showDropdown && dropdownButtonRef.current && dropdownRef.current) {
      const btnRect = dropdownButtonRef.current.getBoundingClientRect(); // gomb mérete és pozíciója
      const ddRect = dropdownRef.current.getBoundingClientRect(); // dropdown mérete
      const screenWidth = window.innerWidth;

      let left = 0;
      if (btnRect.left + ddRect.width > screenWidth - 8) {
        left = screenWidth - 8 - ddRect.width - btnRect.left; // ha túlmegy, visszahúzzuk
      }

      setDropdownStyle({ left });
    }
  }, [showDropdown]);

  return (
    // Navbar container
    <nav className="w-full bg-gradient-to-r from-blue-600 to-yellow-400 py-4 px-2 shadow flex flex-col sm:flex-row items-center justify-between rounded-b-2xl mb-2">
      
      {/* Bal oldal: logo */}
      <div className="flex items-center gap-4 mb-2 sm:mb-0">
        <Link to="/" className="text-3xl font-extrabold tracking-tight text-white drop-shadow-lg select-none font-serif italic hover:text-yellow-200 transition-colors">
          BookBase
        </Link>
      </div>

      {/* Jobb oldal: navigációs linkek */}
      <div className="flex gap-2 sm:gap-4 relative">
        <Link to="/" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Főoldal</Link>
        <Link to="/search" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Keresés</Link>
        <Link to="/community" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Közösség</Link>
        <Link to="/random" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Random</Link>

        {/* Admin link csak admin esetén */}
        {isAdmin && (
          <Link to="/admin/AdminPanel" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Admin</Link>
        )}

        {/* Bejelentkezett felhasználó dropdown */}
        {userId ? (
          <div className="relative">
            {/* Dropdown gomb */}
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

            {/* Dropdown lista */}
            {showDropdown && (
              <div
                ref={dropdownRef}
                className="absolute top-full mt-2 w-40 bg-white rounded-lg shadow-lg z-10 border border-blue-200"
                style={{ left: dropdownStyle.left }}
              >
                {/* Saját profil gomb */}
                <button
                  className="w-full text-left px-4 py-2 hover:bg-blue-50 rounded-t-lg text-blue-700 font-semibold"
                  onClick={() => { setShowDropdown(false); navigate(`/user/${userId}`); }}
                >
                  Saját profilom
                </button>
                {/* Kijelentkezés gomb */}
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
          // Ha nincs bejelentkezve senki → login link
          <Link to="/login" className="Navbar-link text-white font-semibold px-4 py-2 rounded-lg hover:bg-white/20 transition">Bejelentkezés</Link>
        )}
      </div>
    </nav>
  );
}
