import React, { useEffect, useState } from 'react';

const Random = () => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRandom = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/books.php?action=random');
      const data = await response.json();
      setBook(data.book || null);
    } catch (e) {
      setBook(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRandom();
  }, []);

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', padding: 20, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #c3cfe2' }}>
      <h2>Véletlen könyv</h2>
      {loading && <div>Betöltés...</div>}
      {!loading && book && (
        <div>
          <h3 style={{ color: '#4f8cff' }}>{book.title}</h3>
          <p><b>Író:</b> {book.author}</p>
          <p><b>Leírás:</b> {book.description || 'Nincs leírás.'}</p>
          <button onClick={fetchRandom} style={{ marginTop: 16, padding: '8px 16px', background: '#4f8cff', color: '#fff', border: 'none', borderRadius: 6 }}>Másik könyv</button>
        </div>
      )}
      {!loading && !book && <div>Nincs elérhető könyv.</div>}
    </div>
  );
};

export default Random;
