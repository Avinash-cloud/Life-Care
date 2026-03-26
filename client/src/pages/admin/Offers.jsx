import { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Modal, Alert, Row, Col } from 'react-bootstrap';
import { adminAPI, uploadAPI } from '../../services/api';
import SEOHead from '../../components/shared/SEOHead';
import '../client/Dashboard.css';
import './AdminStyles.css';

const Offers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState('create');
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getOffers();
      setOffers(response.data.data);
    } catch (error) {
      console.error('Error fetching offers:', error);
      showAlert('Error fetching offers', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleCreate = () => {
    setModalAction('create');
    setSelectedOffer({
      title: '',
      description: '',
      offerCode: '',
      discountPercentage: 0,
      imageUrl: '',
      validUntil: '',
      isActive: true
    });
    setShowModal(true);
  };

  const handleEdit = (offer) => {
    setModalAction('edit');
    setSelectedOffer({
      ...offer,
      validUntil: offer.validUntil ? new Date(offer.validUntil).toISOString().split('T')[0] : ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) return;
    
    try {
      await adminAPI.deleteOffer(id);
      setOffers(offers.filter(offer => offer._id !== id));
      showAlert('Offer deleted successfully');
    } catch (error) {
      console.error('Error deleting offer:', error);
      showAlert('Error deleting offer', 'danger');
    }
  };

  const handleSave = async () => {
    try {
      if (!selectedOffer.title || !selectedOffer.description) {
        showAlert('Please provide title and description', 'danger');
        return;
      }
      
      const offerData = { ...selectedOffer };
      if (!offerData.validUntil) delete offerData.validUntil;

      if (modalAction === 'create') {
        const response = await adminAPI.createOffer(offerData);
        setOffers([response.data.data, ...offers]);
        showAlert('Offer created successfully');
      } else {
        const response = await adminAPI.updateOffer(selectedOffer._id, offerData);
        setOffers(offers.map(offer => offer._id === selectedOffer._id ? response.data.data : offer));
        showAlert('Offer updated successfully');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving offer:', error);
      showAlert('Error saving offer', 'danger');
    }
  };

  const handleToggleActive = async (id, isActive) => {
    try {
      await adminAPI.updateOffer(id, { isActive });
      setOffers(offers.map(offer => 
        offer._id === id ? { ...offer, isActive } : offer
      ));
    } catch (error) {
      console.error('Error updating offer status:', error);
      showAlert('Error updating offer status', 'danger');
    }
  };

  const handleInputChange = (field, value) => {
    setSelectedOffer({ ...selectedOffer, [field]: value });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No Expiry';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <SEOHead 
        title="Offers Management"
        description="Manage schemes and special offers"
      />
      
      <div className="d-flex align-items-center mb-4 gap-3">
        <div className="stat-icon">
          <i className="bi bi-tags"></i>
        </div>
        <h2 className="text-gradient mb-0 me-auto">Offers & Schemes</h2>
        <Button variant="primary" onClick={handleCreate}>
          <i className="bi bi-plus-circle me-2"></i>Create Offer
        </Button>
      </div>
      
      <Card className="dashboard-card">
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
            </div>
          ) : offers.length > 0 ? (
            <div className="table-container">
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Code</th>
                    <th>Title</th>
                    <th>Discount</th>
                    <th>Valid Until</th>
                    <th>Used</th>
                    <th>Status</th>
                    <th>Active</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {offers.map((offer) => (
                    <tr key={offer._id}>
                      <td>
                        {offer.imageUrl ? (
                          <img src={offer.imageUrl} alt={offer.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                        ) : (
                          <div style={{ width: '50px', height: '50px', backgroundColor: '#e9ecef', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <i className="bi bi-image text-muted"></i>
                          </div>
                        )}
                      </td>
                      <td>
                        {offer.offerCode ? <Badge bg="info">{offer.offerCode}</Badge> : '-'}
                      </td>
                      <td>{offer.title}</td>
                      <td>{offer.discountPercentage ? `${offer.discountPercentage}%` : '-'}</td>
                      <td>{formatDate(offer.validUntil)}</td>
                      <td>{offer.usageCount || 0}</td>
                      <td>
                        <Badge bg={offer.isActive ? 'success' : 'secondary'}>
                          {offer.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td>
                        <Form.Check
                          type="switch"
                          checked={offer.isActive}
                          onChange={() => handleToggleActive(offer._id, !offer.isActive)}
                        />
                      </td>
                      <td>
                        <div className="d-flex gap-1">
                          <Button 
                            variant="outline-primary" 
                            size="sm"
                            onClick={() => handleEdit(offer)}
                          >
                            <i className="bi bi-pencil"></i>
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDelete(offer._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="mb-0">No offers found. Create one to get started!</p>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* Offer Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction === 'create' ? 'Create Offer' : 'Edit Offer'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOffer && (
            <Form>
              <Row>
                <Col md={8}>
                  <Form.Group className="mb-3">
                    <Form.Label>Offer Title <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedOffer.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="e.g. 20% Off Student Counseling"
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Description <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={selectedOffer.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Details about the offer..."
                      required
                    />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Promo Code (Optional)</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedOffer.offerCode || ''}
                      onChange={(e) => handleInputChange('offerCode', e.target.value.toUpperCase())}
                      placeholder="e.g. SUMMER20"
                    />
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Discount %</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          max="100"
                          value={selectedOffer.discountPercentage || ''}
                          onChange={(e) => handleInputChange('discountPercentage', parseInt(e.target.value, 10))}
                          placeholder="0-100"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Valid Until</Form.Label>
                        <Form.Control
                          type="date"
                          value={selectedOffer.validUntil || ''}
                          onChange={(e) => handleInputChange('validUntil', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="offer-active-switch"
                      label="Is Active"
                      checked={selectedOffer.isActive}
                      onChange={(e) => handleInputChange('isActive', e.target.checked)}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Offer Image</Form.Label>
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const response = await uploadAPI.uploadFeaturedImage(file);
                            handleInputChange('imageUrl', response.data.data.url);
                          } catch (error) {
                            console.error('Image upload failed:', error);
                            alert('Image upload failed. It might be too large format unsupported.');
                          }
                        }
                      }}
                    />
                    <Form.Text className="text-muted">
                      We recommend uploading a 16:9 banner image.
                    </Form.Text>
                    {selectedOffer.imageUrl && (
                      <div className="mt-3">
                        <img 
                          src={selectedOffer.imageUrl} 
                          alt="Preview" 
                          style={{ width: '100%', height: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}
                        />
                      </div>
                    )}
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {modalAction === 'create' ? 'Create Offer' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Offers;
