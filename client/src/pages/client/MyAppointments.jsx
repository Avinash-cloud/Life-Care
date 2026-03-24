import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import InvoiceDownload from '../../components/client/InvoiceDownload';
import './MyAppointments.css';

const MyAppointments = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAppointments();
      
      // Update expired appointments status on frontend
      const now = new Date();
      const updatedAppointments = (response.data.data || []).map(apt => {
        if (apt.status === 'confirmed' && new Date(apt.date) < now) {
          return { ...apt, status: 'completed' };
        }
        return apt;
      });
      
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'pending': return 'status-pending';
      default: return '';
    }
  };
  
  const filteredAppointments = activeFilter === 'all' 
    ? appointments 
    : appointments.filter(app => app.status?.toLowerCase() === activeFilter.toLowerCase());

  const handleCancel = async (id, reason = 'Client requested cancellation') => {
    try {
      await clientAPI.cancelAppointment(id, reason);
      // Refresh appointments after cancellation
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    }
  };

  const handleReschedule = (id) => {
    // In a real app, this would open a reschedule modal
    alert(`Reschedule functionality coming soon for appointment ${id}`);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'Time TBD';
    return timeString;
  };

  if (loading) {
    return (
      <div className="appointments-page">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading your appointments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="appointments-page">
        <div className="text-center py-5">
          <div className="alert alert-danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {error}
          </div>
          <button className="btn btn-primary" onClick={fetchAppointments}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <h1>My Appointments</h1>
        <p>Manage your scheduled sessions with our counsellors</p>
      </div>
      
      <div className={`filter-tabs tab-${activeFilter === 'all' ? '1' : activeFilter === 'confirmed' ? '2' : activeFilter === 'completed' ? '3' : '4'}`}>
        <button 
          className={`filter-tab ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'confirmed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('confirmed')}
        >
          Upcoming
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveFilter('completed')}
        >
          Completed
        </button>
        <button 
          className={`filter-tab ${activeFilter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveFilter('cancelled')}
        >
          Cancelled
        </button>
      </div>
      
      <div className="appointments-list">
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map(appointment => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-content">
                <div className="appointment-info">
                  <h3 className="appointment-counsellor">
                    {appointment.counsellor?.user?.name || 'Counsellor'}
                  </h3>
                  <div className="appointment-meta">
                    <div className="meta-item">
                      <i className="bi bi-calendar"></i>
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="meta-item">
                      <i className="bi bi-clock"></i>
                      <span>{formatTime(appointment.startTime)} - {formatTime(appointment.endTime)}</span>
                    </div>
                    <div className="meta-item">
                      <i className="bi bi-currency-rupee"></i>
                      <span>₹{appointment.amount || 'N/A'}</span>
                    </div>
                  </div>
                  <div className="appointment-status">
                    <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                      {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1) || 'Unknown'}
                    </span>
                    <span className="appointment-type">
                      {appointment.sessionType === 'video' ? 'Video Call' : 'Chat Session'}
                    </span>
                  </div>
                </div>
                
                <div className="appointment-actions">
                  {appointment.status === 'confirmed' && (
                    <>
                      {appointment.sessionType === 'video' ? (
                        <Link 
                          to={`/client/video/${appointment._id}`}
                          className="btn-action btn-primary-action"
                        >
                          <i className="bi bi-camera-video"></i> Join Video
                        </Link>
                      ) : (
                        <Link 
                          to={`/client/chat/${appointment._id}`}
                          className="btn-action btn-primary-action"
                        >
                          <i className="bi bi-chat-dots"></i> Join Chat
                        </Link>
                      )}
                    </>
                  )}
                  {appointment.status === 'completed' && (
                    <>
                      <Link 
                        to={`/client/appointments/${appointment._id}`}
                        className="btn-action btn-secondary-action"
                      >
                        <i className="bi bi-eye"></i> View Details
                      </Link>
                      {!appointment.feedback && (
                        <Link 
                          to={`/client/feedback?appointment=${appointment._id}`}
                          className="btn-action btn-secondary-action"
                        >
                          <i className="bi bi-star"></i> Feedback
                        </Link>
                      )}
                      <InvoiceDownload appointment={appointment} />
                    </>
                  )}
                  {appointment.status === 'pending' && (
                    <>
                      <span className="btn-action btn-info-action">
                        <i className="bi bi-clock"></i> Awaiting Confirmation
                      </span>
                      <button 
                        className="btn-action btn-danger-action"
                        onClick={() => {
                          if (window.confirm('Are you sure you want to cancel this appointment?')) {
                            handleCancel(appointment._id);
                          }
                        }}
                      >
                        <i className="bi bi-x-circle"></i> Cancel
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <i className="bi bi-calendar-x"></i>
            </div>
            <h3>No appointments found</h3>
            <p>You don't have any {activeFilter !== 'all' ? activeFilter : ''} appointments</p>
            {activeFilter !== 'all' ? (
              <button 
                className="btn-action btn-primary-action"
                onClick={() => setActiveFilter('all')}
              >
                View All Appointments
              </button>
            ) : (
              <Link 
                to="/client/counsellors"
                className="btn-action btn-primary-action"
              >
                <i className="bi bi-plus-circle me-2"></i>Book Your First Session
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyAppointments;