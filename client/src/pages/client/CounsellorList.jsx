import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const CounsellorList = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCounsellors = async () => {
      try {
        const res = await api.get('/counsellors');
        setCounsellors(res.data.counsellors);
        setLoading(false);
      } catch (err) {
        setError('Failed to load counsellors');
        setLoading(false);
      }
    };

    fetchCounsellors();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">{error}</div>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <h2 className="mb-4">Our Counsellors</h2>
      
      <Row>
        {counsellors.length === 0 ? (
          <Col>
            <p>No counsellors available at the moment.</p>
          </Col>
        ) : (
          counsellors.map(counsellor => (
            <Col key={counsellor._id} md={4} className="mb-4">
              <Card>
                <Card.Img 
                  variant="top" 
                  src={counsellor.profileImage || 'https://via.placeholder.com/300'} 
                  alt={counsellor.name}
                />
                <Card.Body>
                  <Card.Title>{counsellor.name}</Card.Title>
                  <Card.Text>
                    <strong>Specialization:</strong> {counsellor.specialization}<br />
                    <strong>Experience:</strong> {counsellor.experience} years<br />
                    <strong>Fee:</strong> ₹{counsellor.fees} per session
                  </Card.Text>
                  <Link to={`/client/book-appointment/${counsellor._id}`}>
                    <Button variant="primary">Book Appointment</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
};

export default CounsellorList;