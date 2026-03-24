import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Alert, Card, Container, Row, Col, Button } from 'react-bootstrap';
import { authAPI } from '../../services/api';
import './Auth.css';

const VerifyEmail = () => {
  const [status, setStatus] = useState('verifying'); // verifying, success, error
  const [message, setMessage] = useState('');
  const { token } = useParams();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await authAPI.verifyEmail(token);
        setStatus('success');
        setMessage(response.data.message);
      } catch (error) {
        setStatus('error');
        setMessage(error.response?.data?.message || 'Email verification failed');
      }
    };

    if (token) {
      verifyEmail();
    } else {
      setStatus('error');
      setMessage('Invalid verification link');
    }
  }, [token]);

  return (
    <div className="auth-page">
      <Container>
        <Row className="justify-content-center">
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Body className="text-center p-5">
                {status === 'verifying' && (
                  <>
                    <div className="spinner-border text-primary mb-3" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <h4>Verifying your email...</h4>
                    <p className="text-muted">Please wait while we verify your email address.</p>
                  </>
                )}

                {status === 'success' && (
                  <>
                    <div className="text-success mb-3">
                      <i className="bi bi-check-circle" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h4 className="text-success">Email Verified Successfully!</h4>
                    <Alert variant="success" className="mt-3">
                      {message}
                    </Alert>
                    <p className="text-muted mb-4">
                      Your email has been verified. You can now access all features of your account.
                    </p>
                    <Link to="/login" className="btn btn-primary">
                      Continue to Login
                    </Link>
                  </>
                )}

                {status === 'error' && (
                  <>
                    <div className="text-danger mb-3">
                      <i className="bi bi-x-circle" style={{ fontSize: '4rem' }}></i>
                    </div>
                    <h4 className="text-danger">Verification Failed</h4>
                    <Alert variant="danger" className="mt-3">
                      {message}
                    </Alert>
                    <p className="text-muted mb-4">
                      The verification link may be invalid or expired. Please try registering again or contact support.
                    </p>
                    <div className="d-flex gap-2 justify-content-center">
                      <Link to="/register" className="btn btn-primary">
                        Register Again
                      </Link>
                      <Link to="/contact" className="btn btn-outline-secondary">
                        Contact Support
                      </Link>
                    </div>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default VerifyEmail;