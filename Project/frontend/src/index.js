import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 flex flex-col">
      <App/>
    </div>
  </React.StrictMode>
);

reportWebVitals();
