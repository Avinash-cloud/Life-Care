import { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { clientAPI } from '../../services/api';
import PostSessionAttachments from '../../components/client/PostSessionAttachments';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    upcomingAppointments: [],
    totalAppointments: 0,
    completedAppointments: 0,
    recentAttachments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch upcoming appointments
        const upcomingRes = await clientAPI.getAppointments({ 
          status: 'confirmed',
          startDate: new Date().toISOString()
        });
        
        // Fetch all appointments count
        const allRes = await clientAPI.getAppointments();
        
        // Fetch completed appointments count
        const completedRes = await clientAPI.getAppointments({ status: 'completed' });
        
        // Fetch recent post-session attachments
        let recentAttachments = [];
        try {
          const attachmentsRes = await clientAPI.getPostSessionAttachments(1, 3);
          recentAttachments = attachmentsRes.data.data;
        } catch (error) {
          console.log('No attachments found or error fetching attachments');
        }
        
        setStats({
          upcomingAppointments: upcomingRes.data.data.slice(0, 3), // Show only 3 upcoming appointments
          totalAppointments: allRes.data.pagination.total,
          completedAppointments: completedRes.data.pagination.total,
          recentAttachments
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="client-dashboard">
      <h2 className="mb-4 text-gradient">Welcome to Your Wellness Journey</h2>
      
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body className="d-flex align-items-center p-3">
              <div className="stat-icon">
                <i className="bi bi-calendar-check"></i>
              </div>
              <div className="stat-content">
                <h5 className="stat-title">Upcoming Sessions</h5>
                <h2 className="stat-value">{stats.upcomingAppointments.length}</h2>
              </div>
              <Link to="/client/appointments" className="stat-link">
                <i className="bi bi-arrow-right"></i>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body className="d-flex align-items-center p-3">
              <div className="stat-icon">
                <i className="bi bi-check-circle"></i>
              </div>
              <div className="stat-content">
                <h5 className="stat-title">Completed Sessions</h5>
                <h2 className="stat-value">{stats.completedAppointments}</h2>
              </div>
              <Link to="/client/appointments?status=completed" className="stat-link">
                <i className="bi bi-arrow-right"></i>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body className="d-flex align-items-center p-3">
              <div className="stat-icon">
                <i className="bi bi-file-earmark-medical"></i>
              </div>
              <div className="stat-content">
                <h5 className="stat-title">Session Materials</h5>
                <h2 className="stat-value">{stats.recentAttachments.length}</h2>
              </div>
              <Link to="/client/attachments" className="stat-link">
                <i className="bi bi-arrow-right"></i>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col lg={8}>
          <Card className="dashboard-card mb-4">
            <Card.Header>
              <div className="d-flex align-items-center">
                <div className="card-icon">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h5 className="mb-0">Upcoming Appointments</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Loading your appointments...</p>
                </div>
              ) : stats.upcomingAppointments.length > 0 ? (
                <div className="appointment-list">
                  {stats.upcomingAppointments.map((appointment) => (
                    <div key={appointment._id} className="appointment-item">
                      <div className="appointment-content">
                        <div className="appointment-info">
                          <h6 className="appointment-title">
                            Session with {appointment.counsellor?.user?.name || 'Counsellor'}
                          </h6>
                          <div className="appointment-meta">
                            <span><i className="bi bi-calendar me-2"></i>{formatDate(appointment.date)}</span>
                            <span><i className="bi bi-clock me-2"></i>{appointment.startTime} - {appointment.endTime}</span>
                          </div>
                        </div>
                        <div className="appointment-actions">
                          <span className={`session-type ${appointment.sessionType === 'video' ? 'video' : 'chat'}`}>
                            {appointment.sessionType === 'video' ? 'Video Call' : 'Chat Session'}
                          </span>
                          <Link to={`/client/appointments/${appointment._id}`} className="appointment-link">
                            <i className="bi bi-arrow-right"></i>
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">
                    <i className="bi bi-calendar-x"></i>
                  </div>
                  <h6>No upcoming appointments</h6>
                  <p>Schedule a session with one of our counsellors</p>
                  <Link to="/client/counsellors" className="btn btn-primary btn-sm">
                    <i className="bi bi-plus-circle me-2"></i>Book a Session
                  </Link>
                </div>
              )}
              
              {stats.upcomingAppointments.length > 0 && (
                <div className="card-footer text-center">
                  <Link to="/client/appointments" className="view-all">
                    View All Appointments <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="dashboard-card action-card mb-4">
            <Card.Header>
              <div className="d-flex align-items-center">
                <div className="card-icon">
                  <i className="bi bi-lightning"></i>
                </div>
                <h5 className="mb-0">Quick Actions</h5>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="action-buttons">
                <Link to="/client/counsellors" className="action-button primary">
                  <div className="action-icon">
                    <i className="bi bi-calendar-plus"></i>
                  </div>
                  <div className="action-text">
                    <span>Book New Session</span>
                    <small>Find available counsellors</small>
                  </div>
                </Link>
                <Link to="/client/attachments" className="action-button secondary">
                  <div className="action-icon">
                    <i className="bi bi-file-earmark-medical"></i>
                  </div>
                  <div className="action-text">
                    <span>Session Materials</span>
                    <small>View prescriptions & resources</small>
                  </div>
                </Link>
                <Link to="/client/profile" className="action-button tertiary">
                  <div className="action-icon">
                    <i className="bi bi-person"></i>
                  </div>
                  <div className="action-text">
                    <span>Update Profile</span>
                    <small>Manage your information</small>
                  </div>
                </Link>
              </div>
            </Card.Body>
          </Card>
          
          <Card className="dashboard-card tips-card">
            <Card.Header>
              <div className="d-flex align-items-center">
                <div className="card-icon">
                  <i className="bi bi-lightbulb"></i>
                </div>
                <h5 className="mb-0">Wellness Tips</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <ul className="tips-list">
                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Practice mindfulness for 10 minutes daily</span>
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Stay hydrated and maintain a balanced diet</span>
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Get 7-8 hours of quality sleep</span>
                </li>
                <li>
                  <i className="bi bi-check-circle-fill"></i>
                  <span>Take short breaks during work hours</span>
                </li>
              </ul>
              <div className="card-footer text-end">
                <Link to="/blog" className="view-all">
                  Read more wellness tips <i className="bi bi-arrow-right ms-1"></i>
                </Link>
              </div>
            </Card.Body>
          </Card>
          
          {stats.recentAttachments.length > 0 && (
            <Card className="dashboard-card">
              <Card.Header>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="card-icon">
                      <i className="bi bi-file-earmark-medical"></i>
                    </div>
                    <h5 className="mb-0">Recent Session Materials</h5>
                  </div>
                  <Link to="/client/attachments" className="btn btn-outline-primary btn-sm">
                    View All
                  </Link>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="attachment-preview-list">
                  {stats.recentAttachments.map((attachment) => (
                    <div key={attachment._id} className="attachment-preview-item">
                      <div className="attachment-preview-content">
                        <div className="attachment-preview-info">
                          <h6 className="attachment-preview-title">{attachment.title}</h6>
                          <div className="attachment-preview-meta">
                            <Badge bg="secondary" className="me-2">{attachment.category}</Badge>
                            <small className="text-muted">
                              From: {attachment.counsellor.name} ({attachment.counsellor.counsellorType})
                            </small>
                          </div>
                        </div>
                        <div className="attachment-preview-date">
                          <small className="text-muted">
                            {new Date(attachment.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;