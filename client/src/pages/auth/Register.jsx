import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, Modal } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { authAPI } from '../../services/api';
import groupImage from '../../assets/group.jpg';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'client'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { register, login } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    // Validate password strength
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);

    try {
      const { confirmPassword, ...registerData } = formData;
      const result = await register(registerData);
      
      // Registration successful - redirect to login or dashboard
      if (result.success) {
        setError('');
        // Auto-login the user
        await login({ email: formData.email, password: formData.password });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card register-card">
          <div className="auth-image" style={{ backgroundImage: `url(${groupImage})` }}>
            <div className="auth-overlay">
              <div className="auth-text">
                <h2>Join Our Community</h2>
                <p>Start your mental health journey today</p>
              </div>
            </div>
          </div>
          <div className="auth-form">
              <div className="text-center mb-4">
                <h3 className="fw-bold">Create an Account</h3>
                <p className="text-muted">Fill in your details to get started</p>
              </div>
              
              <div className="step-indicator mb-4">
                <div className="step-progress">
                  <div className="step-progress-bar" style={{ width: '50%' }}></div>
                </div>
                <div className="step-circles">
                  <div className="step-circle active">
                    <span>1</span>
                    <p>Personal Info</p>
                  </div>
                  <div className="step-circle">
                    <span>2</span>
                    <p>Account Setup</p>
                  </div>
                  <div className="step-circle">
                    <span>✓</span>
                    <p>Complete</p>
                  </div>
                </div>
              </div>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                  />
                </Form.Group>

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
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    pattern="[0-9]{10}"
                  />
                  <Form.Text className="text-muted">
                    Enter 10-digit phone number (optional)
                  </Form.Text>
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
                      placeholder="Create a password"
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
                  <Form.Text className="text-muted">
                    Password must be at least 6 characters long
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Confirm Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="Confirm your password"
                      style={{ paddingRight: '45px' }}
                    />
                    <Button
                      variant="link"
                      className="position-absolute top-50 end-0 translate-middle-y border-0 bg-transparent"
                      style={{ zIndex: 10, padding: '0 12px' }}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      type="button"
                    >
                      <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                    </Button>
                  </div>
                </Form.Group>

                <div className="mb-3">
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Client Registration:</strong> This registration is for clients seeking mental health support. 
                    A verification link will be sent to your email, but you can start using your account immediately.
                  </div>
                </div>

                <Button
                  variant="primary"
                  type="submit"
                  className="w-100 mb-3"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Register'}
                </Button>

                <div className="text-center">
                  <p>Already have an account? <Link to="/login" className="text-decoration-none">Login</Link></p>
                </div>
              </Form>
            </div>
          </div>
        </div>
      

    </div>
  );
};

export default Register;