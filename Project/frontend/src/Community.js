import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_BASE = 'http://localhost/BookBase-Dev/Project/backend';

function Community() {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ title: '', content: '', author: '', userId: '' });
  const [comments, setComments] = useState({});
  const [commentForms, setCommentForms] = useState({});
  const [loading, setLoading] = useState(true);


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
        // Fetch comments for each post
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
    } catch (error) {
      console.error('Hiba a bejegyzések vagy kommentek betöltésekor:', error);
    } finally {
      setLoading(false);
    }
  };

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.author.trim()) return;
    try {
      const res = await fetch(`${API_BASE}/community_posts.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          author: form.author,
          userId: form.userId || '0',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setForm({ title: '', content: '', author: '', userId: '' });
        fetchPosts();
      }
    } catch (error) {
      console.error('Hiba a bejegyzés mentésekor:', error);
    }
  }

  function handleCommentChange(postId, e) {
    setCommentForms({
      ...commentForms,
      [postId]: {
        ...commentForms[postId],
        [e.target.name]: e.target.value,
      },
    });
  }

  async function handleCommentSubmit(postId, e) {
    e.preventDefault();
    const cf = commentForms[postId] || {};
    if (!cf.author || !cf.content) return;
    try {
      const res = await fetch(`${API_BASE}/community_comments.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          content: cf.content,
          author: cf.author,
          userId: cf.userId || '0',
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCommentForms({ ...commentForms, [postId]: { author: '', content: '', userId: '' } });
        fetchPosts();
      }
    } catch (error) {
      console.error('Hiba a komment mentésekor:', error);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-10 px-2 md:px-0 text-center">
        <div className="text-2xl text-blue-700">Betöltés...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-10 px-2 md:px-0">
      <h1 className="text-3xl font-black text-blue-700 mb-8 text-center tracking-tight drop-shadow">Közösségi beszélgetések</h1>
      <form className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-4 mb-10" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            name="author"
            placeholder="Neved"
            value={form.author}
            onChange={handleChange}
            required
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-base bg-gray-50"
          />
          <input
            name="userId"
            placeholder="User ID (teszthez)"
            value={form.userId}
            onChange={handleChange}
            style={{ display: 'none' }}
          />
          <input
            name="title"
            placeholder="Bejegyzés címe"
            value={form.title}
            onChange={handleChange}
            required
            className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-base bg-gray-50"
          />
        </div>
        <textarea
          name="content"
          placeholder="Írd le a gondolataidat..."
          value={form.content}
          onChange={handleChange}
          required
          className="px-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-base bg-gray-50 min-h-[80px]"
        />
        <button type="submit" className="self-end px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors">Új bejegyzés</button>
      </form>
      <div className="flex flex-col gap-8">
        {posts.map(post => (
          <div className="bg-white rounded-2xl shadow-lg p-6" key={post.id}>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-block w-2 h-6 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="text-xl font-bold text-blue-700 tracking-tight drop-shadow">{post.title}</span>
            </div>
            <div className="text-sm text-gray-500 mb-2">
              <Link to={`/user/${post.userId || '0'}`} className="font-semibold text-blue-600 hover:underline">{post.author}</Link> • <span>{post.date}</span>
            </div>
            <div className="mb-4 text-base text-gray-700 whitespace-pre-line">{post.content}</div>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-base font-semibold text-blue-700 mb-2">Hozzászólások</div>
              <form className="flex flex-col md:flex-row gap-2 mb-2" onSubmit={e => handleCommentSubmit(post.id, e)}>
                <input
                  name="author"
                  placeholder="Neved"
                  value={(commentForms[post.id]?.author || '')}
                  onChange={e => handleCommentChange(post.id, e)}
                  required
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-base bg-white"
                />
                <input
                  name="userId"
                  placeholder="User ID (teszthez)"
                  value={(commentForms[post.id]?.userId || '')}
                  onChange={e => handleCommentChange(post.id, e)}
                  style={{ display: 'none' }}
                />
                <input
                  name="content"
                  placeholder="Hozzászólás..."
                  value={(commentForms[post.id]?.content || '')}
                  onChange={e => handleCommentChange(post.id, e)}
                  required
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none text-base bg-white"
                />
                <button type="submit" className="px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white font-bold rounded-lg shadow transition-colors">Küldés</button>
              </form>
              <div className="flex flex-col gap-2">
                {(comments[post.id] || []).length === 0 && (
                  <div className="text-gray-400 italic">Még nincs hozzászólás.</div>
                )}
                {(comments[post.id] || []).map(comment => (
                  <div className="bg-white rounded-lg shadow p-2" key={comment.id}>
                    <div className="text-xs text-gray-500 mb-1">
                      <Link to={`/user/${comment.userId || '0'}`} className="font-semibold text-blue-600 hover:underline">{comment.author}</Link> • <span>{comment.date}</span>
                    </div>
                    <div className="text-gray-700 text-sm">{comment.content}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Community; 