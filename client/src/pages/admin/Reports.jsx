import { useState, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Table, Badge } from 'react-bootstrap';
import { adminAPI } from '../../services/api';
import '../client/Dashboard.css';
import './AdminStyles.css';

const Reports = () => {
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('overall');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {
        type: reportType,
        startDate: dateRange.startDate,
        endDate: dateRange.endDate
      };
      
      const response = await adminAPI.getReports(params);
      setReportData(response.data.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchReports();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  const getMonthName = (monthNumber) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                   'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[monthNumber - 1] || 'Unknown';
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <div className="stat-icon me-3">
          <i className="bi bi-graph-up"></i>
        </div>
        <h2 className="text-gradient mb-0">Reports & Analytics</h2>
      </div>

      {reportData && (
        <>
          {/* Overall Report */}
          {reportType === 'overall' && (
            <>
              <Row className="g-4 mb-4">
                <Col md={3}>
                  <Card className="dashboard-card stat-card">
                    <Card.Body className="d-flex align-items-center p-3">
                      <div className="stat-card-icon bg-primary-light me-3">
                        <i className="bi bi-people"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-title text-muted mb-1">Total Users</div>
                        <div className="stat-value">{reportData.users?.totalUsers || 0}</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="dashboard-card stat-card">
                    <Card.Body className="d-flex align-items-center p-3">
                      <div className="stat-card-icon bg-primary-light me-3">
                        <i className="bi bi-calendar-check"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-title text-muted mb-1">Appointments</div>
                        <div className="stat-value">{reportData.appointments?.totalAppointments || 0}</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="dashboard-card stat-card">
                    <Card.Body className="d-flex align-items-center p-3">
                      <div className="stat-card-icon bg-primary-light me-3">
                        <i className="bi bi-cash-coin"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-title text-muted mb-1">Revenue</div>
                        <div className="stat-value">{formatCurrency(reportData.revenue?.totalRevenue)}</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="dashboard-card stat-card">
                    <Card.Body className="d-flex align-items-center p-3">
                      <div className="stat-card-icon bg-primary-light me-3">
                        <i className="bi bi-file-earmark-text"></i>
                      </div>
                      <div className="stat-content">
                        <div className="stat-title text-muted mb-1">Content Items</div>
                        <div className="stat-value">{(reportData.content?.blogStats?.length || 0) + (reportData.content?.videoStats?.length || 0)}</div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          )}

          <div className="mb-4"> 
        <Card className="dashboard-card mb-4">
        <Card.Header>
          <div className="d-flex align-items-center">
            <div className="card-icon">
              <i className="bi bi-funnel"></i>
            </div>
            <h5 className="mb-0">Report Filters</h5>
          </div>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleFilterSubmit}>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Report Type</Form.Label>
                  <Form.Select 
                    value={reportType} 
                    onChange={(e) => setReportType(e.target.value)}
                  >
                    <option value="overall">Overall Report</option>
                    <option value="users">User Analytics</option>
                    <option value="appointments">Appointment Analytics</option>
                    <option value="revenue">Revenue Analytics</option>
                    <option value="content">Content Analytics</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>&nbsp;</Form.Label>
                  <Button type="submit" variant="primary" className="w-100" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Loading...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>Generate Report
                      </>
                    )}
                  </Button>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
        </div>

          {/* User Analytics */}
          {(reportType === 'users' || reportType === 'overall') && reportData.users && (
            <Card className="dashboard-card mb-4">
              <Card.Header>
                <div className="d-flex align-items-center">
                  <div className="card-icon">
                    <i className="bi bi-people"></i>
                  </div>
                  <h5 className="mb-0">User Analytics</h5>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <div className="report-section">
                      <h6 className="report-section-title">User Distribution by Role</h6>
                    <Table responsive hover className="modern-table">
                      <thead className="table-header">
                        <tr>
                          <th>Role</th>
                          <th>Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.users.usersByRole?.map((role) => (
                          <tr key={role._id}>
                            <td>
                              <Badge bg="primary" className="role-badge">
                                {role._id.charAt(0).toUpperCase() + role._id.slice(1)}
                              </Badge>
                            </td>
                            <td className="fw-semibold">{role.count}</td>
                            <td className="text-muted">{((role.count / reportData.users.totalUsers) * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    </div>
                  </Col>
                  <Col md={12}>
                    <div className="report-section">
                      <h6 className="report-section-title">User Statistics</h6>
                      <div className="stats-list">
                        <div className="stat-item">
                          <span className="stat-label">Total Users</span>
                          <span className="stat-number">{reportData.users.totalUsers}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">New Users</span>
                          <span className="stat-number text-success">{reportData.users.newUsers}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Active Users</span>
                          <span className="stat-number text-primary">{reportData.users.activeUsers}</span>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Appointment Analytics */}
          {(reportType === 'appointments' || reportType === 'overall') && reportData.appointments && (
            <Card className="dashboard-card mb-4">
              <Card.Header>
                <div className="d-flex align-items-center">
                  <div className="card-icon">
                    <i className="bi bi-calendar-check"></i>
                  </div>
                  <h5 className="mb-0">Appointment Analytics</h5>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <h6>Appointments by Status</h6>
                    <Table responsive hover className="modern-table">
                      <thead className="table-header">
                        <tr>
                          <th>Status</th>
                          <th>Count</th>
                          <th>Percentage</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.appointments.appointmentsByStatus?.map((status) => (
                          <tr key={status._id}>
                            <td>
                              <Badge bg={status._id === 'completed' ? 'success' : status._id === 'pending' ? 'warning' : 'secondary'} className="status-badge">
                                {status._id.charAt(0).toUpperCase() + status._id.slice(1)}
                              </Badge>
                            </td>
                            <td className="fw-semibold">{status.count}</td>
                            <td className="text-muted">{((status.count / reportData.appointments.totalAppointments) * 100).toFixed(1)}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={12}>
                    <h6>Monthly Trend</h6>
                    <Table responsive>
                      <thead className="table-header">
                        <tr>
                          <th>Month</th>
                          <th>Appointments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.appointments.appointmentsByMonth?.map((month) => (
                          <tr key={month._id}>
                            <td>{getMonthName(month._id)}</td>
                            <td>{month.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Revenue Analytics */}
          {(reportType === 'revenue' || reportType === 'overall') && reportData.revenue && (
            <Card className="dashboard-card mb-4">
              <Card.Header>
                <div className="d-flex align-items-center">
                  <div className="card-icon">
                    <i className="bi bi-cash-coin"></i>
                  </div>
                  <h5 className="mb-0">Revenue Analytics</h5>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <h6>Revenue Summary</h6>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Total Revenue:</span>
                        <strong>{formatCurrency(reportData.revenue.totalRevenue)}</strong>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Average Amount:</span>
                        <strong>{formatCurrency(reportData.revenue.averageAmount)}</strong>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Total Transactions:</span>
                        <strong>{reportData.revenue.count}</strong>
                      </div>
                    </div>
                  </Col>
                  <Col md={12}>
                    <h6>Monthly Revenue</h6>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Month</th>
                          <th>Revenue</th>
                          <th>Transactions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.revenue.monthlyRevenue?.map((month) => (
                          <tr key={month._id}>
                            <td>{getMonthName(month._id)}</td>
                            <td>{formatCurrency(month.revenue)}</td>
                            <td>{month.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}

          {/* Content Analytics */}
          {(reportType === 'content' || reportType === 'overall') && reportData.content && (
            <Card className="dashboard-card mb-4">
              <Card.Header>
                <div className="d-flex align-items-center">
                  <div className="card-icon">
                    <i className="bi bi-file-earmark-text"></i>
                  </div>
                  <h5 className="mb-0">Content Analytics</h5>
                </div>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={12}>
                    <h6>Blog Statistics</h6>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.content.blogStats?.map((blog) => (
                          <tr key={blog._id}>
                            <td>
                              <Badge bg={blog._id === 'published' ? 'success' : blog._id === 'draft' ? 'warning' : 'secondary'}>
                                {blog._id.charAt(0).toUpperCase() + blog._id.slice(1)}
                              </Badge>
                            </td>
                            <td>{blog.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={12}>
                    <h6>Video Statistics</h6>
                    <Table responsive>
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportData.content.videoStats?.map((video) => (
                          <tr key={video._id}>
                            <td>
                              <Badge bg={video._id === 'published' ? 'success' : video._id === 'draft' ? 'warning' : 'secondary'}>
                                {video._id.charAt(0).toUpperCase() + video._id.slice(1)}
                              </Badge>
                            </td>
                            <td>{video.count}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Col>
                  <Col md={12}>
                    <h6>Gallery Statistics</h6>
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Total Images:</span>
                        <strong>{reportData.content.galleryStats}</strong>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </>
      )}

      {!reportData && !loading && (
        <Card className="dashboard-card">
          <Card.Body className="text-center py-5">
            <i className="bi bi-graph-up display-1 text-muted mb-3"></i>
            <h5>Generate Your First Report</h5>
            <p className="text-muted">Select report type and date range, then click "Generate Report" to view analytics.</p>
          </Card.Body>
        </Card>
      )}
            
    </div>
  );
};

export default Reports;