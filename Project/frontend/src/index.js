import React from 'react'; // React könyvtár importálása, szükséges JSX használatához
import ReactDOM from 'react-dom/client'; // ReactDOM a React alkalmazás DOM-ba történő rendereléséhez
// import './index.css'; // opcionális globális CSS import, most ki van kommentelve
import App from './App'; // az App komponens importálása, ez lesz a fő komponens
import reportWebVitals from './reportWebVitals'; // teljesítmény méréséhez szükséges modul

// React root létrehozása, ami a DOM 'root' id-jű elemére renderel
const root = ReactDOM.createRoot(document.getElementById('root'));

// Root-ba renderelés
root.render(
  <React.StrictMode>
    {/* Min-height teljes képernyőre, háttér gradient, flex layout */}
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 flex flex-col">
      <App/> {/* Fő alkalmazás komponens */}
    </div>
  </React.StrictMode>
);

// Web vitals mérés indítása (opcionális, teljesítmény figyelés)
reportWebVitals();
