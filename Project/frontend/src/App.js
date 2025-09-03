// Alap CSS import a Tailwind stílusokhoz
import './output.css';

// React Router modulok importálása az útvonalak kezeléséhez
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Saját komponensek importálása
import Navbar from './Navbar'; // Oldal tetején megjelenő navigációs sáv
import Footer from './Footer'; // Oldal alján lévő footer
import Register from './Register'; // Regisztrációs oldal
import Login from './Login'; // Bejelentkezési oldal
import Search from './Search'; // Könyv kereső oldal
import Random from './random'; // Véletlenszerű könyv oldal
import RecentlyRead from './RecentlyRead'; // Legutóbb olvasott könyvek komponens
import NewBooks from './NewBooks'; // Újonnan hozzáadott könyvek komponens
import RecommendedBooks from './RecommendedBooks'; // Ajánlott könyvek komponens
import Top20List from './Top20List'; // Top 20 könyv lista komponens
import Card from './Card'; //  Általános kártya komponens, amit a többi dobozhoz használunk
import BookDetails from './BookDetails'; // Egy könyv részletes oldalát megjelenítő komponens
import Community from './Community'; // Közösségi fórum/posztok oldal
import UserProfile from './UserProfile'; // Felhasználói profil oldal
import ForgotPassword from './ForgotPassword'; // Elfelejtett jelszó
import AdminPanel from './AdminPanel'; //  Admin felület
import ResetPassword from './ResetPassword'; // Jelszó visszaállító oldal


//  Fő oldalon megjelenő komponens
function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-2 md:px-8">
      {/*  Kétoszlopos layout: fő tartalom + oldalsáv */}
      <section className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        
        {/* Fő tartalom oszlop */}
        <div className="flex-1 flex flex-col gap-10">

          {/* Újonnan hozzáadott könyvek kártya */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              {/* Színes animált jelző */}
              <span className="inline-block w-2 h-8 bg-blue-400 rounded-full animate-pulse"></span>
              {/* Cím */}
              <span className="text-2xl font-extrabold text-blue-700 tracking-tight drop-shadow">
                Újonnan hozzáadott könyvek
              </span>
            </div>
            <NewBooks /> {/* Komponens, ami listázza az új könyveket */}
          </Card>

          {/* Ajánlott könyvek kártya */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-2 h-8 bg-pink-400 rounded-full animate-pulse"></span>
              <span className="text-2xl font-extrabold text-pink-700 tracking-tight drop-shadow">
                Ajánlott könyvek
              </span>
            </div>
            <RecommendedBooks /> {/* Komponens, ami listázza az ajánlott könyveket */}
          </Card>
        </div>

        {/* Oldalsáv */}
        <aside className="w-full md:w-80 flex flex-col gap-10">

          {/* Legutóbb olvasott könyvek kártya */}
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-2 h-8 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-2xl font-extrabold text-green-700 tracking-tight drop-shadow">
                Legutóbb olvasottak
              </span>
            </div>
            <RecentlyRead /> {/* Komponens, ami listázza a felhasználó legutóbb olvasott könyveit */}
          </Card>

          {/* Top 20 könyv kártya */}
          <Card>
            <Link to="/top20" className="flex items-center gap-2 mb-4 group">
              <span className="inline-block w-2 h-8 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="text-2xl font-extrabold text-yellow-700 tracking-tight drop-shadow group-hover:underline">
                Top 20
              </span>
            </Link>
            <Top20List /> {/* Komponens, ami listázza a Top 20 könyvet */}
          </Card>

        </aside>
      </section>
    </main>
  );
}


// Alap App komponens, itt van a teljes router és oldalstruktúra
function App() {
  return (
    <Router>
      <Navbar /> {/* Minden oldal tetején megjelenő navigáció */}

      {/* Útvonalak definiálása */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Főoldal */}
        <Route path="/register" element={<Register />} /> {/* Regisztráció */}
        <Route path="/login" element={<Login />} /> {/*  Bejelentkezés */}
        <Route path="/community" element={<Community />} /> {/* Közösségi oldal */}
        <Route path="/search" element={<Search />} /> {/* Könyv kereső */}
        <Route path="/random" element={<Random />} /> {/* Véletlenszerű könyv */}
        <Route path="/top20" element={<Top20List />} /> {/* Top 20 lista */}
        <Route path="/book/:id" element={<BookDetails />} /> {/* Egy konkrét könyv részletei */}
        <Route path="/user/:id" element={<UserProfile />} /> {/* Felhasználói profil */}
        <Route path="/forgot-password" element={<ForgotPassword />} /> {/* Elfelejtett jelszó */}
        <Route path="/reset-password" element={<ResetPassword />} /> {/* Jelszó visszaállítás */}
        <Route path="/admin/AdminPanel" element={<AdminPanel />} /> {/* Admin felület */}
      </Routes>

      <Footer /> {/* Minden oldal alján megjelenő footer */}
    </Router>
  );
}

// App exportálása
export default App;
