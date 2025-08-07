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
        <>
            <h2 className="text-2xl font-bold text-blue-700 mb-6 text-center mt-10">Könyv keresése</h2>
            <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-xl mx-auto">
                <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Keresés könyv címére, szerzőre..."
                    className="flex-1 px-4 py-3 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-base"
                />
                <button type="submit" className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors">Keresés</button>
            </form>
            {loading && <div className="text-blue-600 font-semibold mb-4 text-center">Keresés folyamatban...</div>}
            <ul className="divide-y divide-gray-200 max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6">
                {results.length === 0 && !loading && <li className="py-3 text-gray-500">Nincs találat.</li>}
                {results.map(book => (
                    <li key={book.id} className="py-3">
                        <strong className="text-blue-700 font-semibold text-base">{book.title}</strong> – <span className="text-gray-500 text-sm">{book.author}</span><br />
                        <span className="text-gray-500 text-sm">{book.description || 'Nincs leírás.'}</span>
                    </li>
                ))}
            </ul>
        </>
    );
};

export default Search;