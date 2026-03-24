import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import heroImage from '../../assets/woman-psychologist.jpg';
import './Auth.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Login attempt with:', formData.email);
      const result = await login(formData);
      console.log('Login result:', result);
      
      // Check if OTP verification is required
      if (result.requireOTP) {
        setShowOTPModal(true);
        return;
      }
      
      // Navigation is handled by AuthContext
    } catch (err) {
      console.error('Login error:', err);
      console.error('Response data:', err.response?.data);
      
      // Check if OTP verification is required from error response
      if (err.response?.data?.requireOTP) {
        setShowOTPModal(true);
        return;
      }
      
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setOtpError('');
    
    if (!otp || otp.length !== 6) {
      return setOtpError('Please enter a valid 6-digit OTP');
    }

    setOtpLoading(true);

    try {
      await authAPI.verifyOTP(formData.email, otp);
      
      // Auto-login after successful verification
      await login(formData);
      
      // Navigation is handled by AuthContext
    } catch (err) {
      setOtpError(err.response?.data?.message || 'OTP verification failed');
    } finally {
      setOtpLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    setOtpError('');

    try {
      await authAPI.resendOTP(formData.email);
      setOtpError('OTP sent successfully!');
      setTimeout(() => setOtpError(''), 3000);
    } catch (err) {
      setOtpError(err.response?.data?.message || 'Failed to resend OTP');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-image" style={{ backgroundImage: `url(${heroImage})` }}>
            <div className="auth-overlay">
              <div className="auth-text">
                <h2>Welcome Back</h2>
                <p>Your mental health journey continues here</p>
              </div>
            </div>
          </div>
          <div className="auth-form">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Login</h2>
                <p className="text-muted">Welcome back to S S Psychologist Life Care</p>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="Enter your password"
                      style={{ paddingRight: '45px' }}
                    />
                    <Button
                      variant="link"
                      className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                      style={{ zIndex: 10, padding: '0 12px' }}
                      onClick={() => setShowPassword(!showPassword)}
                      type="button"
                    >
                      <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                    </Button>
                  </div>
                </Form.Group>

                <div className="d-flex justify-content-between mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                  />
                  <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Login'}
                </Button>

                <div className="text-center">
                  <p>Don't have an account? <Link to="/register" className="text-decoration-none">Register</Link></p>
                </div>
              </Form>
            </div>
          </div>
        </div>


      {/* OTP Verification Modal */}
      <Modal 
        show={showOTPModal} 
        onHide={() => setShowOTPModal(false)}
        centered
        backdrop="static"
        keyboard={false}
        className="otp-modal"
        style={{ zIndex: 10010 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Verify Your Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <div className="otp-icon mb-3">
              <i className="bi bi-envelope-check" style={{ fontSize: '3rem', color: '#2563eb' }}></i>
            </div>
            <h5>Enter Verification Code</h5>
            <p className="text-muted">
              We've sent a 6-digit verification code to<br/>
              <strong>{formData.email}</strong>
            </p>
          </div>

          {otpError && (
            <Alert variant={otpError.includes('successfully') ? 'success' : 'danger'}>
              {otpError}
            </Alert>
          )}

          <Form onSubmit={handleOTPSubmit}>
            <Form.Group className="mb-4">
              <Form.Control
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="Enter 6-digit OTP"
                className="text-center otp-input"
                style={{ fontSize: '1.5rem', letterSpacing: '0.5rem', padding: '15px' }}
                maxLength={6}
                required
              />
            </Form.Group>

            <Button
              variant="primary"
              type="submit"
              className="w-100 mb-3"
              disabled={otpLoading || otp.length !== 6}
            >
              {otpLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Verifying...
                </>
              ) : (
                'Verify & Login'
              )}
            </Button>

            <div className="text-center">
              <p className="mb-2">Didn't receive the code?</p>
              <Button
                variant="link"
                onClick={handleResendOTP}
                disabled={resendLoading}
                className="p-0"
              >
                {resendLoading ? 'Sending...' : 'Resend OTP'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Login;