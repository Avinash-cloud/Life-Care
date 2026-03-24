import { useState, useEffect } from 'react';
import { Row, Col, Card, Table, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import '../client/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: {
      total: 0,
      clients: 0,
      counsellors: 0
    },
    appointments: {
      total: 0,
      pending: 0,
      completed: 0
    },
    finances: {
      totalRevenue: 0,
      pendingWithdrawals: 0
    },
    content: {
      blogs: 0,
      videos: 0
    },
    callbacks: {
      total: 0,
      pending: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [pendingCounsellors, setPendingCounsellors] = useState([]);
  const [pendingCallbacks, setPendingCallbacks] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch dashboard stats
        const statsRes = await adminAPI.getDashboardStats();
        setStats(statsRes.data.data);
        
        // Fetch pending counsellors
        const counsellorsRes = await adminAPI.getCounsellors({ isVerified: false });
        setPendingCounsellors(counsellorsRes.data.data.slice(0, 5));
        
        // Fetch pending callbacks
        const callbacksRes = await adminAPI.getCallbackRequests({ status: 'pending' });
        setPendingCallbacks(callbacksRes.data.data.slice(0, 5));
        
        // Update stats with callback count
        setStats(prev => ({
          ...prev,
          callbacks: {
            total: callbacksRes.data.pagination.total,
            pending: callbacksRes.data.pagination.total
          }
        }));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <div className="stat-icon me-3">
          <i className="bi bi-speedometer2"></i>
        </div>
        <h2 className="text-gradient mb-0">Admin Dashboard</h2>
      </div>
      
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon">
                <i className="bi bi-people"></i>
              </div>
              <div className="stat-content">
                <h5 className="stat-title">Total Users</h5>
                <h2 className="stat-value">{stats.users.total}</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon">
                <i className="bi bi-calendar-check"></i>
              </div>
              <div className="stat-content">
                <h5 className="stat-title">Appointments</h5>
                <h2 className="stat-value">{stats.appointments.total}</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon">
                <i className="bi bi-telephone"></i>
              </div>
              <div className="stat-content">
                <h5 className="stat-title">Callback Requests</h5>
                <h2 className="stat-value">{stats.callbacks?.pending || 0}</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="d-flex align-items-center">
              <div className="stat-icon">
                <i className="bi bi-cash-coin"></i>
              </div>
              <div className="stat-content">
                <h5 className="stat-title">Total Revenue</h5>
                <h2 className="stat-value">{formatCurrency(stats.finances.totalRevenue)}</h2>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="g-4 mb-4">
        <Col md={8}>
          <Card className="dashboard-card h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="card-icon">
                  <i className="bi bi-person-check"></i>
                </div>
                <h5 className="mb-0">Pending Counsellor Verifications</h5>
              </div>
              <Link to="/admin/counsellors?isVerified=false" className="btn btn-sm btn-outline-primary">View All</Link>
            </Card.Header>
            <Card.Body>
              {loading ? (
                <p className="text-center py-3">Loading data...</p>
              ) : pendingCounsellors.length > 0 ? (
                <Table responsive hover className="mb-0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Specialization</th>
                      <th>Experience</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingCounsellors.map((counsellor) => (
                      <tr key={counsellor._id}>
                        <td>{counsellor.user?.name || counsellor.name}</td>
                        <td>{counsellor.specializations?.join(', ') || 'N/A'}</td>
                        <td>{counsellor.experience} years</td>
                        <td>
                          <Badge bg="warning">Pending</Badge>
                        </td>
                        <td>
                          <Link to={`/admin/counsellors/${counsellor._id}`} className="btn btn-sm btn-outline-primary">
                            Review
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <p className="mb-0">No pending verifications</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={4}>
          <Card className="dashboard-card h-100">
            <Card.Header>
              <div className="d-flex align-items-center">
                <div className="card-icon">
                  <i className="bi bi-bar-chart"></i>
                </div>
                <h5 className="mb-0">User Statistics</h5>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <h6 className="mb-3">User Distribution</h6>
                <div className="progress mb-3" style={{ height: '25px' }}>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${(stats.users.clients / stats.users.total) * 100}%`, backgroundColor: '#2563eb' }}
                    aria-valuenow={(stats.users.clients / stats.users.total) * 100} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {/* Clients */}
                  </div>
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${(stats.users.counsellors / stats.users.total) * 100}%`, backgroundColor: '#3b82f6' }}
                    aria-valuenow={(stats.users.counsellors / stats.users.total) * 100} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  >
                    {/* Counsellors */}
                  </div>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <div className="d-flex align-items-center">
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#2563eb', marginRight: '8px', borderRadius: '2px' }}></span>
                    <small>Clients: {stats.users.clients}</small>
                  </div>
                  <div className="d-flex align-items-center">
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#3b82f6', marginRight: '8px', borderRadius: '2px' }}></span>
                    <small>Counsellors: {stats.users.counsellors}</small>
                  </div>
                </div>
              </div>
              
              <div>
                <h6 className="mb-3">Appointment Status</h6>
                <div className="d-flex justify-content-between mb-1">
                  <div className="d-flex align-items-center">
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#f59e0b', marginRight: '8px', borderRadius: '2px' }}></span>
                    <span>Pending</span>
                  </div>
                  <span>{stats.appointments.pending}</span>
                </div>
                <div className="progress mb-3">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${(stats.appointments.pending / stats.appointments.total) * 100}%`, backgroundColor: '#f59e0b' }}
                    aria-valuenow={(stats.appointments.pending / stats.appointments.total) * 100} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
                
                <div className="d-flex justify-content-between mb-1">
                  <div className="d-flex align-items-center">
                    <span style={{ display: 'inline-block', width: '12px', height: '12px', backgroundColor: '#1d4ed8', marginRight: '8px', borderRadius: '2px' }}></span>
                    <span>Completed</span>
                  </div>
                  <span>{stats.appointments.completed}</span>
                </div>
                <div className="progress">
                  <div 
                    className="progress-bar" 
                    role="progressbar" 
                    style={{ width: `${(stats.appointments.completed / stats.appointments.total) * 100}%`, backgroundColor: '#1d4ed8' }}
                    aria-valuenow={(stats.appointments.completed / stats.appointments.total) * 100} 
                    aria-valuemin="0" 
                    aria-valuemax="100"
                  ></div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="g-4">
        <Col md={12}>
          <Card className="dashboard-card">
            <Card.Header>
              <div className="d-flex align-items-center">
                <div className="card-icon">
                  <i className="bi bi-lightning"></i>
                </div>
                <h5 className="mb-0">Quick Actions</h5>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={3}>
                  <Link to="/admin/users" className="btn btn-outline-primary d-block mb-2">
                    <i className="bi bi-people me-2"></i>Manage Users
                  </Link>
                </Col>
                <Col md={3}>
                  <Link to="/admin/counsellors" className="btn btn-outline-primary d-block mb-2">
                    <i className="bi bi-person-badge me-2"></i>Manage Counsellors
                  </Link>
                </Col>
                <Col md={3}>
                  <Link to="/admin/appointments" className="btn btn-outline-primary d-block mb-2">
                    <i className="bi bi-calendar-check me-2"></i>View Appointments
                  </Link>
                </Col>
                <Col md={3}>
                  <Link to="/admin/callbacks" className="btn btn-outline-primary d-block mb-2">
                    <i className="bi bi-telephone me-2"></i>Callback Requests
                  </Link>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;