

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-r from-blue-600 to-yellow-400 py-8 px-2 mt-10 rounded-t-2xl shadow text-white">
      <div className="flex justify-center gap-6 mb-2 text-lg font-semibold">
        <a href="/" className="hover:underline hover:text-blue-900 transition">Kezdőlap</a>
        <span className="opacity-70">•</span>
        <a href="https://doomhyena.hu/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-blue-900 transition">Kapcsolat</a>
        <span className="opacity-70">•</span>
        <a href="https://github.com/doomhyena/BookBase" className="hover:underline hover:text-blue-900 transition">Info</a>
      </div>
      <p className="text-center text-white/90 font-medium italic text-base tracking-wide drop-shadow-sm">
        Copyright © 2025 BookBase
      </p>
    </footer>
  );
}
