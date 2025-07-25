import React, { useState } from 'react';

export default function Upload() {
  const [form, setForm] = useState({
    author: '',
    title: '',
    volume: '',
    edition: '',
    date: '',
    translator: '',
    publisher: '',
    description: ''
  });
  const [cover, setCover] = useState(null);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = e => {
    setCover(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!cover) return setMessage('Válassz ki egy könyvborítót!');
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    formData.append('cover', cover);
    const res = await fetch('/api/books.php?action=upload', {
      method: 'POST',
      body: formData
    });
    const data = await res.json();
    setMessage(data.message || 'Könyv feltöltve!');
  };

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto', background: 'rgba(255,255,255,0.95)', padding: '2rem', borderRadius: '1rem', boxShadow: '0 2px 16px #ffb347' }}>
      <h2 style={{ color: '#ff6f61', fontFamily: 'sans-serif', fontWeight: 700 }}>Könyv feltöltése</h2>
      <form onSubmit={handleSubmit}>
        <input name="author" placeholder="Író" value={form.author} onChange={handleChange} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <input name="title" placeholder="Cím" value={form.title} onChange={handleChange} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <input name="volume" placeholder="Kötetszám" value={form.volume} onChange={handleChange} style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <input name="edition" placeholder="Kiadás" value={form.edition} onChange={handleChange} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <input name="translator" placeholder="Fordító" value={form.translator}  onChange={handleChange} style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <input name="publisher" placeholder="Kiadó" value={form.publisher} onChange={handleChange} required style={{ width: '100%', marginBottom: 10, padding: 8 }} />
        <textarea name="description" placeholder="Leírás" value={form.description} onChange={handleChange} required style={{ width: '100%', marginBottom: 10, padding: 8, minHeight: 60, resize: 'vertical' }} />
        <label style={{ display: 'block', marginBottom: 10 }}>
          Könyvborító feltöltése:
          <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'block', marginTop: 5 }} />
        </label>
        <button type="submit" style={{ width: '100%', padding: 10, background: 'linear-gradient(90deg, #ff6f61 0%, #ffb347 100%)', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600 }}>Feltöltés</button>
      </form>
      {message && <div style={{ marginTop: 10, color: '#ff6f61', fontWeight: 500 }}>{message}</div>}
    </div>
  );
}
