import { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Modal, Form } from 'react-bootstrap';
import { adminAPI } from '../../services/api';

const CallbackRequests = () => {
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCallback, setSelectedCallback] = useState(null);
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchCallbacks();
  }, [filterStatus]);

  const fetchCallbacks = async () => {
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const res = await adminAPI.getCallbackRequests(params);
      setCallbacks(res.data.data);
    } catch (error) {
      console.error('Error fetching callbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (callback) => {
    setSelectedCallback(callback);
    setStatus(callback.status);
    setNotes(callback.notes || '');
    setShowModal(true);
  };

  const handleUpdate = async () => {
    try {
      await adminAPI.updateCallbackRequest(selectedCallback._id, { status, notes });
      setShowModal(false);
      fetchCallbacks();
    } catch (error) {
      console.error('Error updating callback:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await adminAPI.deleteCallbackRequest(id);
        fetchCallbacks();
      } catch (error) {
        console.error('Error deleting callback:', error);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'warning',
      contacted: 'info',
      completed: 'success',
      cancelled: 'danger'
    };
    return <Badge bg={badges[status] || 'secondary'}>{status}</Badge>;
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div className="d-flex align-items-center">
          <div className="stat-icon me-3">
            <i className="bi bi-telephone"></i>
          </div>
          <h2 className="text-gradient mb-0">Callback Requests</h2>
        </div>
        <Form.Select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ width: '200px' }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="contacted">Contacted</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </Form.Select>
      </div>

      <Card className="dashboard-card">
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : callbacks.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Concern</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {callbacks.map((callback) => (
                  <tr key={callback._id}>
                    <td>{callback.name}</td>
                    <td>
                      <a href={`tel:${callback.phoneNumber}`} className="text-decoration-none">
                        <i className="bi bi-telephone me-1"></i>
                        {callback.phoneNumber}
                      </a>
                    </td>
                    <td>
                      <div style={{ maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {callback.primaryConcern}
                      </div>
                    </td>
                    <td>{getStatusBadge(callback.status)}</td>
                    <td>{formatDate(callback.createdAt)}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-2"
                        onClick={() => handleEdit(callback)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDelete(callback._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox" style={{ fontSize: '3rem', color: '#ccc' }}></i>
              <p className="mt-3 text-muted">No callback requests found</p>
            </div>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Callback Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCallback && (
            <>
              <div className="mb-3">
                <strong>Name:</strong> {selectedCallback.name}
              </div>
              <div className="mb-3">
                <strong>Phone:</strong> {selectedCallback.phoneNumber}
              </div>
              <div className="mb-3">
                <strong>Concern:</strong>
                <p className="mt-1">{selectedCallback.primaryConcern}</p>
              </div>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="pending">Pending</option>
                  <option value="contacted">Contacted</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this request..."
                />
              </Form.Group>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Update
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CallbackRequests;
