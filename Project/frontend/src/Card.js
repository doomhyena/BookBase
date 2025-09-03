import React from 'react';

// Card komponens: egy általános keret (box), amibe bármilyen tartalom tehető
// title: opcionális cím, children: a Card-ba tett belső elemek
function Card({ title, children }) {
  return (
    // Fő container, fehér háttér, lekerekített sarkok, árnyék, padding, teljes szélesség, alul margó
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full mb-4">
      {/* Ha van title prop, akkor megjelenítjük */}
      {title && (
        <div className="text-lg font-bold text-blue-700 mb-4">
          {title} {/* 🔹 A Card címe */}
        </div>
      )}
      {/* Children: a Card-ba tett összes tartalom */}
      {children}
    </div>
  );
}

// Komponens exportálása, hogy más fájlokban is használható legyen
export default Card;