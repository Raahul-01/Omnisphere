import { Link } from 'react-router-dom';
import '../styles/navbar.css';

const Navbar = () => {
  const categories = ['Finance', 'Technology', 'Sports', 'Entertainment'];

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">NewsApp</Link>
      </div>
      
      <div className="nav-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/breaking-news" className="nav-link">Breaking News</Link>
        
        <div className="dropdown">
          <button className="dropbtn">Categories</button>
          <div className="dropdown-content">
            {categories.map(category => (
              <Link 
                key={category} 
                to={`/category/${category.toLowerCase()}`}
                className="dropdown-link"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 