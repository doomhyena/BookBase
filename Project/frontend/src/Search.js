import React, { useState } from 'react';

const Search = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`/api/books.php?action=search&query=${encodeURIComponent(query)}`);
            const data = await response.json();
            setResults(data.books || []);
        } catch (error) {
            setResults([]);
        }
        setLoading(false);
    };

    return (
        <div style={{ maxWidth: 600, margin: '40px auto', padding: 20, background: 'rgba(255,255,255,0.95)', borderRadius: 12, boxShadow: '0 2px 16px #ffb347' }}>
            <h2 style={{ color: '#ff6f61', fontFamily: 'sans-serif', fontWeight: 700 }}>Könyv keresése</h2>
            <form onSubmit={handleSearch} style={{ marginBottom: 20 }}>
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Keresés könyv címére, szerzőre..."
                    style={{ width: '70%', padding: 8, fontSize: 16 }}
                />
                <button type="submit" style={{ padding: '8px 16px', marginLeft: 8, background: 'linear-gradient(90deg, #ff6f61 0%, #ffb347 100%)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}>
                    Keresés
                </button>
            </form>
            {loading && <div style={{ color: '#ff6f61', fontWeight: 500 }}>Keresés folyamatban...</div>}
            <ul>
                {results.length === 0 && !loading && <li style={{ color: '#ff6f61', fontWeight: 500 }}>Nincs találat.</li>}
                {results.map(book => (
                    <li key={book.id} style={{ marginBottom: 12 }}>
                        <strong style={{ color: '#ff6f61' }}>{book.title}</strong> – <span style={{ color: '#ffb347' }}>{book.author}</span><br />
                        <span style={{ color: '#4a5568' }}>{book.description || 'Nincs leírás.'}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Search;