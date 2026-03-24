import { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { adminAPI } from '../../services/api';
import '../client/Dashboard.css';
import './AdminStyles.css';

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: ''
  });
  
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [processData, setProcessData] = useState({
    status: 'processed',
    transactionId: '',
    rejectionReason: ''
  });
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter.status) params.status = filter.status;
      
      const response = await adminAPI.getWithdrawals(params);
      setWithdrawals(response.data.data);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
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
    fetchWithdrawals();
  };

  const handleProcessChange = (e) => {
    setProcessData({
      ...processData,
      [e.target.name]: e.target.value
    });
  };

  const handleProcessWithdrawal = async () => {
    if (!selectedWithdrawal) return;
    
    setProcessing(true);
    try {
      await adminAPI.processWithdrawal(selectedWithdrawal._id, processData);
      
      // Update withdrawal in the list
      setWithdrawals(withdrawals.map(withdrawal => 
        withdrawal._id === selectedWithdrawal._id 
          ? { ...withdrawal, status: processData.status } 
          : withdrawal
      ));
      
      setShowProcessModal(false);
    } catch (error) {
      console.error('Error processing withdrawal:', error);
    } finally {
      setProcessing(false);
    }
  };

  const openProcessModal = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setProcessData({
      status: 'processed',
      transactionId: '',
      rejectionReason: ''
    });
    setShowProcessModal(true);
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
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
      case 'approved': return 'info';
      case 'processed': return 'primary';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <div className="stat-icon me-3">
          <i className="bi bi-cash-coin"></i>
        </div>
        <h2 className="text-gradient mb-0">Withdrawal Requests</h2>
      </div>
      
      <Card className="dashboard-card mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center py-2">
          <div className="d-flex align-items-center">
            <div className="card-icon">
              <i className="bi bi-funnel"></i>
            </div>
            <h5 className="mb-0">Filter Withdrawals</h5>
          </div>
        </Card.Header>
        <Card.Body className="py-2">
          <Form onSubmit={handleFilterSubmit}>
            <Row>
              <Col md={10}>
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
                    <option value="approved">Approved</option>
                    <option value="processed">Processed</option>
                    <option value="rejected">Rejected</option>
                  </Form.Select>
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
              <i className="bi bi-bank"></i>
            </div>
            <h5 className="mb-0">Withdrawal Requests List</h5>
          </div>
        </Card.Header>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading withdrawal requests...</p>
            </div>
          ) : withdrawals.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Counsellor</th>
                  <th>Amount</th>
                  <th>Bank Details</th>
                  <th>Request Date</th>
                  <th>Status</th>
                  <th>Processed Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {withdrawals.map((withdrawal) => (
                  <tr key={withdrawal._id}>
                    <td>{withdrawal.counsellor?.user?.name || 'Counsellor'}</td>
                    <td>{formatCurrency(withdrawal.amount)}</td>
                    <td>
                      <small>
                        {withdrawal.bankDetails?.accountName}<br />
                        {withdrawal.bankDetails?.bankName}<br />
                        A/C: {withdrawal.bankDetails?.accountNumber}
                      </small>
                    </td>
                    <td>{formatDate(withdrawal.createdAt)}</td>
                    <td>
                      <Badge bg={getStatusBadge(withdrawal.status)}>
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </Badge>
                    </td>
                    <td>{formatDate(withdrawal.processedAt)}</td>
                    <td>
                      {withdrawal.status === 'pending' && (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => openProcessModal(withdrawal)}
                        >
                          Process
                        </Button>
                      )}
                      {withdrawal.status !== 'pending' && (
                        <span>
                          {withdrawal.status === 'processed' ? withdrawal.transactionId : 
                           withdrawal.status === 'rejected' ? 'Rejected' : 'N/A'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <p className="mb-0">No withdrawal requests found</p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Process Modal */}
      <Modal show={showProcessModal} onHide={() => setShowProcessModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Process Withdrawal Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWithdrawal && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Withdrawal Details</Form.Label>
                <div className="p-3 bg-light rounded">
                  <p className="mb-1"><strong>Counsellor:</strong> {selectedWithdrawal.counsellor?.user?.name}</p>
                  <p className="mb-1"><strong>Amount:</strong> {formatCurrency(selectedWithdrawal.amount)}</p>
                  <p className="mb-1"><strong>Bank:</strong> {selectedWithdrawal.bankDetails?.bankName}</p>
                  <p className="mb-1"><strong>Account:</strong> {selectedWithdrawal.bankDetails?.accountNumber}</p>
                  <p className="mb-0"><strong>IFSC:</strong> {selectedWithdrawal.bankDetails?.ifscCode}</p>
                </div>
              </Form.Group>
              
              <Form.Group className="mb-3">
                <Form.Label>Action</Form.Label>
                <Form.Select
                  name="status"
                  value={processData.status}
                  onChange={handleProcessChange}
                >
                  <option value="processed">Process Payment</option>
                  <option value="rejected">Reject Request</option>
                </Form.Select>
              </Form.Group>
              
              {processData.status === 'processed' && (
                <Form.Group className="mb-3">
                  <Form.Label>Transaction ID</Form.Label>
                  <Form.Control
                    type="text"
                    name="transactionId"
                    value={processData.transactionId}
                    onChange={handleProcessChange}
                    placeholder="Enter transaction ID"
                    required
                  />
                </Form.Group>
              )}
              
              {processData.status === 'rejected' && (
                <Form.Group className="mb-3">
                  <Form.Label>Rejection Reason</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="rejectionReason"
                    value={processData.rejectionReason}
                    onChange={handleProcessChange}
                    placeholder="Enter reason for rejection"
                    required
                  />
                </Form.Group>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProcessModal(false)}>
            Cancel
          </Button>
          <Button 
            variant={processData.status === 'processed' ? 'primary' : 'danger'} 
            onClick={handleProcessWithdrawal}
            disabled={processing}
          >
            {processing ? 'Processing...' : 
             processData.status === 'processed' ? 'Confirm Payment' : 'Reject Request'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Withdrawals;