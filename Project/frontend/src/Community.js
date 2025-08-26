import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = "http://localhost/BookBase-Dev/Project/backend";

function Community() {
  const [currentUser, setCurrentUser] = useState(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [commentForms, setCommentForms] = useState({});
  const [loading, setLoading] = useState(true);

  // 1️⃣ Lekérjük a bejelentkezett user-t
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${API_BASE}/userprofile.php?action=getCurrentUser`, {
          credentials: 'include'
        });
        const data = await res.json();
        if (data.success && data.user) {
          setCurrentUser({ id: data.user.id, username: data.user.username });
        } else {
          setCurrentUser({ id: 0, username: 'Vendég' });
        }
      } catch (err) {
        console.error('Hiba a user lekérésekor:', err);
        setCurrentUser({ id: 0, username: 'Vendég' });
      }
    };
    fetchUser();
  }, []);

  // 2️⃣ Bejegyzések lekérése
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/community_posts.php`);
      const data = await res.json();
      if (data.success) {
        setPosts(data.posts);

        const commentsObj = {};
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

  // 3️⃣ Poszt küldése
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
      console.log('POST response:', data);
      if (data.success) {
        setForm({ title: '', content: '' });
        fetchPosts();
      } else {
        alert(data.message || 'Hiba a poszt létrehozásakor');
      }
    } catch (err) {
      console.error('Hiba a poszt mentésekor:', err);
    }
  };

  // Komment input
  const handleCommentChange = (postId, e) => {
    setCommentForms(prev => ({
      ...prev,
      [postId]: { ...prev[postId], content: e.target.value }
    }));
  };

  // Komment küldése
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
      console.log('COMMENT response:', data);
      if (data.success) {
        setCommentForms({ ...commentForms, [postId]: { content: '' } });
        fetchPosts();
      } else {
        alert(data.message || 'Hiba a komment létrehozásakor');
      }
    } catch (err) {
      console.error('Hiba a komment mentésekor:', err);
    }
  };

  if (loading) return <div className="text-center text-2xl text-blue-700 py-10">Betöltés...</div>;

  return (
    <div className="max-w-3xl mx-auto py-10 px-2 md:px-0">
      <h1 className="text-3xl font-black text-blue-700 mb-8 text-center drop-shadow">Közösségi beszélgetések</h1>

      {/* Új bejegyzés */}
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

      {/* Bejegyzések */}
      <div className="flex flex-col gap-8">
        {posts.map(post => (
          <div key={post.id} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="text-xl font-bold text-blue-700 mb-2">{post.title}</div>
            <div className="text-sm text-gray-500 mb-2">
              <Link to={`/user/${post.user_id}`} className="font-semibold text-blue-600 hover:underline">{post.author}</Link> •{' '}
              <span>{new Date(post.date).toLocaleDateString()}</span>
            </div>
            <div className="mb-4 text-gray-700 whitespace-pre-line">{post.content}</div>

            {/* Kommentek */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-base font-semibold text-blue-700 mb-2">Hozzászólások</div>
              {currentUser && currentUser.id !== 0 ? (
                <form className="flex flex-col md:flex-row gap-2 mb-2" onSubmit={e => handleCommentSubmit(post.id, e)}>
                  <input
                    name="content"
                    placeholder="Hozzászólás..."
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
                <div className="text-red-600 italic mb-2">Jelentkezz be a kommenteléshez!</div>
              )}

              <div className="flex flex-col gap-2">
                {(comments[post.id] || []).length === 0 ? (
                  <div className="text-gray-400 italic">Még nincs hozzászólás.</div>
                ) : (
                  comments[post.id].map(comment => (
                    <div key={comment.id} className="bg-white rounded-lg shadow p-2">
                      <div className="text-xs text-gray-500 mb-1">
                        <Link to={`/user/${comment.user_id}`} className="font-semibold text-blue-600 hover:underline">{comment.author}</Link> •{' '}
                        <span>{new Date(comment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="text-gray-700 text-sm">{comment.content}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community;
