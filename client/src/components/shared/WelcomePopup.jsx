import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/logo.png';
import './WelcomePopup.css';

const WelcomePopup = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    const hasSeenPopup = sessionStorage.getItem('welcomePopupSeen');
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem('welcomePopupSeen', 'true');
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div className={`welcome-popup-overlay ${isClosing ? 'closing' : ''}`} onClick={handleClose}>
      <div className={`welcome-popup-container ${isClosing ? 'closing' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="welcome-popup-close" onClick={handleClose}>
          <i className="bi bi-x-lg"></i>
        </button>
        
        <div className="welcome-popup-content">
          <div className="welcome-popup-logo">
            <img src={Logo} alt="SS Psychologist Life Care" />
          </div>
          
          <h2 className="welcome-popup-title">
            Welcome to <span className="text-gradient">SS Psychologist Life Care</span>
          </h2>
          
          <div className="welcome-popup-badge">
            <i className="bi bi-award-fill"></i>
            <span>20+ Years of Excellence</span>
          </div>
          
          <p className="welcome-popup-text">
            Trust us with your mental health. Our mission is to help you feel better, get better and stay better with 20 years of counselling experience.
          </p>
          
          <div className="welcome-popup-features">
            <div className="welcome-feature">
              <i className="bi bi-shield-check"></i>
              <span>Verified Professionals</span>
            </div>
            <div className="welcome-feature">
              <i className="bi bi-camera-video"></i>
              <span>Secure Sessions</span>
            </div>
            <div className="welcome-feature">
              <i className="bi bi-calendar-check"></i>
              <span>Flexible Scheduling</span>
            </div>
          </div>
          
          <div className="welcome-popup-actions">
            <Link to="/consilar" className="btn btn-primary btn-lg" onClick={handleClose}>
              <i className="bi bi-calendar-plus me-2"></i>Book a Session
            </Link>
            <button className="btn btn-outline-secondary btn-lg" onClick={handleClose}>
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomePopup;
