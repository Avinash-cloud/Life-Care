import { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { counsellorAPI } from '../../services/api';
import './Availability.css';
import '../client/Dashboard.css';

const Availability = () => {
  const [availability, setAvailability] = useState({
    monday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] },
    tuesday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] },
    wednesday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] },
    thursday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] },
    friday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] },
    saturday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] },
    sunday: { isAvailable: false, startTime: '09:00', endTime: '17:00', slots: [] }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      setLoading(true);
      const response = await counsellorAPI.getProfile();
      if (response.data.data.availability) {
        setAvailability(response.data.data.availability);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
      setError('Failed to load your availability. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDayToggle = (day) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        isAvailable: !availability[day].isAvailable
      }
    });
  };

  const handleTimeChange = (day, field, value) => {
    setAvailability({
      ...availability,
      [day]: {
        ...availability[day],
        [field]: value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setSaving(true);

    try {
      await counsellorAPI.updateAvailability({ availability });
      setSuccess('Availability updated successfully!');
    } catch (error) {
      console.error('Error updating availability:', error);
      setError('Failed to update availability. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const days = [
    { key: 'monday', label: 'Monday', icon: 'M' },
    { key: 'tuesday', label: 'Tuesday', icon: 'T' },
    { key: 'wednesday', label: 'Wednesday', icon: 'W' },
    { key: 'thursday', label: 'Thursday', icon: 'T' },
    { key: 'friday', label: 'Friday', icon: 'F' },
    { key: 'saturday', label: 'Saturday', icon: 'S' },
    { key: 'sunday', label: 'Sunday', icon: 'S' }
  ];

  return (
    <div className="availability-page">
      <div className="availability-header">
        <div className="d-flex align-items-center mb-2">
          <div className="stat-icon me-3">
            <i className="bi bi-calendar-week"></i>
          </div>
          <h1>Manage Availability</h1>
        </div>
        <p>Set your weekly availability for client appointments</p>
      </div>
      
      <Card className="availability-card">
        <Card.Body className="p-4">
          {loading ? (
            <div className="loading-state">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Loading your availability...</p>
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              {success && <Alert variant="success">{success}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>}
              
              <div className="alert alert-info mb-4" style={{ backgroundColor: 'rgba(37, 99, 235, 0.05)', border: 'none' }}>
                <div className="d-flex align-items-center">
                  <i className="bi bi-info-circle text-primary me-3 fs-4"></i>
                  <p className="mb-0">Select the days you're available and set your working hours. Clients will be able to book appointments during these times.</p>
                </div>
              </div>
              
              {days.map((day) => (
                <Card 
                  key={day.key} 
                  className={`day-card ${availability[day.key].isAvailable ? 'active' : ''}`}
                >
                  <Card.Body className="p-3">
                    <Row className="align-items-center">
                      <Col md={3} className="d-flex align-items-center">
                        <div className="day-icon">
                          {day.icon}
                        </div>
                        <Form.Check
                          type="switch"
                          id={`${day.key}-toggle`}
                          label={day.label}
                          checked={availability[day.key].isAvailable}
                          onChange={() => handleDayToggle(day.key)}
                          className="form-switch"
                        />
                      </Col>
                      
                      <Col md={9}>
                        <Row>
                          <Col md={5}>
                            <Form.Group>
                              <Form.Label className={!availability[day.key].isAvailable ? 'text-muted' : ''}>
                                <i className={`bi bi-clock me-2 ${availability[day.key].isAvailable ? 'text-primary' : 'text-muted'}`}></i>
                                Start Time
                              </Form.Label>
                              <Form.Control
                                type="time"
                                value={availability[day.key].startTime}
                                onChange={(e) => handleTimeChange(day.key, 'startTime', e.target.value)}
                                disabled={!availability[day.key].isAvailable}
                              />
                            </Form.Group>
                          </Col>
                          <Col md={5}>
                            <Form.Group>
                              <Form.Label className={!availability[day.key].isAvailable ? 'text-muted' : ''}>
                                <i className={`bi bi-clock-history me-2 ${availability[day.key].isAvailable ? 'text-primary' : 'text-muted'}`}></i>
                                End Time
                              </Form.Label>
                              <Form.Control
                                type="time"
                                value={availability[day.key].endTime}
                                onChange={(e) => handleTimeChange(day.key, 'endTime', e.target.value)}
                                disabled={!availability[day.key].isAvailable}
                              />
                            </Form.Group>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              ))}
              
              <div className="d-flex justify-content-end mt-4">
                <Button 
                  variant="primary" 
                  type="submit" 
                  disabled={saving}
                  className="save-button"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary-color), var(--primary-dark))',
                    boxShadow: '0 5px 15px rgba(37, 99, 235, 0.2)',
                    padding: '12px 30px'
                  }}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Save Availability
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Availability;