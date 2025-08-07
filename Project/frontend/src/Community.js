import React, { useState } from 'react';
import { Link } from 'react-router-dom';


const initialPosts = [
  {
    id: '1',
    author: 'Anna',
    userId: '1',
    title: 'Mit gondoltok a Gyűrűk Uráról?',
    content: 'Szerintem zseniális a világépítés és a karakterek! Ti mit szerettek benne?',
    date: '2024-05-10',
  },
  {
    id: '2',
    author: 'Béla',
    userId: '2',
    title: 'Ajánljatok modern sci-fit!',
    content: 'Olyan könyvet keresek, ami izgalmas és elgondolkodtató. Tippek?',
    date: '2024-05-11',
  },
];

const initialComments = {
  '1': [
    { id: 'c1', author: 'Gábor', userId: '2', content: 'Nekem is nagy kedvencem!', date: '2024-05-10' },
  ],
  '2': [],
};

function Community() {
  const [posts, setPosts] = useState(initialPosts);
  const [form, setForm] = useState({ title: '', content: '', author: '', userId: '' });
  const [comments, setComments] = useState(initialComments);
  const [commentForms, setCommentForms] = useState({});

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim() || !form.author.trim()) return;
    const newId = (Date.now()).toString();
    setPosts([
      {
        id: newId,
        author: form.author,
        userId: form.userId || '0',
        title: form.title,
        content: form.content,
        date: new Date().toISOString().slice(0, 10),
      },
      ...posts,
    ]);
    setComments({ ...comments, [newId]: [] });
    setForm({ title: '', content: '', author: '', userId: '' });
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

  function handleCommentSubmit(postId, e) {
    e.preventDefault();
    const cf = commentForms[postId] || {};
    if (!cf.author || !cf.content) return;
    setComments({
      ...comments,
      [postId]: [
        {
          id: 'c' + Date.now(),
          author: cf.author,
          userId: cf.userId || '0',
          content: cf.content,
          date: new Date().toISOString().slice(0, 10),
        },
        ...(comments[postId] || []),
      ],
    });
    setCommentForms({ ...commentForms, [postId]: { author: '', content: '', userId: '' } });
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