import { useState, useEffect } from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { counsellorAPI } from '../../services/api';
import '../client/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    upcomingAppointments: [],
    totalAppointments: 0,
    earnings: {
      total: 0,
      pending: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch counsellor profile
        const profileRes = await counsellorAPI.getProfile();
        setProfile(profileRes.data.data);
        
        // Fetch upcoming appointments
        const upcomingRes = await counsellorAPI.getAppointments({ 
          status: 'confirmed',
          startDate: new Date().toISOString()
        });
        
        // Fetch all appointments count
        const allRes = await counsellorAPI.getAppointments();
        
        // Fetch earnings
        const earningsRes = await counsellorAPI.getEarnings();
        
        setStats({
          upcomingAppointments: upcomingRes.data.data.slice(0, 5), // Show only 5 upcoming appointments
          totalAppointments: allRes.data.pagination.total,
          earnings: earningsRes.data.data.earnings
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div className="client-dashboard">
      <div className="d-flex align-items-center mb-4">
        <div className="stat-icon me-3">
          <i className="bi bi-speedometer2"></i>
        </div>
        <h2 className="text-gradient mb-0">Counsellor Dashboard</h2>
      </div>
      
      {!profile?.isVerified && (
        <div className="alert alert-warning mb-4">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Your profile is pending verification. Please complete your profile and upload verification documents.
          <div className="mt-2">
            <Link to="/counsellor/profile" className="btn btn-sm btn-warning">Complete Profile</Link>
          </div>
        </div>
      )}
      
      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon">
                <i className="bi bi-calendar-check"></i>
              </div>
              <div className="stat-content">
                <h5 className="stat-title">Upcoming Sessions</h5>
                <h2 className="stat-value">{stats.upcomingAppointments.length}</h2>
              </div>
              <Link to="/counsellor/appointments" className="stat-link">
                <i className="bi bi-arrow-right"></i>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon">
                <i className="bi bi-wallet2"></i>
              </div>
              <div className="stat-content">
                <h5 className="stat-title">Total Earnings</h5>
                <h2 className="stat-value">{formatCurrency(stats.earnings.total)}</h2>
              </div>
              <Link to="/counsellor/earnings" className="stat-link">
                <i className="bi bi-arrow-right"></i>
              </Link>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon">
                <i className="bi bi-cash-coin"></i>
              </div>
              <div className="stat-content">
                <h5 className="stat-title">Pending Withdrawal</h5>
                <h2 className="stat-value">{formatCurrency(stats.earnings.pending)}</h2>
              </div>
              <Link to="/counsellor/earnings" className="stat-link">
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
                  <p className="mt-3">Loading appointments...</p>
                </div>
              ) : stats.upcomingAppointments.length > 0 ? (
                <div className="appointment-list">
                  {stats.upcomingAppointments.map((appointment) => (
                    <div key={appointment._id} className="appointment-item">
                      <div className="appointment-content">
                        <div className="appointment-info">
                          <h6 className="appointment-title">
                            Session with {appointment.client?.name || 'Client'}
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
                          <Link to={`/counsellor/appointments/${appointment._id}`} className="appointment-link">
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
                  <p>Update your availability to get more bookings</p>
                  <Link to="/counsellor/availability" className="btn btn-primary btn-sm">
                    <i className="bi bi-calendar-plus me-2"></i>Update Availability
                  </Link>
                </div>
              )}
              
              {stats.upcomingAppointments.length > 0 && (
                <div className="card-footer text-center">
                  <Link to="/counsellor/appointments" className="view-all">
                    View All Appointments <i className="bi bi-arrow-right ms-1"></i>
                  </Link>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="dashboard-card mb-4">
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
                <Link to="/counsellor/availability" className="action-button primary">
                  <div className="action-icon">
                    <i className="bi bi-calendar-week"></i>
                  </div>
                  <div className="action-text">
                    <span>Update Availability</span>
                    <small>Manage your schedule</small>
                  </div>
                </Link>

                <Link to="/counsellor/profile" className="action-button tertiary">
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
          
          <Card className="dashboard-card">
            <Card.Header>
              <div className="d-flex align-items-center">
                <div className="card-icon">
                  <i className="bi bi-check-circle"></i>
                </div>
                <h5 className="mb-0">Profile Completion</h5>
              </div>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Profile Completion</span>
                      <span>{profile ? '80%' : '0%'}</span>
                    </div>
                    <div className="progress">
                      <div 
                        className="progress-bar bg-primary" 
                        role="progressbar" 
                        style={{ width: profile ? '80%' : '0%' }}
                        aria-valuenow={profile ? 80 : 0} 
                        aria-valuemin="0" 
                        aria-valuemax="100"
                      ></div>
                    </div>
                  </div>
                  
                  <ul className="list-group list-group-flush mb-3">
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Basic Information
                      <span className="badge bg-primary rounded-pill">
                        <i className="bi bi-check-lg"></i>
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Qualifications
                      <span className="badge bg-primary rounded-pill">
                        <i className="bi bi-check-lg"></i>
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Availability
                      <span className="badge bg-primary rounded-pill">
                        <i className="bi bi-check-lg"></i>
                      </span>
                    </li>
                    <li className="list-group-item d-flex justify-content-between align-items-center px-0">
                      Verification Documents
                      <span className={`badge ${profile?.isVerified ? 'bg-primary' : 'bg-warning'} rounded-pill`}>
                        {profile?.isVerified ? <i className="bi bi-check-lg"></i> : <i className="bi bi-exclamation-lg"></i>}
                      </span>
                    </li>
                  </ul>
                  
                  <Link to="/counsellor/profile" className="btn btn-outline-primary btn-sm">
                    Complete Profile
                  </Link>
                </>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;