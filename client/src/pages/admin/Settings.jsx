import { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert, Tab, Nav } from 'react-bootstrap';
import { adminAPI, uploadAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { getAvatarUrl } from '../../utils/imageUtils';
import PaymentSettings from '../../components/admin/PaymentSettings';
import '../client/Dashboard.css';
import './AdminStyles.css';

const Settings = () => {
  const { user, fetchCurrentUser } = useAuth();
  const [settings, setSettings] = useState({
    platform: {
      name: '',
      description: '',
      logo: '',
      favicon: '',
      primaryColor: '',
      secondaryColor: ''
    },
    email: {
      smtpHost: '',
      smtpPort: '',
      smtpUser: '',
      supportEmail: ''
    },
    payment: {
      razorpayEnabled: false,
      stripeEnabled: false,
      currency: 'INR',
      taxRate: 18
    },
    features: {
      videoCallEnabled: true,
      chatEnabled: true,
      blogEnabled: true,
      galleryEnabled: true,
      reviewsEnabled: true
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [activeTab, setActiveTab] = useState('platform');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getSettings();
      setSettings(response.data.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
      showAlert('Error fetching settings', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      await adminAPI.updateSettings(settings);
      showAlert('Settings updated successfully');
    } catch (error) {
      console.error('Error updating settings:', error);
      showAlert('Error updating settings', 'danger');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading settings...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <div className="stat-icon me-3">
          <i className="bi bi-gear"></i>
        </div>
        <h2 className="text-gradient mb-0">Platform Settings</h2>
      </div>

      {alert.show && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: 'success' })}>
          {alert.message}
        </Alert>
      )}

      <Card className="dashboard-card">
        <Card.Header className="border-bottom-0">
          <div className="content-tabs-wrapper">
            <div className={`content-tabs settings-tabs ${activeTab === 'email' ? 'email-active' : activeTab === 'payment' ? 'payment-active' : activeTab === 'features' ? 'features-active' : ''}`}>
              <button 
                className={`content-tab ${activeTab === 'platform' ? 'active' : ''}`}
                onClick={() => setActiveTab('platform')}
              >
                <i className="bi bi-building"></i>Platform
              </button>
              <button 
                className={`content-tab ${activeTab === 'email' ? 'active' : ''}`}
                onClick={() => setActiveTab('email')}
              >
                <i className="bi bi-envelope"></i>Email
              </button>
              <button 
                className={`content-tab ${activeTab === 'payment' ? 'active' : ''}`}
                onClick={() => setActiveTab('payment')}
              >
                <i className="bi bi-credit-card"></i>Payment
              </button>
              <button 
                className={`content-tab ${activeTab === 'margins' ? 'active' : ''}`}
                onClick={() => setActiveTab('margins')}
              >
                <i className="bi bi-percent"></i>Margins
              </button>
              <button 
                className={`content-tab ${activeTab === 'features' ? 'active' : ''}`}
                onClick={() => setActiveTab('features')}
              >
                <i className="bi bi-toggles"></i>Features
              </button>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Tab.Container activeKey={activeTab}>
            <Tab.Content>
              {/* Platform Settings */}
              <Tab.Pane eventKey="platform">
                <h5 className="mb-4">Platform Configuration</h5>
                
                {/* Admin Profile Section */}
                <Card className="mb-4 border">
                  <Card.Body>
                    <h6 className="mb-3">Admin Profile</h6>
                    <Row>
                      <Col md={3} className="text-center">
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <img
                            src={getAvatarUrl(user?.avatar)}
                            alt="Admin Avatar"
                            style={{ 
                              width: '120px', 
                              height: '120px', 
                              objectFit: 'cover', 
                              borderRadius: '50%',
                              border: '3px solid #dee2e6'
                            }}
                          />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                try {
                                  setSaving(true);
                                  const response = await uploadAPI.uploadAvatar(file);
                                  const avatarUrl = response.data.data.url;
                                  await adminAPI.updateUser(user._id, { avatar: avatarUrl });
                                  await fetchCurrentUser();
                                  showAlert('Profile picture updated successfully');
                                } catch (error) {
                                  showAlert('Failed to upload profile picture', 'danger');
                                } finally {
                                  setSaving(false);
                                }
                              }
                            }}
                            style={{ display: 'none' }}
                            id="admin-avatar-upload"
                          />
                          <label 
                            htmlFor="admin-avatar-upload" 
                            style={{
                              position: 'absolute',
                              bottom: '5px',
                              right: '5px',
                              backgroundColor: '#0d6efd',
                              color: 'white',
                              borderRadius: '50%',
                              width: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              cursor: 'pointer',
                              border: '2px solid white',
                              fontSize: '14px'
                            }}
                          >
                            <i className="bi bi-camera-fill"></i>
                          </label>
                        </div>
                        <h6 className="mt-2 mb-0">{user?.name}</h6>
                        <small className="text-muted">{user?.email}</small>
                      </Col>
                      <Col md={9}>
                        <p className="text-muted mb-0">
                          <i className="bi bi-info-circle me-2"></i>
                          Click the camera icon to update your profile picture
                        </p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                
                <h6 className="mb-3">Platform Details</h6>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Platform Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={settings.platform.name}
                        onChange={(e) => handleInputChange('platform', 'name', e.target.value)}
                        placeholder="S S Psychologist Life Care"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Platform Description</Form.Label>
                      <Form.Control
                        type="text"
                        value={settings.platform.description}
                        onChange={(e) => handleInputChange('platform', 'description', e.target.value)}
                        placeholder="Mental Health Support Platform"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Logo URL</Form.Label>
                      <Form.Control
                        type="url"
                        value={settings.platform.logo}
                        onChange={(e) => handleInputChange('platform', 'logo', e.target.value)}
                        placeholder="/assets/logo.png"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Favicon URL</Form.Label>
                      <Form.Control
                        type="url"
                        value={settings.platform.favicon}
                        onChange={(e) => handleInputChange('platform', 'favicon', e.target.value)}
                        placeholder="/assets/favicon.ico"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Primary Color</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="color"
                          value={settings.platform.primaryColor}
                          onChange={(e) => handleInputChange('platform', 'primaryColor', e.target.value)}
                          style={{ width: '60px', height: '40px' }}
                          className="me-3"
                        />
                        <Form.Control
                          type="text"
                          value={settings.platform.primaryColor}
                          onChange={(e) => handleInputChange('platform', 'primaryColor', e.target.value)}
                          placeholder="#2563eb"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Secondary Color</Form.Label>
                      <div className="d-flex align-items-center">
                        <Form.Control
                          type="color"
                          value={settings.platform.secondaryColor}
                          onChange={(e) => handleInputChange('platform', 'secondaryColor', e.target.value)}
                          style={{ width: '60px', height: '40px' }}
                          className="me-3"
                        />
                        <Form.Control
                          type="text"
                          value={settings.platform.secondaryColor}
                          onChange={(e) => handleInputChange('platform', 'secondaryColor', e.target.value)}
                          placeholder="#10b981"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              </Tab.Pane>

              {/* Email Settings */}
              <Tab.Pane eventKey="email">
                <h5 className="mb-4">Email Configuration</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>SMTP Host</Form.Label>
                      <Form.Control
                        type="text"
                        value={settings.email.smtpHost}
                        onChange={(e) => handleInputChange('email', 'smtpHost', e.target.value)}
                        placeholder="smtp.gmail.com"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>SMTP Port</Form.Label>
                      <Form.Control
                        type="number"
                        value={settings.email.smtpPort}
                        onChange={(e) => handleInputChange('email', 'smtpPort', e.target.value)}
                        placeholder="587"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>SMTP Username</Form.Label>
                      <Form.Control
                        type="email"
                        value={settings.email.smtpUser}
                        onChange={(e) => handleInputChange('email', 'smtpUser', e.target.value)}
                        placeholder="your-email@gmail.com"
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Support Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={settings.email.supportEmail}
                        onChange={(e) => handleInputChange('email', 'supportEmail', e.target.value)}
                        placeholder="support@lifecare.com"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="alert alert-info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Note:</strong> SMTP password should be configured via environment variables for security.
                </div>
              </Tab.Pane>

              {/* Margins Settings */}
              <Tab.Pane eventKey="margins">
                <PaymentSettings />
              </Tab.Pane>

              {/* Payment Settings */}
              <Tab.Pane eventKey="payment">
                <h5 className="mb-4">Payment Configuration</h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Currency</Form.Label>
                      <Form.Select
                        value={settings.payment.currency}
                        onChange={(e) => handleInputChange('payment', 'currency', e.target.value)}
                      >
                        <option value="INR">Indian Rupee (INR)</option>
                        <option value="USD">US Dollar (USD)</option>
                        <option value="EUR">Euro (EUR)</option>
                        <option value="GBP">British Pound (GBP)</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tax Rate (%)</Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        max="100"
                        step="0.01"
                        value={settings.payment.taxRate}
                        onChange={(e) => handleInputChange('payment', 'taxRate', parseFloat(e.target.value))}
                        placeholder="18"
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <h6 className="mb-3">Payment Gateways</h6>
                <Row>
                  <Col md={6}>
                    <Card className="border">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h6 className="mb-1">Razorpay</h6>
                            <small className="text-muted">Indian payment gateway</small>
                          </div>
                          <Form.Check
                            type="switch"
                            checked={settings.payment.razorpayEnabled}
                            onChange={(e) => handleInputChange('payment', 'razorpayEnabled', e.target.checked)}
                          />
                        </div>
                        <div className="text-muted small">
                          Status: {settings.payment.razorpayEnabled ? 
                            <span className="text-success">Enabled</span> : 
                            <span className="text-danger">Disabled</span>
                          }
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div>
                            <h6 className="mb-1">Stripe</h6>
                            <small className="text-muted">International payment gateway</small>
                          </div>
                          <Form.Check
                            type="switch"
                            checked={settings.payment.stripeEnabled}
                            onChange={(e) => handleInputChange('payment', 'stripeEnabled', e.target.checked)}
                          />
                        </div>
                        <div className="text-muted small">
                          Status: {settings.payment.stripeEnabled ? 
                            <span className="text-success">Enabled</span> : 
                            <span className="text-danger">Disabled</span>
                          }
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                
                <div className="alert alert-warning mt-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Important:</strong> Payment gateway API keys should be configured via environment variables.
                </div>
              </Tab.Pane>

              {/* Feature Settings */}
              <Tab.Pane eventKey="features">
                <h5 className="mb-4">Feature Configuration</h5>
                <Row>
                  <Col md={6}>
                    <Card className="border mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">Video Calling</h6>
                            <small className="text-muted">Enable video consultations</small>
                          </div>
                          <Form.Check
                            type="switch"
                            checked={settings.features.videoCallEnabled}
                            onChange={(e) => handleInputChange('features', 'videoCallEnabled', e.target.checked)}
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">Chat System</h6>
                            <small className="text-muted">Enable real-time messaging</small>
                          </div>
                          <Form.Check
                            type="switch"
                            checked={settings.features.chatEnabled}
                            onChange={(e) => handleInputChange('features', 'chatEnabled', e.target.checked)}
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">Blog System</h6>
                            <small className="text-muted">Enable blog and articles</small>
                          </div>
                          <Form.Check
                            type="switch"
                            checked={settings.features.blogEnabled}
                            onChange={(e) => handleInputChange('features', 'blogEnabled', e.target.checked)}
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">Gallery</h6>
                            <small className="text-muted">Enable image gallery</small>
                          </div>
                          <Form.Check
                            type="switch"
                            checked={settings.features.galleryEnabled}
                            onChange={(e) => handleInputChange('features', 'galleryEnabled', e.target.checked)}
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="border mb-3">
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="mb-1">Reviews & Ratings</h6>
                            <small className="text-muted">Enable user reviews</small>
                          </div>
                          <Form.Check
                            type="switch"
                            checked={settings.features.reviewsEnabled}
                            onChange={(e) => handleInputChange('features', 'reviewsEnabled', e.target.checked)}
                          />
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Tab.Pane>
            </Tab.Content>
          </Tab.Container>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-end">
          <Button 
            variant="primary" 
            onClick={handleSaveSettings}
            disabled={saving}
          >
            {saving ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Saving...
              </>
            ) : (
              <>
                <i className="bi bi-check-circle me-2"></i>Save Settings
              </>
            )}
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};

export default Settings;