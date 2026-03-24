import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer-premium">
      <div className="container">
        <div className="footer-content">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo-wrapper">
              <img src={Logo} alt="Life Care Logo" className="footer-logo-img" />
              <div className="footer-brand-text">
                <span className="footer-brand-name">SS Psychologist</span>
                <span className="footer-brand-tagline">Life Care</span>
              </div>
            </div>
            <p className="footer-description">
              Professional mental health support with compassion, expertise, and confidentiality.
            </p>
            <div className="footer-social">
              <a href="https://www.instagram.com/psychological_life_care?igsh=N2Z5NnZoaXI0NmVv&utm_source=qr" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Instagram">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://www.youtube.com/@monikr5665" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="YouTube">
                <i className="bi bi-youtube"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-links-group">
            <h6 className="footer-heading">Quick Links</h6>
            <ul className="footer-links">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/blog" className="footer-link">Blog</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-links-group">
            <h6 className="footer-heading">Resources</h6>
            <ul className="footer-links">
              <li><Link to="/videos" className="footer-link">Educational Videos</Link></li>
              <li><Link to="/gallery" className="footer-link">Gallery</Link></li>
              <li><Link to="/faq" className="footer-link">FAQs</Link></li>
              <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-contact">
            <h6 className="footer-heading">Get in Touch</h6>
            <div className="footer-contact-item">
              <i className="bi bi-geo-alt footer-contact-icon"></i>
              <div>
                <p className="footer-contact-text">Dwarka Sector 6, 110075</p>
                <p className="footer-contact-text">A15, Paschim Vihar, 110087</p>
                <p className="footer-contact-text">773, Sector A, Vasant Kunj, 110070</p>
              </div>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-telephone footer-contact-icon"></i>
              <div>
                <a href="tel:9716129129" className="footer-link">9716129129</a>
                <a href="tel:9899555507" className="footer-link">9899555507</a>
              </div>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-envelope footer-contact-icon"></i>
              <a href="mailto:contact@plcc.in" className="footer-link">contact@plcc.in</a>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            &copy; {currentYear} S S Psychologist Life Care. All rights reserved.
          </p>
          <div className="footer-legal">
            <Link to="/privacy" className="footer-link">Privacy Policy</Link>
            <span className="footer-divider">•</span>
            <Link to="/terms" className="footer-link">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;