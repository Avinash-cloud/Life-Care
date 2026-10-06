import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../../assets/logo.png';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const collapseRef = useRef(null);

  const closeNavbar = () => {
    setMobileOpen(false);
  };

  const toggleNavbar = () => {
    setMobileOpen(prev => !prev);
  };

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (mobileOpen && collapseRef.current && !collapseRef.current.closest('.navbar').contains(e.target)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileOpen]);

  const handleLogout = async () => {
    await logout();
    closeNavbar();
  };

  return (
    <nav className={`navbar navbar-expand-lg ${isScrolled ? 'navbar-scrolled' : ''}`}>
      <div className="container-fluid px-xl-4 px-3" style={{ maxWidth: '1440px' }}>
        <Link className="navbar-brand me-2 me-lg-3 py-0" to="/" onClick={closeNavbar}>
          <div className="d-flex align-items-center">
            <img 
              src={Logo} 
              alt="SS Psychological Life Care Centre Logo" 
              className="logo-img me-2" 
              style={{ height: '52px', width: 'auto', flexShrink: 0 }} 
            />
            <div className="brand-text-wrapper d-flex flex-column text-start justify-content-center">
              <span className="brand-text-main">SS Psychological</span>
              <span className="brand-text-sub">Life Care Centre</span>
            </div>
          </div>
        </Link>

        <button className="navbar-toggler ms-auto" type="button" onClick={toggleNavbar} aria-expanded={mobileOpen} aria-label="Toggle navigation">
          <i className={`bi ${mobileOpen ? 'bi-x-lg' : 'bi-list'}`}></i>
        </button>

        <div
          ref={collapseRef}
          className={`navbar-collapse${mobileOpen ? ' mobile-menu-open' : ''}`}
          id="navbarContent"
        >
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
              <Link className={`nav-link ${isActive('/assessments') ? 'active' : ''}`} to="/assessments" onClick={closeNavbar}>Assessments</Link>
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
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name || 'User'} 
                    className="rounded-circle me-2" 
                    style={{ width: '32px', height: '32px', objectFit: 'cover' }}
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : null}
                <Link to={`/${user.role}/dashboard`} className="btn btn-outline-primary btn-sm me-2 text-nowrap" onClick={closeNavbar}>
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </Link>
                <button onClick={handleLogout} className="btn btn-primary btn-sm text-nowrap">
                  <i className="bi bi-box-arrow-right me-1"></i> Logout
                </button>
              </>
            ) : !loading ? (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm me-2 text-nowrap" onClick={closeNavbar}>
                  <i className="bi bi-box-arrow-in-right me-1"></i> Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm text-nowrap" onClick={closeNavbar}>
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