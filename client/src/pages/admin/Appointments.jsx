import { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { adminAPI } from '../../services/api';
import '../client/Dashboard.css';
import './AdminStyles.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    paymentStatus: '',
    startDate: '',
    endDate: ''
  });
  
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [paymentData, setPaymentData] = useState({
    status: 'completed',
    method: 'online',
    id: ''
  });
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter.status) params.status = filter.status;
      if (filter.paymentStatus) params.paymentStatus = filter.paymentStatus;
      if (filter.startDate) params.startDate = filter.startDate;
      if (filter.endDate) params.endDate = filter.endDate;
      
      const response = await adminAPI.getAppointments(params);
      setAppointments(response.data.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchAppointments();
  };

  const handlePaymentChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdatePayment = async () => {
    if (!selectedAppointment) return;
    
    setUpdating(true);
    try {
      await adminAPI.updatePaymentStatus(selectedAppointment._id, paymentData);
      
      // Update appointment in the list
      setAppointments(appointments.map(appointment => 
        appointment._id === selectedAppointment._id 
          ? { ...appointment, payment: { ...appointment.payment, status: paymentData.status } } 
          : appointment
      ));
      
      setShowPaymentModal(false);
    } catch (error) {
      console.error('Error updating payment status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const openPaymentModal = (appointment) => {
    setSelectedAppointment(appointment);
    setPaymentData({
      status: appointment.payment?.status || 'pending',
      method: appointment.payment?.method || 'online',
      id: appointment.payment?.id || ''
    });
    setShowPaymentModal(true);
  };

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

  // Get badge color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'confirmed': return 'primary';
      case 'completed': return 'primary';
      case 'cancelled': return 'danger';
      case 'no-show': return 'secondary';
      default: return 'info';
    }
  };

  // Get payment badge color
  const getPaymentBadge = (status) => {
    switch (status) {
      case 'completed': return 'primary';
      case 'refunded': return 'info';
      case 'failed': return 'danger';
      default: return 'warning';
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <div className="stat-icon me-3">
          <i className="bi bi-calendar-check"></i>
        </div>
        <h2 className="text-gradient mb-0">Appointment Management</h2>
      </div>
      
      <Card className="dashboard-card mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center py-2">
          <div className="d-flex align-items-center">
            <div className="card-icon">
              <i className="bi bi-funnel"></i>
            </div>
            <h5 className="mb-0">Filter Appointments</h5>
          </div>
        </Card.Header>
        <Card.Body className="py-2">
          <Form onSubmit={handleFilterSubmit}>
            <Row>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">Status</Form.Label>
                  <Form.Select 
                    name="status" 
                    value={filter.status} 
                    onChange={handleFilterChange}
                    size="sm"
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="no-show">No Show</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">Payment Status</Form.Label>
                  <Form.Select 
                    name="paymentStatus" 
                    value={filter.paymentStatus} 
                    onChange={handleFilterChange}
                    size="sm"
                  >
                    <option value="">All</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="refunded">Refunded</option>
                    <option value="failed">Failed</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="startDate"
                    value={filter.startDate}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="endDate"
                    value={filter.endDate}
                    onChange={handleFilterChange}
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">&nbsp;</Form.Label>
                  <Button type="submit" variant="primary" size="sm" className="w-100">
                    <i className="bi bi-funnel-fill me-1"></i>Apply
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
              <i className="bi bi-calendar-week"></i>
            </div>
            <h5 className="mb-0">Appointments List</h5>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading appointments...</p>
            </div>
          ) : appointments.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Counsellor</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Amount</th>
                  <th>Payment</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment._id}>
                    <td>{appointment.client?.name || 'Client'}</td>
                    <td>{appointment.counsellor?.user?.name || 'Counsellor'}</td>
                    <td>
                      <div>{formatDate(appointment.date)}</div>
                      <small className="text-muted">{appointment.startTime} - {appointment.endTime}</small>
                    </td>
                    <td>
                      <Badge bg={appointment.sessionType === 'video' ? 'primary' : 'info'}>
                        {appointment.sessionType === 'video' ? 'Video' : 'Chat'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={appointment.status === 'completed' ? 'primary' : getStatusBadge(appointment.status)}>
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Badge>
                    </td>
                    <td>{formatCurrency(appointment.amount)}</td>
                    <td>
                      <Badge bg={appointment.payment?.status === 'completed' ? 'primary' : getPaymentBadge(appointment.payment?.status || 'pending')}>
                        {(appointment.payment?.status || 'pending').charAt(0).toUpperCase() + 
                         (appointment.payment?.status || 'pending').slice(1)}
                      </Badge>
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-1"
                        href={`/admin/appointments/${appointment._id}`}
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => openPaymentModal(appointment)}
                      >
                        <i className="bi bi-credit-card"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <p className="mb-0">No appointments found</p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Payment Modal */}
      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Payment Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Appointment Details</Form.Label>
                <div className="p-3 bg-light rounded">
                  <p className="mb-1"><strong>Client:</strong> {selectedAppointment.client?.name}</p>
                  <p className="mb-1"><strong>Counsellor:</strong> {selectedAppointment.counsellor?.user?.name}</p>
                  <p className="mb-1"><strong>Date:</strong> {formatDate(selectedAppointment.date)}</p>
                  <p className="mb-1"><strong>Time:</strong> {selectedAppointment.startTime} - {selectedAppointment.endTime}</p>
                  <p className="mb-0"><strong>Amount:</strong> {formatCurrency(selectedAppointment.amount)}</p>
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Payment Status</Form.Label>
                <Form.Select
                  name="status"
                  value={paymentData.status}
                  onChange={handlePaymentChange}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="refunded">Refunded</option>
                  <option value="failed">Failed</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Payment Method</Form.Label>
                <Form.Select
                  name="method"
                  value={paymentData.method}
                  onChange={handlePaymentChange}
                >
                  <option value="online">Online</option>
                  <option value="card">Credit/Debit Card</option>
                  <option value="upi">UPI</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="wallet">Wallet</option>
                </Form.Select>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Transaction ID</Form.Label>
                <Form.Control
                  type="text"
                  name="id"
                  value={paymentData.id}
                  onChange={handlePaymentChange}
                  placeholder="Enter transaction ID"
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUpdatePayment}
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update Payment'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Appointments;