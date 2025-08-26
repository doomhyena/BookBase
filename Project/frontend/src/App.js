import './output.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Register from './Register';
import Login from './Login';
import Search from './Search';
import Random from './random';
import RecentlyRead from './RecentlyRead';
import NewBooks from './NewBooks';
import RecommendedBooks from './RecommendedBooks';
import Top20List from './Top20List';
import Card from './Card';
import BookDetails from './BookDetails';
import Community from './Community';
import UserProfile from './UserProfile';
import ForgotPassword from './ForgotPassword';
import AdminPanel from './AdminPanel';
import ResetPassword from './ResetPassword';



function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-blue-200 py-10 px-2 md:px-8">
      <section className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        <div className="flex-1 flex flex-col gap-10">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-2 h-8 bg-blue-400 rounded-full animate-pulse"></span>
              <span className="text-2xl font-extrabold text-blue-700 tracking-tight drop-shadow">Újonnan hozzáadott könyvek</span>
            </div>
            <NewBooks />
          </Card>
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-2 h-8 bg-pink-400 rounded-full animate-pulse"></span>
              <span className="text-2xl font-extrabold text-pink-700 tracking-tight drop-shadow">Ajánlott könyvek</span>
            </div>
            <RecommendedBooks />
          </Card>
        </div>
        <aside className="w-full md:w-80 flex flex-col gap-10">
          <Card>
            <div className="flex items-center gap-2 mb-4">
              <span className="inline-block w-2 h-8 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-2xl font-extrabold text-green-700 tracking-tight drop-shadow">Legutóbb olvasottak</span>
            </div>
            <RecentlyRead />
          </Card>
          <Card>
            <Link to="/top20" className="flex items-center gap-2 mb-4 group">
              <span className="inline-block w-2 h-8 bg-yellow-400 rounded-full animate-pulse"></span>
              <span className="text-2xl font-extrabold text-yellow-700 tracking-tight drop-shadow group-hover:underline">Top 20</span>
            </Link>
            <Top20List />
          </Card>
        </aside>
      </section>
    </main>
  );
}


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/community" element={<Community />} />
        <Route path="/search" element={<Search />} />
        <Route path="/random" element={<Random />} />
        <Route path="/top20" element={<Top20List />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/user/:id" element={<UserProfile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin/AdminPanel" element={<AdminPanel />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;

/* 
npx tailwindcss -i ./src/tailwind.css -o ./src/output.css --watch 
*/
