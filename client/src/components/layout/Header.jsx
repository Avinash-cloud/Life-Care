import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../assets/logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated, loading } = useAuth();

  const closeNavbar = () => {
    const navbarCollapse = document.getElementById('navbarContent');
    if (navbarCollapse?.classList.contains('show')) {
      const bsCollapse = new window.bootstrap.Collapse(navbarCollapse, { toggle: false });
      bsCollapse.hide();
    }
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className={`navbar navbar-expand-lg ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container">
        <Link className="navbar-brand" to="/" onClick={closeNavbar}>
          <div className="d-flex align-items-center">
            <img src={Logo} alt="Life Care Logo" className="logo-img me-2" style={{ height: '70px' }} />
            <span className="brand-text">SS Psychologist Life Care</span>
          </div>
        </Link>
        
        <button className="navbar-toggler ms-auto" type="button" data-bs-toggle="collapse" data-bs-target="#navbarContent">
          <i className="bi bi-list"></i>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav mx-auto">
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/') ? 'active' : ''}`} to="/" onClick={closeNavbar}>Home</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/about') ? 'active' : ''}`} to="/about" onClick={closeNavbar}>About</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/blog') ? 'active' : ''}`} to="/blog" onClick={closeNavbar}>Blog</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/gallery') ? 'active' : ''}`} to="/gallery" onClick={closeNavbar}>Gallery</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/videos') ? 'active' : ''}`} to="/videos" onClick={closeNavbar}>Videos</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/contact') ? 'active' : ''}`} to="/contact" onClick={closeNavbar}>Contact</Link>
            </li>
            <li className="nav-item">
              <Link className={`nav-link ${isActive('/consilar') ? 'active' : ''}`} to="/consilar" onClick={closeNavbar}>Book Session</Link>
            </li>
          </ul>
          
          <div className="d-flex align-items-center">
            {!loading && isAuthenticated && user ? (
              <>
                {user.avatar && <img src={user.avatar} alt={user.name} className="rounded-circle me-2" style={{ width: '32px', height: '32px', objectFit: 'cover' }} />}
                <Link to={`/${user.role}/dashboard`} className="btn btn-outline-primary me-2" onClick={closeNavbar}>
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </Link>
                <button onClick={() => { handleLogout(); closeNavbar(); }} className="btn btn-primary">
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </>
            ) : !loading ? (
              <>
                <Link to="/login" className="btn btn-outline-primary me-2" onClick={closeNavbar}>
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link to="/register" className="btn btn-primary" onClick={closeNavbar}>
                  <i className="bi bi-person-plus me-1"></i> Register
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;