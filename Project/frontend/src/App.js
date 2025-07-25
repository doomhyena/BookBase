
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './Navbar';
import Footer from './Footer';

import Register from './Register';
import Login from './Login';
import Upload from './Upload';
import Search from './Search';
import Random from './random';

function Home() {
  return (
    <div className="App" style={{ minHeight: '100vh', background: 'linear-gradient(90deg, #ff6f61 0%, #ffb347 100%)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <header style={{ textAlign: 'center', background: 'rgba(255,255,255,0.90)', padding: '2rem 3rem', borderRadius: '1.5rem', boxShadow: '0 4px 24px rgba(0,0,0,0.10)' }}>
        <h1 style={{ color: '#ff6f61', fontSize: '2.5rem', marginBottom: '1rem', fontFamily: 'sans-serif', fontWeight: 700 }}>Üdvözöl a <span style={{ color: '#ffb347' }}>BookBase</span>!</h1>
        <p style={{ color: '#4a5568', fontSize: '1.2rem', marginBottom: '2rem', fontFamily: 'sans-serif' }}>
          Fedezd fel, rendszerezd és bővítsd a könyvgyűjteményedet egy helyen.<br />
          Kezdd el a keresést, vagy böngéssz a könyvek között!
        </p>
      </header>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Navbar />
      <div style={{ minHeight: '92vh', background: 'linear-gradient(90deg, #ff6f61 0%, #ffb347 100%)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/search" element={<Search />} />
          <Route path="/random" element={<Random />} />
        </Routes>
      </div>
      <Footer />
    </Router>
  );
}

export default App;
