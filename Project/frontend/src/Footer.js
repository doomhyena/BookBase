// React komponens exportálása, ami a Footer-t jeleníti meg
export default function Footer() {
  return (
    // Footer HTML elem, teljes szélességű, háttér gradienttel, paddinggel, lekerekített sarkokkal és árnyékkal
    <footer className="w-full bg-gradient-to-r from-blue-600 to-yellow-400 py-8 px-2 mt-10 rounded-t-2xl shadow text-white">
      
      {/* Felső link sor, középre igazítva, gap-ekkel és betűstílussal */}
      <div className="flex justify-center gap-6 mb-2 text-lg font-semibold">
        
        {/* Link a kezdőlapra */}
        <a href="/" className="hover:underline hover:text-blue-900 transition">Kezdőlap</a>
        
        {/* Elválasztó pont */}
        <span className="opacity-70">•</span>
        
        {/* Link a kapcsolati oldalra, új ablakban nyílik, biztonsági rel attributumokkal */}
        <a href="https://doomhyena.hu/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-900 transition">Kapcsolat</a>
        
        {/* Elválasztó pont */}
        <span className="opacity-70">•</span>
        
        {/*  Link a GitHub repository-hoz */}
        <a href="https://github.com/doomhyena/BookBase" className="hover:underline hover:text-blue-900 transition">Info</a>
      </div>

      {/* Alsó sor, középre igazítva, kisebb szöveg, fél átlátszóság, dőlt betű, árnyék */}
      <p className="text-center text-white/90 font-medium italic text-base tracking-wide drop-shadow-sm">
        Copyright © 2025 BookBase
      </p>
    </footer>
  );
}
