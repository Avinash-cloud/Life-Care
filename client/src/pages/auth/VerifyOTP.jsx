import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { verifyOTP, resendOTP } = useAuth();

  // Get email from location state
  const email = location.state?.email;
  const isLogin = location.state?.isLogin;

  useEffect(() => {
    // Redirect if no email is provided
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  useEffect(() => {
    // Countdown timer for resend OTP
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (e) => {
    setOtp(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await verifyOTP(email, otp);
      
      // Redirect based on user role
      if (result.role === 'client') {
        navigate('/client/dashboard');
      } else if (result.role === 'counsellor') {
        navigate('/counsellor/dashboard');
      } else if (result.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setResendLoading(true);

    try {
      await resendOTP(email);
      setCountdown(60); // 60 seconds cooldown
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Verify OTP</h2>
                <p className="text-muted">
                  {isLogin 
                    ? 'Please verify your email to login' 
                    : 'Please verify your email to complete registration'}
                </p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Enter OTP sent to {email}</Form.Label>
                  <Form.Control
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={handleChange}
                    required
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                  />
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>

                <div className="text-center">
                  <Button
                    variant="link"
                    onClick={handleResendOTP}
                    disabled={resendLoading || countdown > 0}
                    className="text-decoration-none p-0"
                  >
                    {countdown > 0 
                      ? `Resend OTP in ${countdown}s` 
                      : resendLoading ? 'Sending...' : 'Resend OTP'}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default VerifyOTP;