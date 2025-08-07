import React from 'react';


function Card({ title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 w-full mb-4">
      {title && <div className="text-lg font-bold text-blue-700 mb-4">{title}</div>}
      {children}
    </div>
  );
}

export default Card;
