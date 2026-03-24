import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { counsellorAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import AddPostSessionAttachment from '../../components/counsellor/AddPostSessionAttachment';
import './Appointments.css';
import '../client/Dashboard.css';

const Appointments = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    fetchAppointments();
  }, [activeFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (activeFilter !== 'all') params.status = activeFilter;
      if (dateFilter.startDate) params.startDate = dateFilter.startDate;
      if (dateFilter.endDate) params.endDate = dateFilter.endDate;
      
      const response = await counsellorAPI.getAppointments(params);
      setAppointments(response.data.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilterChange = (e) => {
    setDateFilter({
      ...dateFilter,
      [e.target.name]: e.target.value
    });
  };

  const handleDateFilterSubmit = (e) => {
    e.preventDefault();
    fetchAppointments();
  };

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status class
  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'confirmed': return 'status-confirmed';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'pending': return 'status-pending';
      case 'no-show': return 'status-no-show';
      default: return '';
    }
  };

  const handleAddAttachment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAttachmentModal(true);
  };

  const handleAttachmentSuccess = () => {
    // Refresh appointments or show success message
    fetchAppointments();
  };

  const canAddAttachment = (appointment) => {
    return appointment.status === 'completed' && 
             user?.counsellorType && 
           ['psychiatrist', 'psychologist'].includes(user.counsellorType);
  };

  return (
    <div className="appointments-page">
      <div className="appointments-header">
        <div className="d-flex align-items-center mb-2">
          <div className="stat-icon me-3">
            <i className="bi bi-calendar-check"></i>
          </div>
          <h1>Appointments</h1>
        </div>
        <p>Manage your scheduled sessions with clients</p>
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
      
      <div className="filter-card">
        <div className="p-4">
          <form onSubmit={handleDateFilterSubmit} className="filter-form">
            <div>
              <label htmlFor="startDate" className="form-label">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                className="form-control"
                value={dateFilter.startDate}
                onChange={handleDateFilterChange}
              />
            </div>
            <div>
              <label htmlFor="endDate" className="form-label">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                className="form-control"
                value={dateFilter.endDate}
                onChange={handleDateFilterChange}
              />
            </div>
            <div>
              <button type="submit" className="btn btn-primary w-100">
                <i className="bi bi-funnel me-2"></i>Apply Filter
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="appointments-list">
        {loading ? (
          <div className="empty-state">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading appointments...</p>
          </div>
        ) : appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment._id} className="appointment-card">
              <div className="appointment-content">
                <div className="appointment-info">
                  <h3 className="appointment-client">{appointment.client?.name || 'Client'}</h3>
                  <div className="appointment-meta">
                    <div className="meta-item">
                      <i className="bi bi-calendar"></i>
                      <span>{formatDate(appointment.date)}</span>
                    </div>
                    <div className="meta-item">
                      <i className="bi bi-clock"></i>
                      <span>{appointment.startTime} - {appointment.endTime}</span>
                    </div>
                  </div>
                  <div className="appointment-status">
                    <span className={`status-badge ${getStatusClass(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                    <span className="appointment-type">
                      {appointment.sessionType === 'video' ? 'Video Call' : 'Chat Session'}
                    </span>
                    {appointment.payment && (
                      <span className={`status-badge ${appointment.payment.status === 'completed' ? 'status-completed' : 'status-pending'}`}>
                        Payment: {appointment.payment.status.charAt(0).toUpperCase() + appointment.payment.status.slice(1)}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="appointment-actions">
                  {appointment.status === 'confirmed' && (
                    <>
                      {appointment.sessionType === 'video' ? (
                        <Link 
                          to={`/counsellor/video/${appointment._id}`}
                          className="btn-action btn-primary-action"
                        >
                          <i className="bi bi-camera-video"></i> Start Video
                        </Link>
                      ) : (
                        <Link 
                          to={`/counsellor/chat/${appointment._id}`}
                          className="btn-action btn-primary-action"
                        >
                          <i className="bi bi-chat-dots"></i> Start Chat
                        </Link>
                      )}
                    </>
                  )}
                  {canAddAttachment(appointment) && (
                    <button 
                      className="btn-action btn-success-action"
                      onClick={() => handleAddAttachment(appointment)}
                      title="Only psychiatrists and psychologists can add materials"
                    >
                      <i className="bi bi-plus-circle"></i> Add Material
                    </button>
                  )}
                  <Link to={`/counsellor/appointments/${appointment._id}`} className="btn-action btn-secondary-action">
                    <i className="bi bi-eye"></i> View Details
                  </Link>
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
            {activeFilter !== 'all' && (
              <button 
                className="btn-action btn-primary-action"
                onClick={() => setActiveFilter('all')}
              >
                View All Appointments
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Post-Session Attachment Modal */}
      <AddPostSessionAttachment
        show={showAttachmentModal}
        onHide={() => setShowAttachmentModal(false)}
        appointment={selectedAppointment}
        onSuccess={handleAttachmentSuccess}
      />
    </div>
  );
};

export default Appointments;