import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import './Feedback.css';

const Feedback = () => {
  const [searchParams] = useSearchParams();
  const appointmentId = searchParams.get('appointment');
  
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchCompletedAppointments();
    fetchReviews();
  }, []);

  // Debug logging
  console.log('Completed appointments:', completedAppointments);
  console.log('Reviews:', reviews);

  useEffect(() => {
    if (appointmentId && completedAppointments.length > 0) {
      const appointment = completedAppointments.find(app => app._id === appointmentId);
      if (appointment) {
        setSelectedAppointment(appointment);
      }
    }
  }, [appointmentId, completedAppointments]);

  const fetchCompletedAppointments = async () => {
    try {
      const response = await clientAPI.getAppointments();
      console.log('API Response for appointments:', response.data);
      setCompletedAppointments(response.data.data || []);
    } catch (error) {
      console.error('Error fetching completed appointments:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await clientAPI.getReviews();
      setReviews(response.data.data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const hasReviewForAppointment = (appointmentId) => {
    return reviews.some(review => review.appointment === appointmentId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAppointment) return;
    
    try {
      setLoading(true);
      const reviewData = {
        counsellor: selectedAppointment.counsellor._id,
        appointment: selectedAppointment._id,
        rating,
        comment: feedback
      };
      
      await clientAPI.submitReview(reviewData);
      setSubmitted(true);
      // Refresh reviews
      fetchReviews();
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setRating(0);
    setFeedback('');
    setSubmitted(false);
  };

  const getRatingText = (rating) => {
    switch(rating) {
      case 1: return 'Poor';
      case 2: return 'Fair';
      case 3: return 'Good';
      case 4: return 'Very Good';
      case 5: return 'Excellent';
      default: return '';
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-header">
        <h1>Session Feedback</h1>
        <p>Share your experience and help us improve our services</p>
      </div>
      
      {!submitted ? (
        <div className="feedback-card">
          <div className="feedback-card-header">
            <div className="header-icon">
              <i className="bi bi-star"></i>
            </div>
            <h5 className="mb-0">Leave Feedback</h5>
          </div>
          <div className="feedback-card-body">
            {!selectedAppointment ? (
              <div className="session-selection">
                <h6>Select a Session to Review</h6>
                <p className="text-muted mb-3">Choose from your completed sessions below:</p>
                {completedAppointments.length > 0 ? (
                  <div className="session-options">
                    {completedAppointments.map(appointment => (
                      <div 
                        key={appointment._id}
                        className="session-option"
                        onClick={() => handleSelectAppointment(appointment)}
                      >
                        <div className="session-option-info">
                          <strong>{appointment.counsellor?.user?.name || 'Counsellor'}</strong>
                          <span className="session-date">{new Date(appointment.date).toLocaleDateString()}</span>
                          <small className="text-muted">Status: {appointment.status}</small>
                        </div>
                        <i className="bi bi-chevron-right"></i>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted">No appointments found. Book an appointment first.</p>
                )}
              </div>
            ) : (
              <div className="session-info selected">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="session-title">
                      Session with {selectedAppointment.counsellor?.user?.name || 'Counsellor'}
                    </h6>
                    <div className="session-date">
                      <i className="bi bi-calendar"></i>
                      <span>{new Date(selectedAppointment.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <button 
                    type="button"
                    className="btn btn-sm btn-outline-secondary"
                    onClick={() => setSelectedAppointment(null)}
                  >
                    Change Session
                  </button>
                </div>
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="rating-container">
                <label className="rating-label">How would you rate your session?</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`bi ${star <= rating ? 'bi-star-fill star-filled' : 'bi-star star-empty'} star`}
                      onClick={() => setRating(star)}
                    ></i>
                  ))}
                </div>
                {rating > 0 && (
                  <div className="rating-text">
                    {getRatingText(rating)}
                  </div>
                )}
              </div>
              
              <div className="feedback-form">
                <label htmlFor="feedback" className="form-label">Your Feedback</label>
                <textarea
                  id="feedback"
                  className="form-textarea"
                  placeholder="Please share your experience with this counsellor..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                ></textarea>
              </div>
              
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={rating === 0 || !selectedAppointment || loading}
                >
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send"></i>
                      Submit Feedback
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="feedback-card">
          <div className="feedback-card-body success-message">
            <i className="bi bi-check-circle-fill success-icon"></i>
            <h4 className="success-title">Thank You for Your Feedback!</h4>
            <p className="success-text">Your feedback helps us improve our services and provide better mental health support.</p>
            <div className="success-actions">
              <button 
                className="back-button me-2"
                onClick={() => {
                  setSubmitted(false);
                  setSelectedAppointment(null);
                  setRating(0);
                  setFeedback('');
                }}
              >
                <i className="bi bi-arrow-left"></i>
                Leave Another Feedback
              </button>
              <Link to="/client/appointments" className="back-button">
                <i className="bi bi-calendar-check"></i>
                View Appointments
              </Link>
            </div>
          </div>
        </div>
      )}
      
      <div className="sessions-card">
        <div className="feedback-card-header">
          <div className="header-icon">
            <i className="bi bi-clock-history"></i>
          </div>
          <h5 className="mb-0">Past Sessions</h5>
        </div>
        <div className="feedback-card-body p-0">
          <div className="sessions-table-container">
            <table className="sessions-table">
              <thead>
                <tr>
                  <th>Counsellor</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {completedAppointments.length > 0 ? (
                  completedAppointments.map(appointment => {
                    const hasReview = hasReviewForAppointment(appointment._id);
                    return (
                      <tr key={appointment._id}>
                        <td>{appointment.counsellor?.user?.name || 'Counsellor'}</td>
                        <td>{new Date(appointment.date).toLocaleDateString()}</td>
                        <td>
                          {hasReview ? (
                            <span className="status-badge status-submitted">
                              <i className="bi bi-check-circle"></i>
                              Feedback Submitted
                            </span>
                          ) : (
                            <span className="status-badge status-pending">
                              <i className="bi bi-clock"></i>
                              Feedback Pending
                            </span>
                          )}
                        </td>
                        <td>
                          {!hasReview ? (
                            <button 
                              className="action-button action-primary"
                              onClick={() => handleSelectAppointment(appointment)}
                            >
                              <i className="bi bi-star"></i> Leave Feedback
                            </button>
                          ) : (
                            <button className="action-button action-secondary" disabled>
                              <i className="bi bi-check-circle"></i> Completed
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <div className="text-muted">
                        <i className="bi bi-calendar-x me-2"></i>
                        No completed sessions found
                      </div>
                      <Link to="/client/appointments" className="btn btn-sm btn-primary mt-2">
                        View All Appointments
                      </Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Feedback;