import React, { useState, useEffect } from 'react';
import { Row, Col } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';
import { clientAPI, uploadAPI } from '../../services/api';
import { getAvatarUrl } from '../../utils/imageUtils';
import './Profile.css';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || '',
        gender: user.gender || '',
        dateOfBirth: user.dateOfBirth ? user.dateOfBirth.split('T')[0] : '',
        address: user.address || '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }
  }, [user]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handlePersonalInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const updateData = {
        name: formData.name,
        phone: formData.phone,
        avatar: formData.avatar,
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth,
        address: formData.address
      };
      
      const response = await clientAPI.updateProfile(updateData);
      setUser(response.data.data);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file) => {
    try {
      const response = await uploadAPI.uploadAvatar(file);
      const avatarUrl = response.data.data.url;
      setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      return avatarUrl;
    } catch (error) {
      console.error('Error uploading avatar:', error);
      throw error;
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    
    if (formData.newPassword.length < 6) {
      alert('New password must be at least 6 characters long!');
      return;
    }
    
    try {
      setPasswordLoading(true);
      await authAPI.updatePassword({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      });
      
      alert('Password updated successfully!');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error) {
      console.error('Error updating password:', error);
      alert(error.response?.data?.message || 'Failed to update password. Please check your current password.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <h1>My Profile</h1>
        <p>Manage your personal information and account settings</p>
      </div>
      
      <div className="card">
        <div className="card-body">
          <ul className={`nav nav-tabs ${activeTab === 'security' ? 'security-active' : ''}`}>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                <i className="bi bi-person me-2"></i>Personal
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'security' ? 'active' : ''}`}
                onClick={() => setActiveTab('security')}
              >
                <i className="bi bi-shield-lock me-2"></i>Security
              </button>
            </li>
          </ul>
          
          {activeTab === 'personal' ? (
            <form onSubmit={handlePersonalInfoSubmit}>
              <Row className="mb-4">
                <Col md={3} className="text-center">
                  <div className="avatar-upload-section" style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={getAvatarUrl(formData.avatar)}
                      alt="Profile"
                      className="avatar-image"
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        objectFit: 'cover', 
                        borderRadius: '50%',
                        border: '4px solid #e9ecef'
                      }}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const avatarUrl = await handleAvatarUpload(file);
                            setFormData(prev => ({ ...prev, avatar: avatarUrl }));
                          } catch (error) {
                            alert('Failed to upload image');
                          }
                        }
                      }}
                      style={{ display: 'none' }}
                      id="avatar-upload"
                    />
                    <label 
                      htmlFor="avatar-upload" 
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        border: '2px solid white',
                        fontSize: '16px'
                      }}
                    >
                      <i className="bi bi-camera"></i>
                    </label>
                  </div>
                  <h5 className="mt-2">{formData.name}</h5>
                  <p className="text-muted">{formData.email}</p>
                </Col>
                <Col md={9}>
                  <Row className="g-3">
                    <Col md={4}>
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={4}>
                      <label htmlFor="email" className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled
                      />
                      <small className="text-muted">Email cannot be changed</small>
                    </Col>
                    <Col md={4}>
                      <label htmlFor="phone" className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={4}>
                      <label htmlFor="gender" className="form-label">Gender</label>
                      <select
                        className="form-select"
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </Col>
                    <Col md={4}>
                      <label htmlFor="dateOfBirth" className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    </Col>
                    <Col md={12}>
                      <label htmlFor="address" className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        id="address"
                        name="address"
                        rows="3"
                        value={formData.address}
                        onChange={handleChange}
                      ></textarea>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <div className="d-flex justify-content-end">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <>
                      <div className="spinner-border spinner-border-sm me-2" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-save me-2"></i>Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <Row>
              <Col md={6}>
                <div className="card mb-4">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">
                      <i className="bi bi-key me-2 text-primary"></i>
                      Change Password
                    </h5>
                  </div>
                  <div className="card-body">
                    <form onSubmit={handlePasswordSubmit}>
                      <div className="mb-3">
                        <label htmlFor="currentPassword" className="form-label">Current Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="currentPassword"
                          name="currentPassword"
                          value={formData.currentPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="newPassword" className="form-label">New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm New Password</label>
                        <input
                          type="password"
                          className="form-control"
                          id="confirmPassword"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
                        {passwordLoading ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-shield-check me-2"></i>Update Password
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </Col>
              <Col md={6}>
                <div className="card">
                  <div className="card-header bg-white">
                    <h5 className="mb-0">
                      <i className="bi bi-link-45deg me-2 text-primary"></i>
                      Linked Accounts
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-grid gap-3">
                      <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-google fs-4 me-3 text-danger"></i>
                          <div>
                            <h6 className="mb-0">Google</h6>
                            <small className="text-muted">Not connected</small>
                          </div>
                        </div>
                        <button className="btn btn-outline-primary btn-sm">
                          <i className="bi bi-link me-2"></i>Connect
                        </button>
                      </div>
                      <div className="d-flex justify-content-between align-items-center p-3 border rounded">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-facebook fs-4 me-3 text-primary"></i>
                          <div>
                            <h6 className="mb-0">Facebook</h6>
                            <small className="text-muted">Not connected</small>
                          </div>
                        </div>
                        <button className="btn btn-outline-primary btn-sm">
                          <i className="bi bi-link me-2"></i>Connect
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;