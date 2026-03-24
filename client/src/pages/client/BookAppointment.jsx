import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './BookAppointment.css';

const BookAppointment = () => {
  const { counsellorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [counsellor, setCounsellor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [sessionType, setSessionType] = useState('video');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [slotLoading, setSlotLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Get counsellor details
  useEffect(() => {
    const fetchCounsellorDetails = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/client/counsellors/${counsellorId}`);
        setCounsellor(res.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load counsellor details');
        setLoading(false);
      }
    };
    
    fetchCounsellorDetails();
  }, [counsellorId]);
  
  // Get available slots when date changes
  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    setSelectedSlot(null);
    
    if (!date) return;
    
    try {
      setSlotLoading(true);
      const res = await api.get(`/appointments/available-slots?counsellorId=${counsellorId}&date=${date}`);
      setAvailableSlots(res.data.slots);
      setSlotLoading(false);
    } catch (err) {
      setError('Failed to load available slots');
      setSlotLoading(false);
    }
  };
  
  // Handle booking submission with Razorpay
  const handleBookAppointment = async (e) => {
    e.preventDefault();
    
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }
    
    try {
      setLoading(true);
      const appointmentData = {
        counsellorId,
        date: selectedDate,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        sessionType,
        notes
      };
      
      const res = await api.post('/appointments/book', appointmentData);
      const { appointment, razorpayOrder } = res.data.data;
      
      // Initialize Razorpay payment
      if (window.Razorpay) {
        // Real Razorpay payment
        const options = {
          key: razorpayOrder.key_id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'S S Psychologist Life Care',
          description: `Session with ${counsellor.user?.name || counsellor.name}`,
          order_id: razorpayOrder.id,
          handler: async function (response) {
            try {
              await api.post('/appointments/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId: appointment._id
              });
              
              setSuccess('Payment successful! Appointment confirmed.');
              setTimeout(() => {
                navigate('/client/appointments');
              }, 2000);
            } catch (error) {
              setError('Payment verification failed');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || ''
          },
          theme: {
            color: '#007bff'
          }
        };
        
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setError('Razorpay is not loaded. Please refresh the page.');
      }
      
      setLoading(false);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
      setLoading(false);
    }
  };
  
  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };
  
  // Format time for display (24h to 12h)
  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };
  
  if (loading && !counsellor) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading counsellor details...</p>
      </div>
    );
  }
  
  return (
    <div className="book-appointment-page">
      <div className="page-header">
        <h2>Book an Appointment</h2>
        <p>Schedule your session with a qualified mental health professional</p>
      </div>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {counsellor && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          <div className="counsellor-info-card">
            {counsellor.user?.avatar ? (
              <img 
                src={counsellor.user.avatar} 
                alt={counsellor.user?.name || counsellor.name}
                className="counsellor-image"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className="counsellor-image-placeholder" style={{display: counsellor.user?.avatar ? 'none' : 'flex'}}>
              <i className="bi bi-person-circle"></i>
            </div>
            
            <div className="counsellor-detail-book">
              <h3 className="counsellor-name">{counsellor.user?.name || counsellor.name}</h3>
              <p className="counsellor-title">Mental Health Professional</p>
              
              <div className="detail-item">
                <div className="detail-label">Specializations:</div>
                <div className="detail-value">{counsellor.specializations?.join(', ')}</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Experience:</div>
                <div className="detail-value">{counsellor.experience} years</div>
              </div>
              <div className="detail-item">
                <div className="detail-label">Languages:</div>
                <div className="detail-value">{counsellor.languages?.join(', ')}</div>
              </div>
              
              <div className="fee-highlight">
                ₹{counsellor.fees?.video || counsellor.fees} per session
              </div>
            </div>
          </div>
          
          <div className="booking-form-card">
            <form onSubmit={handleBookAppointment}>
              <div className="form-section">
                <div className="section-title">
                  <i className="bi bi-calendar3"></i>
                  Select Date
                </div>
                <input
                  type="date"
                  className="form-control"
                  min={getMinDate()}
                  value={selectedDate}
                  onChange={handleDateChange}
                  required
                />
              </div>
              
              {slotLoading ? (
                <div className="loading-slots">
                  <div className="spinner-border spinner-border-sm me-2"></div>
                  Loading available slots...
                </div>
              ) : (
                selectedDate && (
                  <div className="form-section">
                    <div className="section-title">
                      <i className="bi bi-clock"></i>
                      Select Time Slot
                    </div>
                    {availableSlots.length === 0 ? (
                      <div className="no-slots-message">
                        No slots available on this date. Please select another date.
                      </div>
                    ) : (
                      <div className="time-slots-grid">
                        {availableSlots.map((slot, index) => (
                          <button
                            key={index}
                            type="button"
                            className={`time-slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                            onClick={() => setSelectedSlot(slot)}
                          >
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              )}
              
              <div className="form-section">
                <div className="section-title">
                  <i className="bi bi-camera-video"></i>
                  Session Type
                </div>
                <div className="session-type-options">
                  <div 
                    className={`session-option ${sessionType === 'video' ? 'selected' : ''}`}
                    onClick={() => setSessionType('video')}
                  >
                    <i className="bi bi-camera-video"></i>
                    <div className="session-option-title">Video Call</div>
                    <div className="session-option-desc">Online video session</div>
                  </div>
                  <div 
                    className={`session-option ${sessionType === 'chat' ? 'selected' : ''}`}
                    onClick={() => setSessionType('chat')}
                  >
                    <i className="bi bi-chat-dots"></i>
                    <div className="session-option-title">Chat</div>
                    <div className="session-option-desc">Text-based session</div>
                  </div>
                  <div 
                    className={`session-option ${sessionType === 'in-person' ? 'selected' : ''}`}
                    onClick={() => setSessionType('in-person')}
                  >
                    <i className="bi bi-person"></i>
                    <div className="session-option-title">In-Person</div>
                    <div className="session-option-desc">Face-to-face meeting</div>
                  </div>
                </div>
              </div>
              
              <div className="form-section">
                <div className="section-title">
                  <i className="bi bi-journal-text"></i>
                  Notes (Optional)
                </div>
                <textarea
                  className="form-control"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any specific concerns or topics you'd like to discuss"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading || !selectedSlot}
                className="book-button"
              >
                {loading ? (
                  <>
                    <div className="spinner-border spinner-border-sm me-2"></div>
                    Processing...
                  </>
                ) : (
                  'Book Appointment'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookAppointment;