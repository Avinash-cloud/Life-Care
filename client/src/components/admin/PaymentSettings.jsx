import { useState, useEffect } from 'react';
import { Card, Form, Button, Alert, Table, Modal } from 'react-bootstrap';
import { paymentAPI, adminAPI } from '../../services/api';

const PaymentSettings = () => {
  const [settings, setSettings] = useState({ globalMargin: 20, counsellorMargins: [] });
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedCounsellor, setSelectedCounsellor] = useState('');
  const [customMargin, setCustomMargin] = useState(20);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, counsellorsRes] = await Promise.all([
        paymentAPI.getSettings(),
        adminAPI.getCounsellors()
      ]);
      
      setSettings(settingsRes.data.data);
      setCounsellors(counsellorsRes.data.data);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalMarginChange = async (e) => {
    const newMargin = parseFloat(e.target.value);
    
    try {
      setSaving(true);
      await paymentAPI.updateSettings({ globalMargin: newMargin });
      setSettings(prev => ({ ...prev, globalMargin: newMargin }));
      setSuccess('Global margin updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update global margin');
    } finally {
      setSaving(false);
    }
  };

  const handleAddCustomMargin = async () => {
    if (!selectedCounsellor) return;

    try {
      const newMargins = [...settings.counsellorMargins];
      const existingIndex = newMargins.findIndex(cm => cm.counsellor._id === selectedCounsellor);
      
      if (existingIndex >= 0) {
        newMargins[existingIndex].margin = customMargin;
      } else {
        newMargins.push({ counsellor: selectedCounsellor, margin: customMargin });
      }

      await paymentAPI.updateSettings({ counsellorMargins: newMargins });
      await fetchData();
      
      setShowModal(false);
      setSelectedCounsellor('');
      setCustomMargin(20);
      setSuccess('Custom margin updated successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update custom margin');
    }
  };

  const handleRemoveCustomMargin = async (counsellorId) => {
    try {
      const newMargins = settings.counsellorMargins.filter(
        cm => cm.counsellor._id !== counsellorId
      );
      
      await paymentAPI.updateSettings({ counsellorMargins: newMargins });
      await fetchData();
      
      setSuccess('Custom margin removed successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to remove custom margin');
    }
  };

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  return (
    <div>
      <h4 className="mb-4">Payment Settings</h4>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Card className="mb-4">
        <Card.Header>
          <h5>Global Platform Margin</h5>
        </Card.Header>
        <Card.Body>
          <Form.Group>
            <Form.Label>Platform Fee Percentage</Form.Label>
            <Form.Range
              min="0"
              max="50"
              step="1"
              value={settings.globalMargin}
              onChange={handleGlobalMarginChange}
              disabled={saving}
            />
            <div className="d-flex justify-content-between">
              <small>0%</small>
              <strong>{settings.globalMargin}%</strong>
              <small>50%</small>
            </div>
          </Form.Group>
          <p className="text-muted mt-2">
            This is the default platform fee applied to all counsellor sessions.
          </p>
        </Card.Body>
      </Card>

      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5>Custom Counsellor Margins</h5>
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            Add Custom Margin
          </Button>
        </Card.Header>
        <Card.Body>
          {settings.counsellorMargins.length === 0 ? (
            <p className="text-muted">No custom margins set. All counsellors use the global margin.</p>
          ) : (
            <Table responsive>
              <thead>
                <tr>
                  <th>Counsellor</th>
                  <th>Custom Margin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {settings.counsellorMargins.map((cm) => (
                  <tr key={cm.counsellor._id}>
                    <td>{cm.counsellor.user?.name || 'Unknown'}</td>
                    <td><strong>{cm.margin}%</strong></td>
                    <td>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveCustomMargin(cm.counsellor._id)}
                      >
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Set Custom Margin</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Select Counsellor</Form.Label>
            <Form.Select
              value={selectedCounsellor}
              onChange={(e) => setSelectedCounsellor(e.target.value)}
            >
              <option value="">Choose counsellor...</option>
              {counsellors.map((counsellor) => (
                <option key={counsellor._id} value={counsellor._id}>
                  {counsellor.user?.name || 'Unknown'}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group>
            <Form.Label>Custom Margin Percentage</Form.Label>
            <Form.Range
              min="0"
              max="50"
              step="1"
              value={customMargin}
              onChange={(e) => setCustomMargin(parseFloat(e.target.value))}
            />
            <div className="d-flex justify-content-between">
              <small>0%</small>
              <strong>{customMargin}%</strong>
              <small>50%</small>
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleAddCustomMargin}
            disabled={!selectedCounsellor}
          >
            Save Margin
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentSettings;