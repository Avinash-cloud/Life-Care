import { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col, Modal, Alert } from 'react-bootstrap';
import { adminAPI, uploadAPI } from '../../services/api';

import TagsInput from '../../components/shared/TagsInput';
import '../client/Dashboard.css';
import './AdminStyles.css';

const Counsellors = () => {
  const [counsellors, setCounsellors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    isVerified: '',
    active: '',
    search: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCounsellor, setSelectedCounsellor] = useState(null);
  const [editCounsellor, setEditCounsellor] = useState({});
  const [newCounsellor, setNewCounsellor] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    profilePicture: '',
    counsellorType: 'counsellor',
    specializations: '',
    experience: '',
    qualifications: [{
      degree: '',
      institution: '',
      year: '',
      certificate: ''
    }],
    bio: '',
    videoFee: '',
    chatFee: '',
    languages: '',
    gender: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchCounsellors();
  }, []);

  const fetchCounsellors = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter.isVerified !== '') params.isVerified = filter.isVerified === 'true';
      if (filter.active !== '') params.active = filter.active === 'true';
      if (filter.search) params.search = filter.search;
      
      const response = await adminAPI.getCounsellors(params);
      setCounsellors(response.data.data);
    } catch (error) {
      console.error('Error fetching counsellors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchCounsellors();
  };

  const handleVerifyCounsellor = async (id, isVerified) => {
    try {
      await adminAPI.verifyCounsellor(id, isVerified);
      setCounsellors(counsellors.map(counsellor => 
        counsellor._id === id ? { ...counsellor, isVerified } : counsellor
      ));
      showAlert('Counsellor verification updated successfully');
    } catch (error) {
      console.error('Error updating counsellor verification:', error);
      showAlert('Error updating verification status', 'danger');
    }
  };

  const handleDeleteCounsellor = async (id) => {
    if (!window.confirm('Are you sure you want to delete this counsellor? This will also delete their user account.')) return;
    
    try {
      await adminAPI.deleteCounsellor(id);
      showAlert('Counsellor deleted successfully');
      fetchCounsellors();
    } catch (error) {
      console.error('Error deleting counsellor:', error);
      showAlert('Error deleting counsellor', 'danger');
    }
  };

  const handleEditCounsellor = (counsellor) => {
    setEditCounsellor({
      name: counsellor.user?.name || '',
      email: counsellor.user?.email || '',
      phone: counsellor.user?.phone || '',
      profilePicture: counsellor.user?.avatar || '',
      specializations: Array.isArray(counsellor.specializations) ? counsellor.specializations.join(', ') : counsellor.specializations || '',
      experience: counsellor.experience || '',
      qualifications: counsellor.qualifications || [{ degree: '', institution: '', year: '', certificate: '' }],
      bio: counsellor.bio || '',
      videoFee: counsellor.fees?.video || '',
      chatFee: counsellor.fees?.chat || '',
      languages: Array.isArray(counsellor.languages) ? counsellor.languages.join(', ') : counsellor.languages || '',
      gender: '',
      dateOfBirth: '',
      address: counsellor.location?.address || '',
      city: counsellor.location?.city || '',
      state: counsellor.location?.state || '',
      pincode: counsellor.location?.postalCode || ''
    });
    setSelectedCounsellor(counsellor);
    setShowEditModal(true);
  };

  const handleUpdateCounsellor = async () => {
    try {
      // Update user data first
      const userData = {
        name: editCounsellor.name,
        email: editCounsellor.email,
        phone: editCounsellor.phone,
        avatar: editCounsellor.profilePicture
      };
      
      await adminAPI.updateUser(selectedCounsellor.user._id, userData);
      
      // Update counsellor data
      const counsellorData = {
        specializations: editCounsellor.specializations,
        experience: parseInt(editCounsellor.experience) || 0,
        qualifications: editCounsellor.qualifications,
        bio: editCounsellor.bio,
        fees: {
          video: parseInt(editCounsellor.videoFee) || 0,
          chat: parseInt(editCounsellor.chatFee) || 0
        },
        languages: editCounsellor.languages,
        gender: editCounsellor.gender,
        dateOfBirth: editCounsellor.dateOfBirth,
        address: editCounsellor.address,
        city: editCounsellor.city,
        state: editCounsellor.state,
        pincode: editCounsellor.pincode
      };
      
      await adminAPI.updateCounsellor(selectedCounsellor._id, counsellorData);
      
      setShowEditModal(false);
      fetchCounsellors(); // Refresh the list
      showAlert('Counsellor updated successfully');
    } catch (error) {
      console.error('Error updating counsellor:', error);
      showAlert('Error updating counsellor', 'danger');
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleInputChange = (field, value) => {
    setNewCounsellor({ ...newCounsellor, [field]: value });
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!newCounsellor.name.trim()) newErrors.name = 'Name is required';
    if (!newCounsellor.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(newCounsellor.email)) {
      newErrors.email = 'Email format is invalid';
    }
    if (!newCounsellor.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (newCounsellor.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (!newCounsellor.profilePicture) newErrors.profilePicture = 'Profile picture is required';
    if (!newCounsellor.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(newCounsellor.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!newCounsellor.gender) newErrors.gender = 'Gender is required';
    if (!newCounsellor.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
    if (!newCounsellor.qualifications[0].degree.trim()) newErrors.degree = 'Degree is required';
    if (!newCounsellor.qualifications[0].institution.trim()) newErrors.institution = 'Institution is required';
    if (!newCounsellor.qualifications[0].year) newErrors.graduationYear = 'Graduation year is required';
    if (!newCounsellor.specializations.trim()) newErrors.specializations = 'Specializations are required';
    if (!newCounsellor.bio.trim()) newErrors.bio = 'Bio is required';
    if (!newCounsellor.videoFee.trim()) newErrors.videoFee = 'Video session fee is required';
    if (!newCounsellor.chatFee.trim()) newErrors.chatFee = 'Chat session fee is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddCounsellor = async () => {
    try {
      // Validate form
      if (!validateForm()) {
        return;
      }

      // Prepare data for backend
      const counsellorData = {
        ...newCounsellor,
        specializations: typeof newCounsellor.specializations === 'string' ? newCounsellor.specializations.split(',').map(s => s.trim()).filter(s => s) : newCounsellor.specializations,
        languages: typeof newCounsellor.languages === 'string' ? newCounsellor.languages.split(',').map(s => s.trim()).filter(s => s) : newCounsellor.languages,
        fees: {
          chat: parseInt(newCounsellor.chatFee) || 0,
          video: parseInt(newCounsellor.videoFee) || 0
        },
        qualifications: newCounsellor.qualifications.map(qual => ({
          degree: qual.degree,
          institution: qual.institution,
          year: parseInt(qual.year) || new Date().getFullYear(),
          certificate: qual.certificate || ''
        }))
      };
      
      // Create counsellor with profile
      await adminAPI.createCounsellor(counsellorData);
      
      // Reset form and close modal
      setNewCounsellor({
        name: '',
        email: '',
        password: '',
        phone: '',
        profilePicture: '',
        counsellorType: 'counsellor',
        specializations: '',
        experience: '',
        qualifications: [{
          degree: '',
          institution: '',
          year: '',
          certificate: ''
        }],
        bio: '',
        videoFee: '',
        chatFee: '',
        languages: '',
        gender: '',
        dateOfBirth: '',
        address: '',
        city: '',
        state: '',
        pincode: ''
      });
      setErrors({});
      setShowAddModal(false);
      
      // Refresh counsellors list
      fetchCounsellors();
      showAlert('Counsellor added successfully');
    } catch (error) {
      console.error('Error adding counsellor:', error);
      showAlert(error.response?.data?.message || 'Error adding counsellor', 'danger');
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <div className="stat-icon me-3">
          <i className="bi bi-person-badge"></i>
        </div>
        <h2 className="text-gradient mb-0">Counsellor Management</h2>
      </div>
      
      <Card className="dashboard-card mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center py-2">
          <div className="d-flex align-items-center">
            <div className="card-icon">
              <i className="bi bi-funnel"></i>
            </div>
            <h5 className="mb-0">Filter Counsellors</h5>
          </div>
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)}>
            <i className="bi bi-plus-circle me-2"></i>Add Counsellor
          </Button>
        </Card.Header>
        <Card.Body className="py-2">
          <Form onSubmit={handleFilterSubmit}>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">Verification Status</Form.Label>
                  <Form.Select 
                    name="isVerified" 
                    value={filter.isVerified} 
                    onChange={handleFilterChange}
                    size="sm"
                  >
                    <option value="">All</option>
                    <option value="true">Verified</option>
                    <option value="false">Pending Verification</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">Status</Form.Label>
                  <Form.Select 
                    name="active" 
                    value={filter.active} 
                    onChange={handleFilterChange}
                    size="sm"
                  >
                    <option value="">All</option>
                    <option value="true">Active</option>
                    <option value="false">Inactive</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">Search</Form.Label>
                  <Form.Control
                    type="text"
                    name="search"
                    value={filter.search}
                    onChange={handleFilterChange}
                    placeholder="Search by name or specialization"
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">&nbsp;</Form.Label>
                  <Button type="submit" variant="primary" size="sm" className="w-100">
                    <i className="bi bi-funnel-fill me-1"></i>Apply
                  </Button>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      <Card className="dashboard-card">
        <Card.Header>
          <div className="d-flex align-items-center">
            <div className="card-icon">
              <i className="bi bi-people"></i>
            </div>
            <h5 className="mb-0">Counsellors List</h5>
          </div>
        </Card.Header>
        <Card.Body>
          {alert.show && (
            <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: 'success' })}>
              {alert.message}
            </Alert>
          )}
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2">Loading counsellors...</p>
            </div>
          ) : counsellors.length > 0 ? (
            <div className="table-container">
              <Table responsive hover>
              <thead>
                <tr>
                  <th>Avatar</th>
                  <th>Name</th>
                  <th>Specializations</th>
                  <th>Experience</th>
                  <th>Verification</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {counsellors.map((counsellor) => (
                  <tr key={counsellor._id}>
                    <td>
                      <img
                        src={counsellor.user?.avatar || '/default-avatar.png'}
                        alt={counsellor.user?.name || counsellor.name}
                        className="rounded-circle"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{counsellor.user?.name || counsellor.name}</td>
                    <td>{counsellor.specializations?.join(', ') || 'N/A'}</td>
                    <td>{counsellor.experience} years</td>
                    <td>
                      <Badge bg={counsellor.isVerified ? 'primary' : 'warning'}>
                        {counsellor.isVerified ? 'Verified' : 'Pending'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={counsellor.active ? 'primary' : 'danger'}>
                        {counsellor.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      {counsellor.ratings?.average ? (
                        <span>
                          <i className="bi bi-star-fill text-warning me-1"></i>
                          {counsellor.ratings.average} ({counsellor.ratings.count})
                        </span>
                      ) : (
                        'No ratings'
                      )}
                    </td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-1"
                        onClick={() => {
                          setSelectedCounsellor(counsellor);
                          setShowProfileModal(true);
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm" 
                        className="me-1"
                        onClick={() => handleEditCounsellor(counsellor)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      {!counsellor.isVerified ? (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleVerifyCounsellor(counsellor._id, true)}
                        >
                          <i className="bi bi-check-lg"></i> Verify
                        </Button>
                      ) : (
                        <Button 
                          variant="outline-warning" 
                          size="sm"
                          onClick={() => handleVerifyCounsellor(counsellor._id, false)}
                        >
                          <i className="bi bi-x-lg"></i> Unverify
                        </Button>
                      )}
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => handleDeleteCounsellor(counsellor._id)}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="mb-0">No counsellors found</p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Add Counsellor Modal */}
      <Modal 
        show={showAddModal} 
        onHide={() => setShowAddModal(false)} 
        size="xl" 
        centered 
        dialogClassName="counsellor-modal-wide"
        backdrop="static"
        style={{ zIndex: 9999 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Counsellor</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="profile-card-style">
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture <span className="text-danger">*</span></Form.Label>
              <div className="profile-upload-section">
                <div 
                  className={`profile-image-box ${errors.profilePicture ? 'error' : ''}`}
                  onClick={() => document.getElementById('profilePictureInput').click()}
                >
                  {newCounsellor.profilePicture ? (
                    <>
                      <img
                        src={newCounsellor.profilePicture}
                        alt="Profile preview"
                        className="profile-selected-image"
                      />
                      <div className="profile-overlay">
                        <i className="bi bi-camera"></i>
                        <span>Change Photo</span>
                      </div>
                    </>
                  ) : (
                    <div className="profile-upload-placeholder">
                      <i className="bi bi-camera-fill"></i>
                      <span>Select Photo</span>
                    </div>
                  )}
                </div>
                <input
                  id="profilePictureInput"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const response = await uploadAPI.uploadAvatar(file);
                        handleInputChange('profilePicture', response.data.data.url);
                      } catch (error) {
                        console.error('Error uploading image:', error);
                        showAlert('Error uploading image', 'danger');
                      }
                    }
                  }}
                />
                {errors.profilePicture && (
                  <div className="text-danger small mt-2">{errors.profilePicture}</div>
                )}
                <Form.Text className="text-muted mt-2 d-block">
                  Click to upload a professional profile picture (JPG, PNG)
                </Form.Text>
              </div>
            </Form.Group>

            <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={newCounsellor.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter full name"
                    isInvalid={!!errors.name}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="email"
                    value={newCounsellor.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter email address"
                    isInvalid={!!errors.email}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.email}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Password <span className="text-danger">*</span></Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      value={newCounsellor.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      placeholder="Create password (min 6 characters)"
                      isInvalid={!!errors.password}
                      required
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
                  <Form.Control.Feedback type="invalid">
                    {errors.password}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="tel"
                    value={newCounsellor.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter 10-digit phone number"
                    isInvalid={!!errors.phone}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phone}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Counsellor Type <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={newCounsellor.counsellorType}
                    onChange={(e) => handleInputChange('counsellorType', e.target.value)}
                    required
                  >
                    <option value="counsellor">Counsellor</option>
                    <option value="psychiatrist">Psychiatrist</option>
                    <option value="psychologist">Psychologist</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                  <Form.Select
                    value={newCounsellor.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    isInvalid={!!errors.gender}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.gender}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="date"
                    value={newCounsellor.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    isInvalid={!!errors.dateOfBirth}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.dateOfBirth}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Specializations <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={typeof newCounsellor.specializations === 'string' ? newCounsellor.specializations : newCounsellor.specializations.join(', ')}
                    onChange={(e) => handleInputChange('specializations', e.target.value)}
                    placeholder="e.g., Anxiety, Depression, Couples Therapy"
                    isInvalid={!!errors.specializations}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.specializations}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Experience (Years) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={newCounsellor.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="Years of experience"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Languages</Form.Label>
                  <Form.Control
                    type="text"
                    value={typeof newCounsellor.languages === 'string' ? newCounsellor.languages : newCounsellor.languages.join(', ')}
                    onChange={(e) => handleInputChange('languages', e.target.value)}
                    placeholder="e.g., English, Hindi, Tamil"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <h6 className="mb-3 text-primary">Qualification Details</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Degree <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={newCounsellor.qualifications[0].degree}
                    onChange={(e) => {
                      const updatedQualifications = [...newCounsellor.qualifications];
                      updatedQualifications[0].degree = e.target.value;
                      handleInputChange('qualifications', updatedQualifications);
                    }}
                    placeholder="e.g., Ph.D. in Psychology"
                    isInvalid={!!errors.degree}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.degree}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Institution <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    value={newCounsellor.qualifications[0].institution}
                    onChange={(e) => {
                      const updatedQualifications = [...newCounsellor.qualifications];
                      updatedQualifications[0].institution = e.target.value;
                      handleInputChange('qualifications', updatedQualifications);
                    }}
                    placeholder="University/Institution name"
                    isInvalid={!!errors.institution}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.institution}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Graduation Year <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    min="1950"
                    max={new Date().getFullYear()}
                    value={newCounsellor.qualifications[0].year}
                    onChange={(e) => {
                      const updatedQualifications = [...newCounsellor.qualifications];
                      updatedQualifications[0].year = e.target.value;
                      handleInputChange('qualifications', updatedQualifications);
                    }}
                    placeholder="Year of graduation"
                    isInvalid={!!errors.graduationYear}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.graduationYear}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Bio <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newCounsellor.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Brief professional bio"
                isInvalid={!!errors.bio}
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.bio}
              </Form.Control.Feedback>
            </Form.Group>
            
            <h6 className="mb-3 text-primary">Session Fees</h6>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Video Session Fee (₹) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={newCounsellor.videoFee}
                    onChange={(e) => handleInputChange('videoFee', e.target.value)}
                    placeholder="Fee for video sessions"
                    isInvalid={!!errors.videoFee}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.videoFee}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Chat Session Fee (₹) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    value={newCounsellor.chatFee}
                    onChange={(e) => handleInputChange('chatFee', e.target.value)}
                    placeholder="Fee for chat sessions"
                    isInvalid={!!errors.chatFee}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.chatFee}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddCounsellor}>
            Add Counsellor
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Counsellor Profile Modal */}
      <Modal show={showProfileModal} onHide={() => setShowProfileModal(false)} size="lg" centered style={{ zIndex: 10000 }}>
        <Modal.Header closeButton>
          <Modal.Title>Counsellor Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCounsellor && (
            <div className="counsellor-profile">
              <div className="text-center mb-4">
                <img
                  src={selectedCounsellor.user?.avatar || '/default-avatar.png'}
                  alt={selectedCounsellor.user?.name || selectedCounsellor.name}
                  className="rounded-circle"
                  style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                />
                <h4 className="mt-3">{selectedCounsellor.user?.name || selectedCounsellor.name}</h4>
                <p className="text-muted">{selectedCounsellor.user?.email}</p>
              </div>
              
              <Row>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Phone:</strong>
                    <p>{selectedCounsellor.phone || 'Not provided'}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Gender:</strong>
                    <p>{selectedCounsellor.gender || 'Not specified'}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Experience:</strong>
                    <p>{selectedCounsellor.experience} years</p>
                  </div>
                  <div className="mb-3">
                    <strong>License Number:</strong>
                    <p>{selectedCounsellor.licenseNumber || 'Not provided'}</p>
                  </div>
                </Col>
                <Col md={6}>
                  <div className="mb-3">
                    <strong>Specializations:</strong>
                    <p>{Array.isArray(selectedCounsellor.specializations) ? selectedCounsellor.specializations.join(', ') : selectedCounsellor.specializations || 'Not specified'}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Languages:</strong>
                    <p>{Array.isArray(selectedCounsellor.languages) ? selectedCounsellor.languages.join(', ') : selectedCounsellor.languages || 'Not specified'}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Consultation Fee:</strong>
                    <p>₹{selectedCounsellor.consultationFee || selectedCounsellor.fees?.video || 'Not set'}</p>
                  </div>
                  <div className="mb-3">
                    <strong>Status:</strong>
                    <div>
                      <Badge bg={selectedCounsellor.isVerified ? 'success' : 'warning'} className="me-2">
                        {selectedCounsellor.isVerified ? 'Verified' : 'Pending'}
                      </Badge>
                      <Badge bg={selectedCounsellor.active ? 'primary' : 'danger'}>
                        {selectedCounsellor.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </Col>
              </Row>
              
              {selectedCounsellor.bio && (
                <div className="mb-3">
                  <strong>Bio:</strong>
                  <p>{selectedCounsellor.bio}</p>
                </div>
              )}
              
              {selectedCounsellor.qualifications && (
                <div className="mb-3">
                  <strong>Qualifications:</strong>
                  <div>
                    {Array.isArray(selectedCounsellor.qualifications) 
                      ? selectedCounsellor.qualifications.map((qual, index) => (
                          <p key={index}>
                            {typeof qual === 'object' 
                              ? `${qual.degree} from ${qual.institution} (${qual.year})`
                              : qual
                            }
                          </p>
                        ))
                      : <p>{selectedCounsellor.qualifications}</p>
                    }
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfileModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* Edit Counsellor Modal */}
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)} 
        size="xl" 
        centered 
        dialogClassName="counsellor-modal-wide"
        backdrop="static"
        style={{ zIndex: 9999 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Counsellor</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <div className="profile-card-style">
            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <div className="profile-upload-section">
                <div 
                  className="profile-image-box"
                  onClick={() => document.getElementById('editProfilePictureInput').click()}
                >
                  {editCounsellor.profilePicture ? (
                    <>
                      <img
                        src={editCounsellor.profilePicture}
                        alt="Profile preview"
                        className="profile-selected-image"
                      />
                      <div className="profile-overlay">
                        <i className="bi bi-camera"></i>
                        <span>Change Photo</span>
                      </div>
                    </>
                  ) : (
                    <div className="profile-upload-placeholder">
                      <i className="bi bi-camera-fill"></i>
                      <span>Select Photo</span>
                    </div>
                  )}
                </div>
                <input
                  id="editProfilePictureInput"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                      try {
                        const response = await uploadAPI.uploadAvatar(file);
                        setEditCounsellor({...editCounsellor, profilePicture: response.data.data.url});
                      } catch (error) {
                        console.error('Error uploading image:', error);
                        showAlert('Error uploading image', 'danger');
                      }
                    }
                  }}
                />
              </div>
            </Form.Group>

            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Full Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCounsellor.name || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, name: e.target.value})}
                      placeholder="Enter full name"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={editCounsellor.email || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, email: e.target.value})}
                      placeholder="Enter email address"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      value={editCounsellor.phone || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, phone: e.target.value})}
                      placeholder="Enter phone number"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Gender</Form.Label>
                    <Form.Select
                      value={editCounsellor.gender || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, gender: e.target.value})}
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Date of Birth</Form.Label>
                    <Form.Control
                      type="date"
                      value={editCounsellor.dateOfBirth || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, dateOfBirth: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Experience (Years)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={editCounsellor.experience || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, experience: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Specializations</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCounsellor.specializations || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, specializations: e.target.value})}
                      placeholder="e.g., Anxiety, Depression, Couples Therapy"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Languages</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCounsellor.languages || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, languages: e.target.value})}
                      placeholder="e.g., English, Hindi, Tamil"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <h6 className="mb-3 text-primary">Qualification Details</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Degree</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCounsellor.qualifications?.[0]?.degree || ''}
                      onChange={(e) => {
                        const updatedQualifications = [...(editCounsellor.qualifications || [{ degree: '', institution: '', year: '', certificate: '' }])];
                        updatedQualifications[0] = { ...updatedQualifications[0], degree: e.target.value };
                        setEditCounsellor({...editCounsellor, qualifications: updatedQualifications});
                      }}
                      placeholder="e.g., Ph.D. in Psychology"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Institution</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCounsellor.qualifications?.[0]?.institution || ''}
                      onChange={(e) => {
                        const updatedQualifications = [...(editCounsellor.qualifications || [{ degree: '', institution: '', year: '', certificate: '' }])];
                        updatedQualifications[0] = { ...updatedQualifications[0], institution: e.target.value };
                        setEditCounsellor({...editCounsellor, qualifications: updatedQualifications});
                      }}
                      placeholder="University/Institution name"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Graduation Year</Form.Label>
                    <Form.Control
                      type="number"
                      min="1950"
                      max={new Date().getFullYear()}
                      value={editCounsellor.qualifications?.[0]?.year || ''}
                      onChange={(e) => {
                        const updatedQualifications = [...(editCounsellor.qualifications || [{ degree: '', institution: '', year: '', certificate: '' }])];
                        updatedQualifications[0] = { ...updatedQualifications[0], year: e.target.value };
                        setEditCounsellor({...editCounsellor, qualifications: updatedQualifications});
                      }}
                      placeholder="Year of graduation"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Form.Group className="mb-3">
                <Form.Label>Bio</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={editCounsellor.bio || ''}
                  onChange={(e) => setEditCounsellor({...editCounsellor, bio: e.target.value})}
                  placeholder="Brief professional bio"
                />
              </Form.Group>
              
              <h6 className="mb-3 text-primary">Session Fees</h6>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Video Session Fee (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={editCounsellor.videoFee || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, videoFee: e.target.value})}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Chat Session Fee (₹)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      value={editCounsellor.chatFee || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, chatFee: e.target.value})}
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <h6 className="mb-3 text-primary">Address Details</h6>
              <Row>
                <Col md={12}>
                  <Form.Group className="mb-3">
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCounsellor.address || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, address: e.target.value})}
                      placeholder="Enter address"
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>City</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCounsellor.city || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, city: e.target.value})}
                      placeholder="Enter city"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>State</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCounsellor.state || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, state: e.target.value})}
                      placeholder="Enter state"
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pincode</Form.Label>
                    <Form.Control
                      type="text"
                      value={editCounsellor.pincode || ''}
                      onChange={(e) => setEditCounsellor({...editCounsellor, pincode: e.target.value})}
                      placeholder="Enter pincode"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateCounsellor}>
            Update Counsellor
          </Button>
        </Modal.Footer>
      </Modal>


    </div>
  );
};

export default Counsellors;