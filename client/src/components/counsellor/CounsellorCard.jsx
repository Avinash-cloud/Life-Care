import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CounsellorCard.css';

const CounsellorCard = ({ counsellor, onBookClick }) => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token') !== null;
  
  const handleBookNow = () => {
    if (onBookClick) {
      onBookClick();
    } else if (!isLoggedIn) {
      navigate('/login', { state: { from: window.location.pathname } });
    } else {
      navigate('/client/counsellors');
    }
  };
  
  const handleCloseModal = () => {
    setShowModal(false);
  };
  
  const handleLogin = () => {
    navigate('/login', { state: { from: window.location.pathname } });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    setShowModal(false);
    // Show success message or redirect
  };

  return (
    <>
      <div className="profile-card">
        <div className="profile-image-container">
          <img 
            src={counsellor.photo} 
            alt={counsellor.name} 
            className="profile-image"
          />
        </div>
        
        <div className="profile-info">
          <div className="profile-name-container">
            <h3 className="profile-name">{counsellor.name}</h3>
            {counsellor.verified && (
              <div className="verified-badge">
                <i className="bi bi-check-lg"></i>
              </div>
            )}
          </div>
          
          <p className="profile-title">{counsellor.specialization}</p>
          
          <div className="profile-stats">
            <div className="stat-item">
              <i className="bi bi-person"></i>
              <span>{counsellor.clientsHelped}+ Clients</span>
            </div>
            <div className="stat-item">
              <i className="bi bi-clock"></i>
              <span>{counsellor.experience} Years</span>
            </div>
          </div>
          
          <button 
            className="book-now-btn"
            onClick={handleBookNow}
          >
            {isLoggedIn ? 'Book Now' : 'Login to Book'}
          </button>
        </div>
      </div>
      
    </>
  );
};

export default CounsellorCard;