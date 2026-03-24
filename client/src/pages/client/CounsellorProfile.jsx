import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import './CounsellorProfile.css';

const CounsellorProfile = () => {
  const { counsellorId } = useParams();
  const [counsellor, setCounsellor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCounsellorProfile();
  }, [counsellorId]);

  const fetchCounsellorProfile = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getCounsellorProfile(counsellorId);
      setCounsellor(response.data.data);
    } catch (err) {
      setError('Failed to load counsellor profile');
      // Mock data fallback
      setCounsellor({
        _id: counsellorId,
        user: { name: 'Dr. Sarah Johnson', email: 'sarah@example.com' },
        gender: 'female',
        specializations: ['Depression', 'Anxiety', 'PTSD', 'Relationship Counseling'],
        experience: 8,
        languages: ['English', 'Hindi'],
        ratings: { average: 4.8, count: 124 },
        fees: { video: 1500, chat: 1200 },
        bio: 'Dr. Sarah is a licensed clinical psychologist with 8 years of experience helping individuals overcome depression, anxiety, and trauma. She specializes in cognitive behavioral therapy and has helped hundreds of clients achieve better mental health.',
        education: ['PhD in Clinical Psychology - Harvard University', 'Masters in Psychology - Stanford University'],
        certifications: ['Licensed Clinical Psychologist', 'CBT Certified Therapist'],
        isVerified: true,
        availability: 'Available for booking'
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading counsellor profile...</p>
      </div>
    );
  }

  if (error && !counsellor) {
    return (
      <div className="error-container">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  return (
    <div className="counsellor-profile-page">
      <div className="profile-header">
        <div className="profile-image-section">
          {counsellor.user?.avatar ? (
            <img 
              src={counsellor.user.avatar} 
              alt={counsellor.user?.name} 
              className="profile-image"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
          ) : null}
          <div className="profile-image-placeholder" style={{display: counsellor.user?.avatar ? 'none' : 'flex'}}>
            <i className="bi bi-person-circle"></i>
          </div>
        </div>
        
        <div className="profile-info">
          <div className="profile-badges">
            {counsellor.isVerified && (
              <span className="badge verified">
                <i className="bi bi-patch-check-fill"></i> Verified
              </span>
            )}
            <span className="badge experience">
              <i className="bi bi-clock-history"></i> {counsellor.experience}+ Years
            </span>
          </div>
          
          <h1 className="profile-name">{counsellor.user?.name}</h1>
          <p className="profile-title">Mental Health Professional</p>
          
          <div className="profile-tags">
            {counsellor.languages?.map((lang, index) => (
              <span key={index} className="tag language">{lang}</span>
            ))}
          </div>
          
          <div className="profile-actions">
            <Link to={`/client/book-appointment/${counsellor._id}`} className="btn btn-primary">
              <i className="bi bi-calendar-plus"></i> Book Appointment
            </Link>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="content-main">
          <section className="about-section">
            <h3><i className="bi bi-person"></i> About</h3>
            <p>{counsellor.bio}</p>
          </section>

          <section className="specializations-section">
            <h3><i className="bi bi-heart-pulse"></i> Specializations</h3>
            <div className="specializations-grid">
              {counsellor.specializations?.map((spec, index) => (
                <div key={index} className="specialization-item">
                  <i className="bi bi-check-circle-fill"></i>
                  <span>{spec}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="education-section">
            <h3><i className="bi bi-mortarboard"></i> Education & Certifications</h3>
            <div className="education-list">
              {counsellor.education?.map((edu, index) => (
                <div key={index} className="education-item">
                  <i className="bi bi-mortarboard-fill"></i>
                  <span>{edu}</span>
                </div>
              ))}
              {counsellor.certifications?.map((cert, index) => (
                <div key={index} className="education-item">
                  <i className="bi bi-award-fill"></i>
                  <span>{cert}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="content-sidebar">
          <div className="pricing-card">
            <h4>Session Fees</h4>
            <div className="fee-item">
              <span className="fee-type">Video Session</span>
              <span className="fee-amount">₹{counsellor.fees?.video}</span>
            </div>
            <div className="fee-item">
              <span className="fee-type">Chat Session</span>
              <span className="fee-amount">₹{counsellor.fees?.chat}</span>
            </div>
          </div>

          <div className="availability-card">
            <h4>Availability</h4>
            <div className="availability-status">
              <i className="bi bi-calendar-check"></i>
              <span>{counsellor.availability || 'Available for booking'}</span>
            </div>
          </div>

          <div className="contact-card">
            <h4>Languages</h4>
            <div className="languages-list">
              {counsellor.languages?.map((lang, index) => (
                <span key={index} className="language-tag">{lang}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CounsellorProfile;