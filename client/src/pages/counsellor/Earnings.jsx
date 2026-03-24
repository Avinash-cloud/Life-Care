import { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Row, Col, Form, Alert, Modal } from 'react-bootstrap';
import { counsellorAPI } from '../../services/api';
import './Earnings.css';

const Earnings = () => {
  const [earnings, setEarnings] = useState({
    total: 0,
    withdrawn: 0,
    pending: 0
  });
  const [withdrawalRequests, setWithdrawalRequests] = useState([]);
  const [completedAppointments, setCompletedAppointments] = useState([]);
  const [totalPlatformFees, setTotalPlatformFees] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalError, setWithdrawalError] = useState('');
  const [withdrawalSuccess, setWithdrawalSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEarnings();
  }, []);

  const fetchEarnings = async () => {
    try {
      setLoading(true);
      const response = await counsellorAPI.getEarnings();
      setEarnings(response.data.data.earnings);
      setWithdrawalRequests(response.data.data.withdrawalRequests);
      setCompletedAppointments(response.data.data.completedAppointments || []);
      setTotalPlatformFees(response.data.data.totalPlatformFees || 0);
    } catch (error) {
      console.error('Error fetching earnings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawSubmit = async (e) => {
    e.preventDefault();
    setWithdrawalError('');
    setWithdrawalSuccess('');
    setSubmitting(true);

    const amount = parseFloat(withdrawalAmount);

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
      setWithdrawalError('Please enter a valid amount');
      setSubmitting(false);
      return;
    }

    if (amount < 100) {
      setWithdrawalError('Minimum withdrawal amount is ₹100');
      setSubmitting(false);
      return;
    }

    if (amount > earnings.pending) {
      setWithdrawalError('Withdrawal amount cannot exceed your available balance');
      setSubmitting(false);
      return;
    }

    try {
      await counsellorAPI.requestWithdrawal({ amount });
      setWithdrawalSuccess('Withdrawal request submitted successfully');
      setWithdrawalAmount('');
      fetchEarnings(); // Refresh data
      setTimeout(() => {
        setShowWithdrawModal(false);
      }, 2000);
    } catch (error) {
      console.error('Error requesting withdrawal:', error);
      setWithdrawalError('Failed to submit withdrawal request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Get status class
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'processed': return 'status-processed';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  return (
    <div className="earnings-page">
      <div className="earnings-header">
        <div className="d-flex align-items-center mb-2">
          <div className="stat-icon me-3">
            <i className="bi bi-wallet2"></i>
          </div>
          <h1>Earnings & Withdrawals</h1>
        </div>
        <p>Manage your earnings and request withdrawals</p>
      </div>
      
      <Row className="g-4 mb-4">
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="">
              <div className="d-flex align-items-center mb-3">
                <div className="stat-icon">
                  <i className="bi bi-wallet2"></i>
                </div>
                <div>
                  <h5 className="mb-0">Total Earnings</h5>
                  <small className="text-muted">After platform fees</small>
                </div>
              </div>
              <h2 className="stat-value">{formatCurrency(earnings.total)}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="">
              <div className="d-flex align-items-center mb-3">
                <div className="stat-icon">
                  <i className="bi bi-percent"></i>
                </div>
                <div>
                  <h5 className="mb-0">Platform Fees</h5>
                  <small className="text-muted">Total deducted</small>
                </div>
              </div>
              <h2 className="stat-value">{formatCurrency(totalPlatformFees)}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="">
              <div className="d-flex align-items-center mb-3">
                <div className="stat-icon">
                  <i className="bi bi-cash-coin"></i>
                </div>
                <div>
                  <h5 className="mb-0">Available Balance</h5>
                  <small className="text-muted">Ready to withdraw</small>
                </div>
              </div>
              <h2 className="stat-value">{formatCurrency(earnings.pending)}</h2>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={3}>
          <Card className="stat-card">
            <Card.Body className="">
              <div className="d-flex align-items-center mb-3">
                <div className="stat-icon">
                  <i className="bi bi-bank"></i>
                </div>
                <div>
                  <h5 className="mb-0">Withdrawn</h5>
                  <small className="text-muted">Total withdrawn amount</small>
                </div>
              </div>
              <h2 className="stat-value">{formatCurrency(earnings.withdrawn)}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="g-4 mb-4">
        <Col md={6}>
          <Card className="earnings-card">
            <Card.Header>
              <div className="d-flex align-items-center">
                <div className="card-icon">
                  <i className="bi bi-calendar-check"></i>
                </div>
                <h5 className="mb-0">Recent Sessions</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {completedAppointments.length > 0 ? (
                <div className="table-responsive">
                  <table className="earnings-table">
                    <thead>
                      <tr>
                        <th>Client</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Fee</th>
                        <th>Earned</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedAppointments.map((appointment) => (
                        <tr key={appointment._id}>
                          <td>{appointment.client?.name || 'N/A'}</td>
                          <td>{formatDate(appointment.date)}</td>
                          <td>₹{appointment.payment?.totalAmount?.toFixed(2) || appointment.amount?.toFixed(2)}</td>
                          <td>₹{appointment.payment?.platformFee?.toFixed(2) || '0.00'}</td>
                          <td><strong>₹{appointment.payment?.counsellorAmount?.toFixed(2) || appointment.amount?.toFixed(2)}</strong></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">
                  <p className="text-muted">No completed sessions yet.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="earnings-card">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="card-icon">
                  <i className="bi bi-cash-stack"></i>
                </div>
                <h5 className="mb-0">Withdrawal Requests</h5>
              </div>
          <Button 
            className="withdraw-button"
            onClick={() => setShowWithdrawModal(true)}
            disabled={earnings.pending < 100}
          >
            <i className="bi bi-bank"></i>
            Request Withdrawal
          </Button>
        </Card.Header>
        <Card.Body className="p-0">
          {loading ? (
            <div className="loading-state">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading your earnings...</p>
            </div>
          ) : withdrawalRequests.length > 0 ? (
            <div className="table-responsive">
              <table className="earnings-table">
                <thead>
                  <tr>
                    <th>Request Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Processed Date</th>
                    <th>Transaction ID</th>
                  </tr>
                </thead>
                <tbody>
                  {withdrawalRequests.map((request) => (
                    <tr key={request._id}>
                      <td>{formatDate(request.createdAt)}</td>
                      <td><strong>{formatCurrency(request.amount)}</strong></td>
                      <td>
                        <span className={`status-badge ${getStatusClass(request.status)}`}>
                          {request.status === 'pending' && <i className="bi bi-clock"></i>}
                          {request.status === 'approved' && <i className="bi bi-check-circle"></i>}
                          {request.status === 'processed' && <i className="bi bi-check-all"></i>}
                          {request.status === 'rejected' && <i className="bi bi-x-circle"></i>}
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </td>
                      <td>{formatDate(request.processedAt)}</td>
                      <td>
                        {request.transactionId || 
                          (request.status === 'rejected' ? 
                            <span className="text-danger">Rejected: {request.rejectionReason}</span> : 
                            'N/A')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                <i className="bi bi-cash"></i>
              </div>
              <h3>No withdrawal requests</h3>
              <p>You haven't made any withdrawal requests yet</p>
              <Button 
                className="withdraw-button"
                onClick={() => setShowWithdrawModal(true)}
                disabled={earnings.pending < 100}
              >
                <i className="bi bi-bank"></i>
                Request Withdrawal
              </Button>
            </div>
          )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Withdraw Modal */}
      <Modal show={showWithdrawModal} onHide={() => setShowWithdrawModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Request Withdrawal</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {withdrawalSuccess && <Alert variant="success">{withdrawalSuccess}</Alert>}
          {withdrawalError && <Alert variant="danger">{withdrawalError}</Alert>}
          
          <Form onSubmit={handleWithdrawSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Available Balance</Form.Label>
              <Form.Control
                type="text"
                value={formatCurrency(earnings.pending)}
                disabled
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Withdrawal Amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter amount"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                required
                min="100"
                max={earnings.pending}
              />
              <Form.Text className="text-muted">
                Minimum withdrawal amount is ₹100
              </Form.Text>
            </Form.Group>
            
            <div className="d-grid">
              <Button 
                className="withdraw-button w-100"
                type="submit" 
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Processing...
                  </>
                ) : (
                  <>
                    <i className="bi bi-send"></i>
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Earnings;