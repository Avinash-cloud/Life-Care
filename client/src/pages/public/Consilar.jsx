import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const Consilar = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: '',
    sessionType: 'video',
    notes: ''
  });
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotLoading, setSlotLoading] = useState(false);

  useEffect(() => {
    fetchCounsellors();
  }, []);

  const fetchCounsellors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/cms/counsellors`);
      const data = await res.json();
      if (data.success) {
        setCounsellors(data.data);
      }
      setLoading(false);
    } catch (err) {
      setError('Failed to load counsellors');
      setLoading(false);
    }
  };

  const handleBookNow = (counsellor) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    setSelectedCounsellor(counsellor);
    setShowBookingModal(true);
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setBookingData({ ...bookingData, date });
    setSelectedSlot(null);
    
    if (!date || !selectedCounsellor) return;
    
    try {
      setSlotLoading(true);
      const res = await api.get(`/appointments/available-slots?counsellorId=${selectedCounsellor._id}&date=${date}`);
      setAvailableSlots(res.data.slots);
      setSlotLoading(false);
    } catch (err) {
      setError('Failed to load available slots');
      setSlotLoading(false);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedSlot) {
      setError('Please select a time slot');
      return;
    }

    try {
      const appointmentData = {
        counsellorId: selectedCounsellor._id,
        date: bookingData.date,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
        sessionType: bookingData.sessionType,
        notes: bookingData.notes
      };
      
      const res = await api.post('/appointments/book', appointmentData);
      const { appointment, razorpayOrder } = res.data.data;
      
      // Initialize Razorpay payment
      if (window.Razorpay) {
        // Real Razorpay payment
        const options = {
          key: razorpayOrder.key_id,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'S S Psychologist Life Care',
          description: `Session with ${selectedCounsellor.user?.name}`,
          order_id: razorpayOrder.id,
          handler: async function (response) {
            try {
              await api.post('/appointments/verify-payment', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId: appointment._id
              });
              
              setShowBookingModal(false);
              alert('Payment successful! Appointment confirmed.');
              navigate('/client/appointments');
            } catch (error) {
              setError('Payment verification failed');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || ''
          },
          theme: {
            color: '#007bff'
          }
        };
        
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        setError('Razorpay is not loaded. Please refresh the page.');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  const formatTime = (time) => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minutes} ${ampm}`;
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
        <p className="mt-2">Loading counsellors...</p>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <div className="text-center mb-5">
        <h1 className="display-4 fw-bold text-primary">Book Your Session</h1>
        <p className="lead">Connect with our qualified mental health professionals</p>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        {counsellors.map(counsellor => (
          <Col md={6} lg={4} key={counsellor._id} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Img 
                variant="top" 
                src={counsellor.user?.avatar || 'https://via.placeholder.com/300'} 
                alt={counsellor.user?.name}
                style={{ height: '350px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{counsellor.user?.name}</Card.Title>
                <Card.Text>
                  <strong>Specializations:</strong> {counsellor.specializations?.join(', ')}<br />
                  <strong>Experience:</strong> {counsellor.experience} years<br />
                  <strong>Online fees:</strong> ₹{counsellor.fees?.video || counsellor.fees} per session
                </Card.Text>
                <Button 
                  variant="primary" 
                  className="mt-auto"
                  onClick={() => handleBookNow(counsellor)}
                >
                  Book Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Book Appointment with {selectedCounsellor?.user?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Date</Form.Label>
              <Form.Control
                type="date"
                min={getMinDate()}
                value={bookingData.date}
                onChange={handleDateChange}
                required
              />
            </Form.Group>
            
            {slotLoading ? (
              <div className="text-center my-4">
                <Spinner animation="border" size="sm" />
                <span className="ms-2">Loading available slots...</span>
              </div>
            ) : (
              <>
                {bookingData.date && (
                  <Form.Group className="mb-3">
                    <Form.Label>Select Time Slot</Form.Label>
                    {availableSlots.length === 0 ? (
                      <Alert variant="info">
                        No slots available on this date. Please select another date.
                      </Alert>
                    ) : (
                      <div className="d-flex flex-wrap gap-2">
                        {availableSlots.map((slot, index) => (
                          <Button
                            key={index}
                            variant={selectedSlot === slot ? "primary" : "outline-primary"}
                            onClick={() => setSelectedSlot(slot)}
                            className="mb-2"
                          >
                            {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                          </Button>
                        ))}
                      </div>
                    )}
                  </Form.Group>
                )}
              </>
            )}
            
            <Form.Group className="mb-3">
              <Form.Label>Session Type</Form.Label>
              <Form.Select
                value={bookingData.sessionType}
                onChange={(e) => setBookingData({ ...bookingData, sessionType: e.target.value })}
                required
              >
                <option value="video">Video Call</option>
                <option value="chat">Chat</option>
                <option value="in-person">In-Person</option>
              </Form.Select>
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Notes (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                placeholder="Any specific concerns or topics you'd like to discuss"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleBookAppointment}
            disabled={!selectedSlot}
          >
            Proceed to Payment
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Consilar;