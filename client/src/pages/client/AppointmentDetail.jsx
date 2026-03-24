import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import InvoiceDownload from '../../components/client/InvoiceDownload';
import './MyAppointments.css';

const AppointmentDetail = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchAppointmentDetail();
  }, [appointmentId]);

  const fetchAppointmentDetail = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getAppointment(appointmentId);
      setAppointment(response.data.data);
      
      // Fetch attachments if appointment is completed
      if (response.data.data.status === 'completed') {
        try {
          const attachRes = await clientAPI.getPostSessionAttachments();
          const aptAttachments = attachRes.data.data.filter(a => a.appointment._id === appointmentId);
          setAttachments(aptAttachments);
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

  const handleCancel = async () => {
    if (!window.confirm('Are you sure you want to cancel this appointment?')) return;
    
    const reason = prompt('Please provide a reason for cancellation (optional):');
    try {
      setCancelling(true);
      await clientAPI.cancelAppointment(appointmentId, reason || 'Client requested cancellation');
      await fetchAppointmentDetail();
    } catch (error) {
      alert('Failed to cancel appointment: ' + (error.response?.data?.message || error.message));
    } finally {
      setCancelling(false);
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
        <button className="btn btn-primary" onClick={() => navigate('/client/appointments')}>
          Back to Appointments
        </button>
      </div>
    );
  }

  return (
    <div className="appointments-page">
      <div className="mb-3">
        <button className="btn btn-link" onClick={() => navigate('/client/appointments')}>
          <i className="bi bi-arrow-left me-2"></i>Back to Appointments
        </button>
      </div>

      <div className="appointment-card">
        <div className="appointment-content">
          <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap" style={{gap: '1rem'}}>
            <div>
              <h2 className="mb-1">Appointment Details</h2>
              <p className="text-muted mb-0">Session with {appointment.counsellor?.user?.name}</p>
            </div>
            <span className={`status-badge ${getStatusClass(appointment.status)}`}>
              {appointment.status?.charAt(0).toUpperCase() + appointment.status?.slice(1)}
            </span>
          </div>
          
          <div className="row g-3">
            <div className="col-sm-6">
              <strong><i className="bi bi-person me-2"></i>Counsellor:</strong>
              <p className="ms-4 mb-0">{appointment.counsellor?.user?.name || 'N/A'}</p>
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

          {appointment.cancellation && (
            <div className="alert alert-warning mt-4">
              <h6 className="alert-heading"><i className="bi bi-exclamation-triangle me-2"></i>Cancelled</h6>
              <p className="mb-1"><strong>Reason:</strong> {appointment.cancellation.reason}</p>
              <p className="mb-0"><strong>Refund:</strong> <span className="text-capitalize">{appointment.cancellation.refundStatus}</span></p>
            </div>
          )}

          {/* Session Notes */}
          {appointment.sessionNotes && appointment.sessionNotes.length > 0 && appointment.sessionNotes[0].publicNotes && (
            <div className="mt-4">
              <h5><i className="bi bi-journal-text me-2"></i>Session Notes</h5>
              <div className="card">
                <div className="card-body">
                  <p className="mb-0">{appointment.sessionNotes[0].publicNotes}</p>
                  <small className="text-muted d-block mt-2">
                    {new Date(appointment.sessionNotes[0].createdAt).toLocaleString()}
                  </small>
                </div>
              </div>
            </div>
          )}

          {/* Post-Session Materials */}
          {attachments.length > 0 && (
            <div className="mt-4">
              <div className="d-flex align-items-center mb-3">
                <div className="bg-primary bg-opacity-10 p-2 rounded me-3">
                  <i className="bi bi-file-earmark-medical fs-4 text-primary"></i>
                </div>
                <div>
                  <h5 className="mb-0">Prescriptions & Materials</h5>
                  <small className="text-muted">Shared by your counsellor</small>
                </div>
              </div>
              <div className="row g-3">
                {attachments.map((attachment) => (
                  <div key={attachment._id} className="col-12">
                    <div className="card">
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <h6 className="mb-1">
                              <i className={`bi bi-${attachment.category === 'prescription' ? 'prescription2' : attachment.category === 'medicine' ? 'capsule' : 'file-text'} me-2`}></i>
                              {attachment.title}
                            </h6>
                            {attachment.description && (
                              <p className="text-muted small mb-2">{attachment.description}</p>
                            )}
                            <span className="badge bg-secondary text-capitalize">{attachment.category}</span>
                          </div>
                        </div>
                        
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
                              style={{maxHeight: '400px', objectFit: 'contain'}}
                            />
                          </div>
                        )}
                        
                        {attachment.attachmentType === 'document' && (
                          <div className="mt-3">
                            <a 
                              href={attachment.content.fileUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary"
                            >
                              <i className="bi bi-download me-2"></i>Download {attachment.content.fileName}
                            </a>
                          </div>
                        )}
                        
                        <small className="text-muted d-block mt-2">
                          Shared on {new Date(attachment.createdAt).toLocaleString()}
                        </small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {appointment.feedback && (
            <div className="mt-4">
              <h5><i className="bi bi-star me-2"></i>Your Feedback</h5>
              <div className="card">
                <div className="card-body">
                  <div className="mb-2">
                    <strong>Rating:</strong> {appointment.feedback.rating}/5 ⭐
                  </div>
                  {appointment.feedback.comment && (
                    <p className="mb-0">{appointment.feedback.comment}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 d-flex gap-2 flex-wrap" style={{gap: '0.5rem'}}>
            {appointment.status === 'confirmed' && (
              <>
                {appointment.sessionType === 'video' ? (
                  <Link to={`/client/video/${appointment._id}`} className="btn btn-primary">
                    <i className="bi bi-camera-video me-2"></i>Join Video
                  </Link>
                ) : appointment.sessionType === 'chat' ? (
                  <Link to={`/client/chat/${appointment._id}`} className="btn btn-primary">
                    <i className="bi bi-chat-dots me-2"></i>Join Chat
                  </Link>
                ) : null}
                <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling}>
                  <i className="bi bi-x-circle me-2"></i>{cancelling ? 'Cancelling...' : 'Cancel Appointment'}
                </button>
              </>
            )}
            {appointment.status === 'completed' && (
              <>
                {!appointment.feedback && (
                  <Link to={`/client/feedback?appointment=${appointment._id}`} className="btn btn-primary">
                    <i className="bi bi-star me-2"></i>Leave Feedback
                  </Link>
                )}
                <InvoiceDownload appointment={appointment} />
              </>
            )}
            {appointment.status === 'pending' && (
              <button className="btn btn-danger" onClick={handleCancel} disabled={cancelling}>
                <i className="bi bi-x-circle me-2"></i>{cancelling ? 'Cancelling...' : 'Cancel Appointment'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetail;
