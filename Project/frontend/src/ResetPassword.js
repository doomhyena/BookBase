import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function ResetPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage('A jelszavak nem egyeznek!');
            return;
        }
        if (newPassword.length < 6) {
            setMessage('A jelszónak legalább 6 karakter hosszúnak kell lennie!');
            return;
        }
        setLoading(true);
        try {
            const response = await fetch('http://localhost/BookBase-Dev/Project/backend/reset_password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: email,
                    new_password: newPassword 
                }),
            });
            const result = await response.json();
            if (result.success) {
                setMessage(result.message);
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(result.message || result.error || 'Hiba történt');
            }
        } catch (error) {
            setMessage('Hálózati hiba történt.');
        } finally {
            setLoading(false);
        }
    };
    
    return (
            <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-2 md:px-8">
                <div className="max-w-md mx-auto">
                    <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
                        <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Új jelszó megadása</h2>
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg ${
                                message.includes('sikeresen') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                                {message}
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email cím</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Új jelszó</label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Jelszó megerősítése</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 focus:border-blue-600 focus:ring-2 focus:ring-blue-200 outline-none text-base bg-blue-50/80 shadow-md"
                                    required
                                    minLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-bold rounded-xl shadow transition-colors"
                            >
                                {loading ? 'Feldolgozás...' : 'Jelszó módosítása'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
    );
}

export default ResetPassword;
