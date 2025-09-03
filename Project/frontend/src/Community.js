import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Alapértelmezett API URL a backendhez
const API_BASE = "http://localhost/BookBase-Dev/Project/backend";

function Community() {
  // A jelenlegi felhasználó adatai (id, username)
  const [currentUser, setCurrentUser] = useState(null);
  
  // Új bejegyzés form adatai
  const [form, setForm] = useState({ title: '', content: '' });
  
  // A közösségi posztok listája
  const [posts, setPosts] = useState([]);
  
  // A kommentek objektuma, ahol minden postId-hez tartozik a komment lista
  const [comments, setComments] = useState({});
  
  // Az egyes posztok komment űrlapjainak adatai
  const [commentForms, setCommentForms] = useState({});
  
  // Betöltési állapot
  const [loading, setLoading] = useState(true);

  // Komponens betöltésekor a felhasználó lekérése
  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Backend lekérés a jelenlegi felhasználóról
        const res = await fetch(`${API_BASE}/userprofile.php?action=getCurrentUser`, {
          credentials: 'include' // 🔹 Cookie-k küldése a kéréssel
        });
        const data = await res.json();
        if (data.success && data.user) {
          // Ha sikeres, beállítjuk a felhasználó adatait
          setCurrentUser({ id: data.user.id, username: data.user.username });
        } else {
          // Ha nem sikerül, vendégként jelenítjük meg
          setCurrentUser({ id: 0, username: 'Vendég' });
        }
      } catch (err) {
        console.error('Hiba a user lekérésekor:', err);
        setCurrentUser({ id: 0, username: 'Vendég' });
      }
    };
    fetchUser();
  }, []); // Csak egyszer fut le a komponens mountolásakor

  //  Betöltéskor lekérjük a posztokat
  useEffect(() => {
    fetchPosts();
  }, []);

  // Posztok lekérése és hozzátartozó kommentek
  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Posztok lekérése
      const res = await fetch(`${API_BASE}/community_posts.php`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);

        // Komment objektum létrehozása
        const commentsObj = {};
        // Minden poszthoz lekérjük a kommenteket
        await Promise.all(
          data.posts.map(async post => {
            const cres = await fetch(`${API_BASE}/community_comments.php?postId=${post.id}`);
            const cdata = await cres.json();
            commentsObj[post.id] = cdata.success ? cdata.comments : [];
          })
        );
        setComments(commentsObj);
      }
    } catch (err) {
      console.error('Hiba a bejegyzések betöltésekor:', err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Új poszt létrehozása
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;

    const author = currentUser?.username || 'Vendég';
    const userId = currentUser?.id > 0 ? currentUser.id : 0;

    try {
      const res = await fetch(`${API_BASE}/community_posts.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ title: form.title, content: form.content, author, userId })
      });
      const data = await res.json();
      if (data.success) {
        // 🔹 Form törlése sikeres poszt után és posztok újratöltése
        setForm({ title: '', content: '' });
        fetchPosts();
      } else {
        alert(data.message || 'Hiba a poszt létrehozásakor');
      }
    } catch (err) {
      console.error('Hiba a poszt mentésekor:', err);
    }
  };

  // 🔹 Komment input változásának kezelése
  const handleCommentChange = (postId, e) => {
    setCommentForms(prev => ({
      ...prev,
      [postId]: { ...prev[postId], content: e.target.value }
    }));
  };

  // 🔹 Komment beküldése
  const handleCommentSubmit = async (postId, e) => {
    e.preventDefault();
    const content = commentForms[postId]?.content?.trim();
    if (!content) return;

    const author = currentUser?.username || 'Vendég';
    const userId = currentUser?.id > 0 ? currentUser.id : 0;

    try {
      const res = await fetch(`${API_BASE}/community_comments.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ postId, content, author, userId })
      });
      const data = await res.json();
      if (data.success) {
        // 🔹 Form törlése és posztok újratöltése
        setCommentForms({ ...commentForms, [postId]: { content: '' } });
        fetchPosts();
      } else {
        alert(data.message || 'Hiba a komment létrehozásakor');
      }
    } catch (err) {
      console.error('Hiba a komment mentésekor:', err);
    }
  };

  // 🔹 Betöltési állapot kezelése
  if (loading) return <div className="text-center text-2xl text-blue-700 py-10">Betöltés...</div>;

  return (
    // 🔹 Fő container
    <div className="max-w-3xl mx-auto py-10 px-2 md:px-0">
      {/* 🔹 Oldal címe */}
      <h1 className="text-3xl font-black text-blue-700 mb-8 text-center drop-shadow">Közösségi beszélgetések</h1>

      {/* 🔹 Új bejegyzés űrlap */}
      {currentUser && currentUser.id !== 0 ? (
        <form className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 mb-10" onSubmit={handleSubmit}>
          <input
            name="title"
            placeholder="Bejegyzés címe"
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            required
            className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-gray-50"
          />
          <textarea
            name="content"
            placeholder="Írd le a gondolataidat..."
            value={form.content}
            onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
            required
            className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-gray-50 min-h-[80px]"
          />
          <button type="submit" className="self-end px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow">
            Új bejegyzés
          </button>
        </form>
      ) : (
        <div className="text-center text-red-600 mb-10">Jelentkezz be a posztoláshoz!</div>
      )}

      {/* Posztok listája */}
      <div className="flex flex-col gap-8">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6">
            {/* Poszt címe */}
            <div className="text-xl font-bold text-blue-700 mb-2">{post.title}</div>
            {/* Poszt szerző és dátum */}
            <div className="text-sm text-gray-500 mb-2">
              <Link to={`/user/${post.user_id}`} className="font-semibold text-blue-600 hover:underline">{post.author}</Link> •{' '}
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            {/* 🔹 Poszt tartalma */}
            <div className="text-gray-800 mb-4 whitespace-pre-wrap">{post.content}</div>

            {/* 🔹 Kommentek */}
            <div className="space-y-3 mt-4">
              {(comments[post.id] && comments[post.id].length > 0) ? (
                comments[post.id].map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg shadow p-3 flex items-start gap-3">
                    {/* 🔹 Profilkép linkkel */}
                    <Link to={`/user/${comment.user_id}`}>
                      <img
                        src={comment.profile_picture_url || "/default-avatar.png"}
                        alt="Profilkép" 
                        className="object-cover rounded-full"
                        style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '50%' }}
                      />
                    </Link>
                    {/* 🔹 Komment szövege és meta */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-sm mb-1">
                        <Link
                          to={`/user/${comment.user_id}`}
                          className="font-semibold text-blue-600 hover:underline"
                        >
                          {comment.author}
                        </Link>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-500 text-xs">
                          {new Date(comment.date).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700 text-sm">{comment.content}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-sm italic">Még nincsenek kommentek.</div>
              )}

              {/* 🔹 Új komment űrlap */}
              {currentUser && currentUser.id !== 0 ? (
                <form className="flex flex-col md:flex-row gap-2 mt-3" onSubmit={e => handleCommentSubmit(post.id, e)}>
                  <input
                    name="content"
                    placeholder="Írj hozzászólást..."
                    value={commentForms[post.id]?.content || ''}
                    onChange={e => handleCommentChange(post.id, e)}
                    required
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                  />
                  <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg shadow">
                    Küldés
                  </button>
                </form>
              ) : (
                <div className="text-red-600 italic mt-2">Jelentkezz be a kommenteléshez!</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;
