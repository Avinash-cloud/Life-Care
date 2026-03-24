import React from 'react';
import { Link } from 'react-router-dom';

const AppointmentCard = ({ appointment, userRole, onReschedule, onCancel, onJoin }) => {
  // Format date and time
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  };

  // Determine status color
  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'completed': return 'info';
      default: return 'secondary';
    }
  };

  // Determine if appointment is upcoming (within next 24 hours)
  const isUpcoming = () => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.startTime}`);
    const now = new Date();
    const diffTime = appointmentDate - now;
    const diffHours = diffTime / (1000 * 60 * 60);
    return diffHours > 0 && diffHours < 24;
  };

  return (
    <div className={`appointment-card ${isUpcoming() ? 'upcoming' : ''}`}>
      <div className="appointment-header">
        <div className="appointment-date">
          <div className="date-badge">
            <span className="month">{new Date(appointment.date).toLocaleString('default', { month: 'short' })}</span>
            <span className="day">{new Date(appointment.date).getDate()}</span>
          </div>
          <div className="date-details">
            <h5>{formatDate(appointment.date)}</h5>
            <p>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</p>
          </div>
        </div>
        <div className={`appointment-status status-${getStatusColor(appointment.status)}`}>
          {appointment.status}
        </div>
      </div>
      
      <div className="appointment-body">
        <div className="profile-info">
          <img 
            src={userRole === 'client' ? appointment.counsellor.photo : appointment.client.photo} 
            alt={userRole === 'client' ? appointment.counsellor.name : appointment.client.name}
            className="profile-image"
          />
          <div className="profile-details">
            <h5>{userRole === 'client' ? appointment.counsellor.name : appointment.client.name}</h5>
            <p>{userRole === 'client' ? appointment.counsellor.specialization : 'Client'}</p>
          </div>
        </div>
        
        <div className="appointment-type">
          <span className="badge bg-light text-dark">
            <i className={`bi ${appointment.type === 'video' ? 'bi-camera-video' : 'bi-chat-dots'}`}></i>
            {appointment.type === 'video' ? 'Video Session' : 'Chat Session'}
          </span>
        </div>
      </div>
      
      <div className="appointment-footer">
        {appointment.status === 'confirmed' && (
          <button 
            className="btn btn-primary" 
            onClick={() => onJoin(appointment.id)}
            disabled={!isUpcoming()}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Join Session
          </button>
        )}
        
        {['confirmed', 'pending'].includes(appointment.status) && (
          <>
            <button 
              className="btn btn-outline-secondary" 
              onClick={() => onReschedule(appointment.id)}
            >
              <i className="bi bi-calendar me-2"></i>
              Reschedule
            </button>
            
            <button 
              className="btn btn-outline-danger" 
              onClick={() => onCancel(appointment.id)}
            >
              <i className="bi bi-x-circle me-2"></i>
              Cancel
            </button>
          </>
        )}
        
        {appointment.status === 'completed' && userRole === 'client' && (
          <Link 
            to={`/client/feedback/${appointment.id}`} 
            className="btn btn-outline-primary"
          >
            <i className="bi bi-star me-2"></i>
            Leave Feedback
          </Link>
        )}
        
        {appointment.status === 'completed' && userRole === 'counsellor' && (
          <Link 
            to={`/counsellor/session-notes/${appointment.id}`} 
            className="btn btn-outline-primary"
          >
            <i className="bi bi-journal-text me-2"></i>
            View/Edit Notes
          </Link>
        )}
      </div>
    </div>
  );
};

export default AppointmentCard;