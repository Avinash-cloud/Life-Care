import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { counsellorAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import AddPostSessionAttachment from '../../components/counsellor/AddPostSessionAttachment';
import './Appointments.css';

const AppointmentDetail = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointment, setAppointment] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);

  useEffect(() => {
    fetchAppointmentDetail();
  }, [appointmentId]);

  const fetchAppointmentDetail = async () => {
    try {
      setLoading(true);
      const response = await counsellorAPI.getAppointment(appointmentId);
      const apt = response.data.data;
      setAppointment(apt);
      
      // Fetch attachments
      if (apt.status === 'completed') {
        try {
          const attachRes = await counsellorAPI.getAppointmentAttachments(appointmentId);
          setAttachments(attachRes.data.data);
        } catch (err) {
          console.log('No attachments found');
        }
      }
    } catch (error) {
      console.error('Error fetching appointment:', error);
      setError('Failed to load appointment details');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    if (!window.confirm(`Are you sure you want to mark this appointment as ${newStatus}?`)) return;
    
    try {
      await counsellorAPI.updateAppointmentStatus(appointmentId, newStatus);
      await fetchAppointmentDetail();
    } catch (error) {
      alert('Failed to update status: ' + (error.response?.data?.message || error.message));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !appointment) {
    return (
      <div className="text-center py-5">
        <div className="alert alert-danger">{error || 'Appointment not found'}</div>
        <button className="btn btn-primary" onClick={() => navigate('/counsellor/appointments')}>
          Back to Appointments
        </button>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      <div className="mb-3">
        <button className="btn btn-link" onClick={() => navigate('/counsellor/appointments')}>
          <i className="bi bi-arrow-left me-2"></i>Back to Appointments
        </button>
      </div>

      <div className="appointment-card">
        <div className="appointment-content">
          <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap" style={{gap: '1rem'}}>
            <div>
              <h2 className="mb-1">Appointment Details</h2>
              <p className="text-muted mb-0">Session with {appointment.client?.name}</p>
            </div>
            <span className={`status-badge ${getStatusClass(appointment.status)}`}>
              {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
            </span>
          </div>
          
          <div className="row g-3 mb-4">
            <div className="col-sm-6">
              <strong><i className="bi bi-person me-2"></i>Client:</strong>
              <p className="ms-4 mb-0">{appointment.client?.name || 'N/A'}</p>
            </div>
            <div className="col-sm-6">
              <strong><i className="bi bi-envelope me-2"></i>Email:</strong>
              <p className="ms-4 mb-0">{appointment.client?.email || 'N/A'}</p>
            </div>
            <div className="col-sm-6">
              <strong><i className="bi bi-phone me-2"></i>Phone:</strong>
              <p className="ms-4 mb-0">{appointment.client?.phone || 'N/A'}</p>
            </div>
            <div className="col-sm-6">
              <strong><i className="bi bi-calendar3 me-2"></i>Date:</strong>
              <p className="ms-4 mb-0">{formatDate(appointment.date)}</p>
            </div>
            <div className="col-sm-6">
              <strong><i className="bi bi-clock me-2"></i>Time:</strong>
              <p className="ms-4 mb-0">{appointment.startTime} - {appointment.endTime}</p>
            </div>
            <div className="col-sm-6">
              <strong><i className="bi bi-camera-video me-2"></i>Type:</strong>
              <p className="ms-4 mb-0 text-capitalize">{appointment.sessionType}</p>
            </div>
            <div className="col-sm-6">
              <strong><i className="bi bi-currency-rupee me-2"></i>Amount:</strong>
              <p className="ms-4 mb-0">₹{appointment.amount}</p>
            </div>
            <div className="col-sm-6">
              <strong><i className="bi bi-credit-card me-2"></i>Payment:</strong>
              <p className="ms-4 mb-0 text-capitalize">{appointment.payment?.status || 'N/A'}</p>
            </div>
          </div>

          {/* Shared Materials */}
          {attachments.length > 0 && (
            <div>
              <div className="d-flex align-items-center mb-3">
                <div className="bg-success bg-opacity-10 p-2 rounded me-3">
                  <i className="bi bi-file-earmark-medical fs-4 text-success"></i>
                </div>
                <div>
                  <h5 className="mb-0">Shared Materials</h5>
                  <small className="text-muted">{attachments.length} item(s) shared with client</small>
                </div>
              </div>
              <div className="row g-3">
                {attachments.map((attachment) => (
                  <div key={attachment._id} className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <h6 className="mb-1">
                          <i className={`bi bi-${attachment.category === 'prescription' ? 'prescription2' : attachment.category === 'medicine' ? 'capsule' : 'file-text'} me-2`}></i>
                          {attachment.title}
                        </h6>
                        {attachment.description && (
                          <p className="text-muted small mb-2">{attachment.description}</p>
                        )}
                        <span className="badge bg-secondary text-capitalize">{attachment.category}</span>
                        
                        {attachment.attachmentType === 'text' && (
                          <div className="mt-3 p-3 bg-light rounded">
                            <pre style={{whiteSpace: 'pre-wrap', margin: 0, fontFamily: 'inherit'}}>{attachment.content.text}</pre>
                          </div>
                        )}
                        
                        {attachment.attachmentType === 'image' && (
                          <div className="mt-3">
                            <img 
                              src={attachment.content.fileUrl} 
                              alt={attachment.title}
                              className="img-fluid rounded"
                              style={{maxHeight: '400px'}}
                            />
                          </div>
                        )}
                        
                        {attachment.attachmentType === 'document' && (
                          <div className="mt-3">
                            <a href={attachment.content.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-file-earmark-pdf me-2"></i>{attachment.content.fileName}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 d-flex gap-2 flex-wrap">
            {appointment.status === 'confirmed' && (
              <>
                {appointment.sessionType === 'video' ? (
                  <Link to={`/counsellor/video/${appointment._id}`} className="btn btn-primary">
                    <i className="bi bi-camera-video me-2"></i>Start Video
                  </Link>
                ) : appointment.sessionType === 'chat' ? (
                  <Link to={`/counsellor/chat/${appointment._id}`} className="btn btn-primary">
                    <i className="bi bi-chat-dots me-2"></i>Start Chat
                  </Link>
                ) : null}
                <button className="btn btn-success" onClick={() => handleStatusUpdate('completed')}>
                  <i className="bi bi-check-circle me-2"></i>Mark as Completed
                </button>
                <button className="btn btn-danger" onClick={() => handleStatusUpdate('cancelled')}>
                  <i className="bi bi-x-circle me-2"></i>Cancel
                </button>
              </>
            )}
            {appointment.status === 'completed' && user && ['psychiatrist', 'psychologist'].includes(user.counsellorType) && (
              <button className="btn btn-success" onClick={() => setShowAttachmentModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>Add Material
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Add Attachment Modal */}
      <AddPostSessionAttachment
        show={showAttachmentModal}
        onHide={() => setShowAttachmentModal(false)}
        appointment={appointment}
        onSuccess={() => {
          setShowAttachmentModal(false);
          fetchAppointmentDetail();
        }}
      />
    </div>
  );
};

export default AppointmentDetail;
