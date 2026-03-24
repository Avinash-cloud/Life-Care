import { useState } from 'react';
import { Modal, Form, Button, Alert, Row, Col, Badge } from 'react-bootstrap';
import { counsellorAPI } from '../../services/api';

const AddPostSessionAttachment = ({ show, onHide, appointment, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    attachmentType: 'text',
    category: 'general',
    content: {
      text: '',
      fileUrl: '',
      fileName: '',
      fileSize: 0,
      mimeType: ''
    }
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('content.')) {
      const contentField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          [contentField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = formData.attachmentType === 'image' 
      ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      : ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

    if (!allowedTypes.includes(file.type)) {
      setError(`Invalid file type. Please select a valid ${formData.attachmentType} file.`);
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      return;
    }

    setUploadLoading(true);
    setError('');

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('type', formData.attachmentType);

      const response = await counsellorAPI.uploadFile(uploadFormData);
      
      setFormData(prev => ({
        ...prev,
        content: {
          ...prev.content,
          fileUrl: response.data.url,
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type
        }
      }));
    } catch (err) {
      setError(err.response?.data?.message || 'File upload failed');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.title.trim()) {
      setError('Title is required');
      return;
    }

    if (formData.attachmentType === 'text' && !formData.content.text.trim()) {
      setError('Text content is required');
      return;
    }

    if ((formData.attachmentType === 'image' || formData.attachmentType === 'document') && !formData.content.fileUrl) {
      setError('Please upload a file');
      return;
    }

    setLoading(true);

    try {
      await counsellorAPI.createPostSessionAttachment(appointment._id, formData);
      onSuccess();
      onHide();
      // Reset form
      setFormData({
        title: '',
        description: '',
        attachmentType: 'text',
        category: 'general',
        content: {
          text: '',
          fileUrl: '',
          fileName: '',
          fileSize: 0,
          mimeType: ''
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create attachment');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category) => {
    const icons = {
      prescription: 'bi-prescription2',
      medicine: 'bi-capsule',
      exercise: 'bi-activity',
      diet: 'bi-apple',
      followup: 'bi-calendar-check',
      general: 'bi-file-text'
    };
    return icons[category] || 'bi-file-text';
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-plus-circle"></i> Add Post-Session Material
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {appointment && (
          <div className="mb-3 p-3 bg-light rounded">
            <h6>Session Details</h6>
            <p className="mb-1">
              <strong>Client:</strong> {appointment.client?.name}
            </p>
            <p className="mb-1">
              <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
            </p>
            <p className="mb-0">
              <strong>Type:</strong> <Badge variant="secondary">{appointment.sessionType}</Badge>
            </p>
          </div>
        )}

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Medication Prescription, Exercise Plan"
                  required
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Category</Form.Label>
                <Form.Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option value="general">General</option>
                  <option value="prescription">Prescription</option>
                  <option value="medicine">Medicine</option>
                  <option value="exercise">Exercise</option>
                  <option value="diet">Diet</option>
                  <option value="followup">Follow-up</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Brief description of the material"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Material Type</Form.Label>
            <Form.Select
              name="attachmentType"
              value={formData.attachmentType}
              onChange={handleChange}
            >
              <option value="text">Text Content</option>
              <option value="image">Image</option>
              <option value="document">Document</option>
            </Form.Select>
          </Form.Group>

          {formData.attachmentType === 'text' ? (
            <Form.Group className="mb-3">
              <Form.Label>Content *</Form.Label>
              <Form.Control
                as="textarea"
                rows={6}
                name="content.text"
                value={formData.content.text}
                onChange={handleChange}
                placeholder="Enter your text content here..."
                required
              />
              <Form.Text className="text-muted">
                You can include prescriptions, instructions, exercises, or any other text-based information.
              </Form.Text>
            </Form.Group>
          ) : (
            <Form.Group className="mb-3">
              <Form.Label>Upload File *</Form.Label>
              <Form.Control
                type="file"
                onChange={handleFileUpload}
                accept={formData.attachmentType === 'image' ? 'image/*' : '.pdf,.doc,.docx'}
                disabled={uploadLoading}
              />
              <Form.Text className="text-muted">
                {formData.attachmentType === 'image' 
                  ? 'Supported formats: JPEG, PNG, GIF, WebP (Max 5MB)'
                  : 'Supported formats: PDF, DOC, DOCX (Max 5MB)'
                }
              </Form.Text>
              
              {uploadLoading && (
                <div className="mt-2">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Uploading file...
                </div>
              )}
              
              {formData.content.fileName && (
                <div className="mt-2">
                  <Badge bg="success">
                    <i className="bi bi-check-circle"></i> {formData.content.fileName}
                  </Badge>
                </div>
              )}
            </Form.Group>
          )}

          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className={getCategoryIcon(formData.category)}></i>
              <span className="ms-2 text-muted">
                This will be shared with the client
              </span>
            </div>
            <div>
              <Button variant="secondary" onClick={onHide} className="me-2">
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={loading || uploadLoading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Creating...
                  </>
                ) : (
                  <>
                    <i className="bi bi-plus"></i> Add Material
                  </>
                )}
              </Button>
            </div>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddPostSessionAttachment;