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
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const userId = getCookie('id');

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost/BookBase-Dev/Project/backend/bookdetails.php?api=true&id=${id}`);
        const data = await response.json();
        if (data.success) {
          setBook(data.book);
          setRating(data.book.atlag_ertekeles || 0);
        }
      } catch (error) {
        console.error('Hiba a könyv betöltésekor:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookDetails();
  }, [id]);

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
        setUserRating(newRating);
        // Frissítjük az átlagos értékelést a backendből
        try {
          const res = await fetch(`http://localhost/BookBase-Dev/Project/backend/bookdetails.php?api=true&id=${id}`);
          if (res.ok) {
            const fresh = await res.json();
            if (fresh.success) {
              setBook(fresh.book);
              setRating(fresh.book.atlag_ertekeles || 0);
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
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-2 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Borítókép */}
            <div className="md:col-span-1">
              {book.cover ? (
                <img 
                  src={book.cover} 
                  alt={`${book.title} borítókép`} 
                  className="w-full rounded-2xl shadow-lg"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-500">Nincs borítókép</span>
                </div>
              )}
            </div>
            {/* Könyv adatok */}
            <div className="md:col-span-2">
              <h1 className="text-4xl font-bold text-blue-700 mb-4">{book.title}</h1>
              <p className="text-2xl text-gray-600 mb-6">Szerző: {book.author}</p>
              {/* Értékelés */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-xl font-semibold text-gray-700">Átlagos értékelés:</span>
                  <span className="text-3xl font-bold text-yellow-500">★ {rating}/5</span>
                  <span className="text-gray-500">({book.ertekelesek_szama || 0} értékelés)</span>
                </div>
                {/* Csillagok megjelenítése */}
                <div className="flex gap-1 mb-6">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className={`text-3xl transition-colors ${
                        star <= (hoverRating || userRating || rating) ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      aria-label={`Értékelés: ${star} csillag`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <p className="text-green-600 font-semibold">Köszönjük az értékelést!</p>
                )}
              </div>
              {/* Összefoglaló */}
              {book.summary && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-gray-700 mb-3">Összefoglaló</h3>
                  <p className="text-gray-600 leading-relaxed text-lg">{book.summary}</p>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center">
          <Link 
            to="/" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
          >
            Vissza a főoldalra
          </Link>
        </div>
      </div>
    </div>
  );
}