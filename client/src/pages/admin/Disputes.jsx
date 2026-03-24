import { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col, Modal, Alert } from 'react-bootstrap';
import { adminAPI } from '../../services/api';
import '../client/Dashboard.css';
import './AdminStyles.css';

const Disputes = () => {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    search: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolution, setResolution] = useState({
    status: 'resolved',
    resolution: '',
    refundAmount: 0
  });
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchDisputes();
  }, []);

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter.status) params.status = filter.status;
      if (filter.search) params.search = filter.search;
      
      // For demo purposes, we'll fetch appointments with disputes
      const response = await adminAPI.getAppointments(params);
      // Filter appointments that have disputes
      const disputedAppointments = response.data.data.filter(appointment => 
        appointment.dispute || appointment.cancellation?.reason
      );
      setDisputes(disputedAppointments);
    } catch (error) {
      console.error('Error fetching disputes:', error);
      showAlert('Error fetching disputes', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchDisputes();
  };

  const handleViewDispute = (dispute) => {
    setSelectedDispute(dispute);
    setResolution({
      status: 'resolved',
      resolution: '',
      refundAmount: dispute.amount || 0
    });
    setShowModal(true);
  };

  const handleResolveDispute = async () => {
    try {
      await adminAPI.handleDispute(selectedDispute._id, resolution);
      showAlert('Dispute resolved successfully');
      setShowModal(false);
      fetchDisputes();
    } catch (error) {
      console.error('Error resolving dispute:', error);
      showAlert('Error resolving dispute', 'danger');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'resolved': return 'success';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <div className="stat-icon me-3">
          <i className="bi bi-exclamation-triangle"></i>
        </div>
        <h2 className="text-gradient mb-0">Dispute Management</h2>
      </div>
      
      <Card className="dashboard-card mb-4">
        <Card.Header>
          <div className="d-flex align-items-center">
            <div className="card-icon">
              <i className="bi bi-funnel"></i>
            </div>
            <h5 className="mb-0">Filter Disputes</h5>
          </div>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleFilterSubmit}>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    name="status" 
                    value={filter.status} 
                    onChange={handleFilterChange}
                  >
                    <option value="">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type="text"
                    name="search"
                    value={filter.search}
                    onChange={handleFilterChange}
                    placeholder="Search by client or counsellor name"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>&nbsp;</Form.Label>
                  <Button type="submit" variant="primary" className="w-100">
                    <i className="bi bi-funnel-fill me-1"></i>Apply Filter
                  </Button>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      <Card className="dashboard-card">
        <Card.Header>
          <div className="d-flex align-items-center">
            <div className="card-icon">
              <i className="bi bi-list-task"></i>
            </div>
            <h5 className="mb-0">Disputes List</h5>
          </div>
        </Card.Header>
        <Card.Body>
          {alert.show && (
            <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: 'success' })}>
              {alert.message}
            </Alert>
          )}
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading disputes...</p>
            </div>
          ) : disputes.length > 0 ? (
            <Table responsive hover className="modern-table">
              <thead className="table-header">
                <tr>
                  <th>Appointment ID</th>
                  <th>Client</th>
                  <th>Counsellor</th>
                  <th>Amount</th>
                  <th>Issue</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {disputes.map((dispute) => (
                  <tr key={dispute._id}>
                    <td className="fw-medium">#{dispute._id.slice(-6)}</td>
                    <td>{dispute.client?.name || 'Unknown'}</td>
                    <td>{dispute.counsellor?.user?.name || 'Unknown'}</td>
                    <td className="fw-semibold text-success">{formatCurrency(dispute.amount)}</td>
                    <td>
                      {dispute.dispute?.reason || dispute.cancellation?.reason || 'Payment dispute'}
                    </td>
                    <td>
                      <Badge bg={getStatusBadge(dispute.dispute?.status || 'pending')}>
                        {(dispute.dispute?.status || 'pending').charAt(0).toUpperCase() + 
                         (dispute.dispute?.status || 'pending').slice(1)}
                      </Badge>
                    </td>
                    <td className="text-muted">{new Date(dispute.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleViewDispute(dispute)}
                        disabled={dispute.dispute?.status === 'resolved'}
                      >
                        {dispute.dispute?.status === 'resolved' ? 'View' : 'Resolve'}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-check-circle display-1 text-success mb-3"></i>
              <h5>No Disputes Found</h5>
              <p className="text-muted">All disputes have been resolved or there are no active disputes.</p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Dispute Resolution Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Resolve Dispute</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDispute && (
            <>
              <div className="mb-4">
                <h6>Dispute Details</h6>
                <div className="bg-light p-3 rounded">
                  <Row>
                    <Col md={6}>
                      <strong>Appointment ID:</strong> #{selectedDispute._id.slice(-6)}<br/>
                      <strong>Client:</strong> {selectedDispute.client?.name}<br/>
                      <strong>Counsellor:</strong> {selectedDispute.counsellor?.user?.name}<br/>
                    </Col>
                    <Col md={6}>
                      <strong>Amount:</strong> {formatCurrency(selectedDispute.amount)}<br/>
                      <strong>Date:</strong> {new Date(selectedDispute.date).toLocaleDateString()}<br/>
                      <strong>Status:</strong> {selectedDispute.status}<br/>
                    </Col>
                  </Row>
                  <div className="mt-2">
                    <strong>Issue:</strong><br/>
                    <p className="mb-0">{selectedDispute.dispute?.reason || selectedDispute.cancellation?.reason || 'Payment dispute'}</p>
                  </div>
                </div>
              </div>
              
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Resolution Status</Form.Label>
                  <Form.Select
                    value={resolution.status}
                    onChange={(e) => setResolution({...resolution, status: e.target.value})}
                  >
                    <option value="resolved">Resolved</option>
                    <option value="rejected">Rejected</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Resolution Details</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    value={resolution.resolution}
                    onChange={(e) => setResolution({...resolution, resolution: e.target.value})}
                    placeholder="Describe how this dispute was resolved..."
                    required
                  />
                </Form.Group>
                
                {resolution.status === 'resolved' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Refund Amount</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max={selectedDispute.amount}
                      step="0.01"
                      value={resolution.refundAmount}
                      onChange={(e) => setResolution({...resolution, refundAmount: parseFloat(e.target.value)})}
                    />
                    <Form.Text className="text-muted">
                      Maximum refund amount: {formatCurrency(selectedDispute.amount)}
                    </Form.Text>
                  </Form.Group>
                )}
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleResolveDispute}
            disabled={!resolution.resolution.trim()}
          >
            Resolve Dispute
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Disputes;