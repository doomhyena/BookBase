
import React, { useState, useEffect } from "react";

const categories = [
  "Fantasy", "Disztópia", "Meseregény", "Romantika", "Tudomány", "Klasszikus", "Krimi", "Sci-fi", "Inspiráció", "Ifjúsági", "Dráma", "Történelmi", "Egyéb"
];

function AdminPanel() {
  const [books, setBooks] = useState([]);
  const [editId, setEditId] = useState(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [cover, setCover] = useState(null);
  const [message, setMessage] = useState("");

  // Könyvek lekérése
  useEffect(() => {
    fetch("http://localhost/BookBase-Dev/Project/backend/adminpanel.php", { credentials: "include" })
      .then(res => res.json())
      .then(data => {
        if (data.success) setBooks(data.books);
      });
  }, [message]);

  // Szerkesztés gomb
  const handleEdit = (book) => {
    setEditId(book.id);
    setTitle(book.title);
    setAuthor(book.author);
    setDescription(book.summary);
    setCategory(book.category || categories[0]);
    setCover(null);
    setMessage("");
  };

  // Új könyv hozzáadása gomb
  const handleNew = () => {
    setEditId(null);
    setTitle("");
    setAuthor("");
    setDescription("");
    setCategory(categories[0]);
    setCover(null);
    setMessage("");
  };

  // Mentés (új vagy szerkesztett könyv)
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("summary", description);
    formData.append("category", category);
    if (cover) formData.append("cover", cover);
    if (editId) formData.append("id", editId);
    try {
      const response = await fetch("http://localhost/BookBase-Dev/Project/backend/adminpanel.php", {
        method: "POST",
        body: formData,
        credentials: "include"
      });
      const result = await response.json();
      if (result.success) {
        setMessage(editId ? "Könyv sikeresen frissítve!" : "Könyv sikeresen feltöltve!");
        handleNew();
      } else {
        setMessage("Hiba történt: " + (result.message || result.error));
      }
    } catch (error) {
      setMessage("Hálózati hiba: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-2 md:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/90 rounded-3xl shadow-2xl p-8 mb-8">
          <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">{editId ? "Könyv szerkesztése" : "Könyv feltöltése (Admin)"}</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Cím</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Szerző</label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Leírás</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md min-h-[100px] resize-none"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Kategória</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md"
                required
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">Borítókép</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCover(e.target.files[0])}
                className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow transition-colors"
            >
              {editId ? "Mentés" : "Feltöltés"}
            </button>
            {editId && (
              <button type="button" onClick={handleNew} className="w-full py-3 mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-xl shadow transition-colors">Új könyv hozzáadása</button>
            )}
          </form>
          {message && (
            <div className={`mt-6 p-4 rounded-lg text-center ${
              message.includes('sikeresen') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {message}
            </div>
          )}
        </div>
        <div className="bg-white/80 rounded-2xl shadow p-6">
          <h3 className="text-xl font-bold text-blue-700 mb-4">Könyvek listája</h3>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-blue-100">
                <th className="p-2">Cím</th>
                <th className="p-2">Szerző</th>
                <th className="p-2">Kategória</th>
                <th className="p-2">Leírás</th>
                <th className="p-2">Borítókép</th>
                <th className="p-2">Szerkesztés</th>
              </tr>
            </thead>
            <tbody>
              {books.map(book => (
                <tr key={book.id} className="border-b">
                  <td className="p-2 font-semibold">{book.title}</td>
                  <td className="p-2">{book.author}</td>
                  <td className="p-2">{book.category}</td>
                  <td className="p-2 max-w-[200px] truncate">{book.summary}</td>
                  <td className="p-2">
                    {book.cover ? <img src={`http://localhost/BookBase-Dev/Project/backend/${book.cover}`} alt="borító" className="h-12 rounded shadow" /> : <span className="text-gray-400">Nincs</span>}
                  </td>
                  <td className="p-2">
                    <button onClick={() => handleEdit(book)} className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded shadow">Szerkesztés</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
