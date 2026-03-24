import { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Button, Modal, Alert, Spinner } from 'react-bootstrap';
import { clientAPI } from '../../services/api';

const PostSessionAttachments = () => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAttachments();
  }, [page]);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      const response = await clientAPI.getPostSessionAttachments(page);
      setAttachments(response.data.data);
      setTotalPages(response.data.pages);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attachments');
    } finally {
      setLoading(false);
    }
  };

  const handleViewAttachment = async (attachmentId) => {
    try {
      const response = await clientAPI.getPostSessionAttachment(attachmentId);
      setSelectedAttachment(response.data.data);
      setShowModal(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch attachment details');
    }
  };

  const getCategoryColor = (category) => {
    const colors = {
      prescription: 'danger',
      medicine: 'warning',
      exercise: 'success',
      diet: 'info',
      followup: 'primary',
      general: 'secondary'
    };
    return colors[category] || 'secondary';
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && page === 1) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="post-session-attachments">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4>Post-Session Materials</h4>
        <Badge bg="info">{attachments.length} Items</Badge>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {attachments.length === 0 ? (
        <Card className="text-center py-5">
          <Card.Body>
            <i className="bi bi-file-earmark-text" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
            <h5 className="mt-3">No Materials Yet</h5>
            <p className="text-muted">
              Your mental health professionals will share prescriptions, exercises, and other materials here after your sessions.
            </p>
          </Card.Body>
        </Card>
      ) : (
        <>
          <Row>
            {attachments.map((attachment) => (
              <Col md={6} lg={4} key={attachment._id} className="mb-3">
                <Card className="h-100 attachment-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <Badge bg={getCategoryColor(attachment.category)} className="mb-2">
                        <i className={getCategoryIcon(attachment.category)}></i> {attachment.category}
                      </Badge>
                      <small className="text-muted">
                        {formatDate(attachment.createdAt)}
                      </small>
                    </div>
                    
                    <h6 className="card-title">{attachment.title}</h6>
                    
                    {attachment.description && (
                      <p className="card-text text-muted small">
                        {attachment.description.length > 100 
                          ? `${attachment.description.substring(0, 100)}...` 
                          : attachment.description
                        }
                      </p>
                    )}

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <small className="text-muted">
                          From: <strong>{attachment.counsellor.name}</strong>
                        </small>
                        <br />
                        <Badge variant="outline-secondary" className="mt-1">
                          {attachment.counsellor.counsellorType}
                        </Badge>
                      </div>
                      
                      <Button
                        variant="outline-primary"
                        size="sm"
                        onClick={() => handleViewAttachment(attachment._id)}
                      >
                        <i className="bi bi-eye"></i> View
                      </Button>
                    </div>

                    <div className="mt-2">
                      <Badge variant="light" className="me-1">
                        <i className="bi bi-calendar"></i> {formatDate(attachment.appointment.date)}
                      </Badge>
                      <Badge variant="light">
                        <i className="bi bi-camera-video"></i> {attachment.appointment.sessionType}
                      </Badge>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Button
                variant="outline-primary"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="me-2"
              >
                Previous
              </Button>
              <span className="align-self-center mx-3">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline-primary"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Attachment Detail Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedAttachment && (
              <>
                <i className={getCategoryIcon(selectedAttachment.category)}></i> {selectedAttachment.title}
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAttachment && (
            <div>
              <div className="mb-3">
                <Badge bg={getCategoryColor(selectedAttachment.category)} className="me-2">
                  {selectedAttachment.category}
                </Badge>
                <Badge variant="outline-secondary">
                  From: {selectedAttachment.counsellor.name} ({selectedAttachment.counsellor.counsellorType})
                </Badge>
              </div>

              {selectedAttachment.description && (
                <div className="mb-3">
                  <h6>Description:</h6>
                  <p>{selectedAttachment.description}</p>
                </div>
              )}

              <div className="mb-3">
                <h6>Content:</h6>
                {selectedAttachment.attachmentType === 'text' ? (
                  <div className="bg-light p-3 rounded">
                    <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
                      {selectedAttachment.content.text}
                    </pre>
                  </div>
                ) : selectedAttachment.attachmentType === 'image' ? (
                  <div className="text-center">
                    <img
                      src={`${import.meta.env.VITE_API_URL}${selectedAttachment.content.fileUrl}`}
                      alt={selectedAttachment.content.fileName}
                      className="img-fluid rounded"
                      style={{ maxHeight: '400px' }}
                    />
                    <p className="mt-2 text-muted">{selectedAttachment.content.fileName}</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <i className="bi bi-file-earmark" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                    <p className="mt-2">{selectedAttachment.content.fileName}</p>
                    <Button
                      variant="primary"
                      href={`${import.meta.env.VITE_API_URL}${selectedAttachment.content.fileUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-download"></i> Download
                    </Button>
                  </div>
                )}
              </div>

              <div className="text-muted small">
                <p>Session Date: {formatDate(selectedAttachment.appointment.date)}</p>
                <p>Added: {formatDate(selectedAttachment.createdAt)}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .attachment-card {
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }
        
        .attachment-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default PostSessionAttachments;