// React és hook-ok importálása
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
    // navigate: átirányítás a felhasználót másik oldalra
    const navigate = useNavigate();

    // State változók a mezőkhöz és státuszhoz
    const [email, setEmail] = useState('');                // Felhasználó email címe
    const [newPassword, setNewPassword] = useState('');    // Új jelszó
    const [confirmPassword, setConfirmPassword] = useState(''); // Új jelszó megerősítése
    const [message, setMessage] = useState('');            // Visszajelző üzenet
    const [loading, setLoading] = useState(false);         // Betöltési állapot (pl. gomb tiltás)

    // Form elküldésekor fut le
    const handleSubmit = async (e) => {
        e.preventDefault(); // ne töltse újra az oldalt

        // Ellenőrzés: a két jelszó egyezik-e
        if (newPassword !== confirmPassword) {
            setMessage('A jelszavak nem egyeznek!');
            return;
        }

        // Ellenőrzés: minimum jelszó hossz
        if (newPassword.length < 6) {
            setMessage('A jelszónak legalább 6 karakter hosszúnak kell lennie!');
            return;
        }

        setLoading(true); // elkezdődik a "feldolgozás"
        try {
            // POST kérés küldése a backendnek
            const response = await fetch('http://localhost/BookBase-Dev/Project/backend/reset_password.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // JSON formátum
                },
                body: JSON.stringify({ 
                    email: email,               // megadott email
                    new_password: newPassword   // új jelszó
                }),
            });

            // JSON válasz feldolgozása
            const result = await response.json();

            // Ha a backend success-et ad vissza
            if (result.success) {
                setMessage(result.message); // pl. "Sikeres jelszócsere!"
                
                // 2 másodperc múlva átirányítjuk login oldalra
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                // Ha hiba van, akkor is kiírjuk az üzenetet
                setMessage(result.message || result.error || 'Hiba történt');
            }
        } catch (error) {
            // Ha a fetch dob hibát (pl. nincs kapcsolat)
            setMessage('Hálózati hiba történt.');
        } finally {
            // Mindig lefut, kikapcsoljuk a "loading"-ot
            setLoading(false);
        }
    };
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-2 md:px-8">
            <div className="max-w-md mx-auto">
                <div className="bg-white/90 rounded-3xl shadow-2xl p-8">
                    
                    {/* Cím */}
                    <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center">Új jelszó megadása</h2>

                    {/* Üzenet (siker vagy hiba) */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg ${
                            message.includes('sikeresen') 
                                ? 'bg-green-100 text-green-700' // sikeres üzenet zöld
                                : 'bg-red-100 text-red-700'     // hibaüzenet piros
                        }`}>
                            {message}
                        </div>
                    )}

                    {/* Form a jelszó resethez */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Email mező */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Email cím</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} // állapot frissítése
                                className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 
                                           focus:border-blue-600 focus:ring-2 focus:ring-blue-200 
                                           outline-none text-base bg-blue-50/80 shadow-md"
                                required
                            />
                        </div>

                        {/* Új jelszó mező */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Új jelszó</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)} // állapot frissítése
                                className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 
                                           focus:border-blue-600 focus:ring-2 focus:ring-blue-200 
                                           outline-none text-base bg-blue-50/80 shadow-md"
                                required
                                minLength={6} // minimum hossz
                            />
                        </div>

                        {/* Jelszó megerősítése mező */}
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Jelszó megerősítése</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)} // állapot frissítése
                                className="w-full px-4 py-3 rounded-xl border-2 border-blue-400 
                                           focus:border-blue-600 focus:ring-2 focus:ring-blue-200 
                                           outline-none text-base bg-blue-50/80 shadow-md"
                                required
                                minLength={6}
                            />
                        </div>

                        {/* Submit gomb */}
                        <button
                            type="submit"
                            disabled={loading} // ha feldolgozás alatt van, gomb letiltva
                            className="w-full py-3 bg-blue-600 hover:bg-blue-700 
                                       disabled:bg-blue-400 text-white font-bold rounded-xl 
                                       shadow transition-colors"
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
