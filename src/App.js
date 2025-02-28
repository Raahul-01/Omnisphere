import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import BreakingNews from './pages/BreakingNews';
import CategoryNews from './pages/CategoryNews';
import Navbar from './components/Navbar';
import './styles/news.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/breaking-news" element={<BreakingNews />} />
            <Route path="/category/:category" element={<CategoryNews />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App; 