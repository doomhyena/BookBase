import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
  }

export default function BookDetails() {
  const { id } = useParams();
  const userId = getCookie('id');
  const statusOptions = [
    'Olvasom',
    'Befejeztem',
    'Várakozás',
    'Félbehagytam',
    'Tervezem majd olvasni'
  ];
  const [readingStatus, setReadingStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Státusz lekérése
  useEffect(() => {
    if (!userId || !id) return;
    fetch(`http://localhost/BookBase-Dev/Project/backend/reading_status.php?book_id=${id}&user_id=${userId}`)
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && typeof data.status !== 'undefined') setReadingStatus(data.status);
      });
  }, [id, userId]);

  // Státusz mentése
  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setReadingStatus(newStatus);
    setStatusMessage('');
    try {
      const res = await fetch('http://localhost/BookBase-Dev/Project/backend/reading_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `book_id=${encodeURIComponent(id)}&user_id=${encodeURIComponent(userId)}&status=${encodeURIComponent(newStatus)}`
      });
      const data = await res.json();
      if (data.success) setStatusMessage('Státusz mentve!');
      else setStatusMessage('Hiba történt a státusz mentésekor!');
    } catch (err) {
      setStatusMessage('Hiba történt a státusz mentésekor!');
    }
  };
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost/BookBase-Dev/Project/backend/bookdetails.php?api=true&id=${id}`);
      const data = await response.json();
      if (data.success) {
        setBook(data.book);
        setRating(data.book.atlag_ertekeles || 0);
      }
      // Felhasználó saját értékelésének lekérése
      if (userId) {
        const res = await fetch(`http://localhost/BookBase-Dev/Project/backend/ratings.php?book_id=${id}&user_id=${userId}`);
        if (res.ok) {
          const rdata = await res.json();
          if (rdata.success && rdata.rating) {
            setUserRating(rdata.rating);
          }
        }
      }
    } catch (error) {
      console.error('Hiba a könyv betöltésekor:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchBookDetails();
}, [id, userId]);

  const handleRating = async (newRating) => {
    try {
      const response = await fetch('http://localhost/BookBase-Dev/Project/backend/ratings.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book_id: id,
          rating: newRating,
          user_id: userId
        })
      });
      const data = await response.json();
      if (data.success) {
        // Frissítjük a felhasználó saját értékelését
        try {
          const rres = await fetch(`http://localhost/BookBase-Dev/Project/backend/ratings.php?book_id=${id}&user_id=${userId}`);
          if (rres.ok) {
            const rdata = await rres.json();
            if (rdata.success && rdata.rating) {
              setUserRating(rdata.rating);
            }
          }
        } catch (err) {}
      }
    } catch (error) {
      console.error('Hiba az értékelés küldésekor:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-2 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-2xl text-blue-700">Betöltés...</div>
        </div>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-2 md:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-2xl text-red-700 mb-4">A könyv nem található!</div>
          <Link to="/" className="text-blue-600 hover:underline">Vissza a főoldalra</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-300 via-blue-100 to-blue-400 py-10 px-2 md:px-8 animate-gradient-x">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/95 rounded-3xl shadow-2xl p-8 border border-blue-200 backdrop-blur-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Borítókép */}
            <div className="md:col-span-1 flex flex-col items-center justify-center">
              {book.cover ? (
                <img 
                  src={book.cover} 
                  alt={`${book.title} borítókép`} 
                  className="w-full max-w-xs rounded-2xl shadow-xl border-4 border-blue-300 mb-4 hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl flex items-center justify-center border-4 border-blue-200">
                  <span className="text-gray-500">Nincs borítókép</span>
                </div>
              )}
            </div>
            {/* Könyv adatok */}
            <div className="md:col-span-2 flex flex-col justify-center">
              <h1 className="text-5xl md:text-6xl font-extrabold text-blue-700 mb-2 leading-tight drop-shadow-lg tracking-tight">
                {book.title}
              </h1>
              <div className="mb-6 flex items-center gap-2">
                <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-lg font-semibold shadow">Szerző</span>
                <span className="text-xl md:text-2xl text-gray-700 font-bold">{book.author}</span>
              </div>
              {/* Értékelés */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-lg md:text-xl font-semibold text-gray-700">Átlagos értékelés:</span>
                  <span className="text-2xl md:text-3xl font-bold text-yellow-500">★ {rating}/5</span>
                  <span className="text-gray-400">({book.ertekelesek_szama || 0} értékelés)</span>
                </div>
                {/* Státusz legördülő */}
                <div className="mb-6 flex items-center gap-3">
                  <label htmlFor="readingStatus" className="text-base font-semibold text-blue-700">Saját státusz:</label>
                  <select
                    id="readingStatus"
                    value={readingStatus || ""}
                    onChange={handleStatusChange}
                    className="px-4 py-2 rounded-lg border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none bg-white text-blue-700 font-bold"
                  >
                    <option value="">Válassz...</option>
                    {statusOptions.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                  {statusMessage && <span className="ml-2 text-green-600 font-semibold">{statusMessage}</span>}
                </div>
                {/* Csillagok megjelenítése */}
                <div className="flex gap-2 mb-6 bg-blue-50 rounded-xl px-4 py-2 border border-blue-200 shadow-inner">
                  {[1, 2, 3, 4, 5].map((star) => {
                    let starClass = 'text-4xl md:text-5xl transition-all duration-200 cursor-pointer select-none focus:outline-none';
                    let style = {};
                    if (userRating > 0) {
                      if (star <= userRating) {
                        starClass += ' text-yellow-500 drop-shadow-[0_2px_6px_rgba(250,204,21,0.5)] scale-110';
                        style.color = '#facc15'; // Tailwind yellow-400
                      } else {
                        starClass += ' text-gray-300';
                      }
                    } else {
                      if (star <= hoverRating) {
                        starClass += ' text-yellow-500 drop-shadow-[0_2px_6px_rgba(250,204,21,0.5)] scale-110';
                        style.color = '#facc15';
                      } else {
                        starClass += ' text-gray-300';
                      }
                    }
                    starClass += ' hover:scale-125 hover:text-yellow-300';
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRating(star)}
                        onMouseEnter={() => userRating === 0 && setHoverRating(star)}
                        onMouseLeave={() => userRating === 0 && setHoverRating(0)}
                        className={starClass}
                        style={style}
                        aria-label={`Értékelés: ${star} csillag`}
                      >
                        ★
                      </button>
                    );
                  })}
                </div>
                {userRating > 0 && (
                  <p className="text-green-600 font-semibold animate-pulse">Köszönjük az értékelést!</p>
                )}
              </div>
              {/* Összefoglaló */}
              {book.summary && (
                <div className="mb-8 bg-blue-50 rounded-xl p-5 border border-blue-200 shadow flex items-start gap-3">
                  <span className="text-blue-400 text-3xl mt-1">📖</span>
                  <div>
                    <h3 className="text-lg md:text-xl font-semibold text-blue-700 mb-3">Összefoglaló</h3>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg">{book.summary}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg transition-all duration-200 relative overflow-hidden group"
          >
            <span className="absolute left-0 top-0 w-full h-full bg-blue-400 opacity-0 group-hover:opacity-20 transition-all duration-300"></span>
          </Link>
        </div>
      </div>
    </div>
  );
}