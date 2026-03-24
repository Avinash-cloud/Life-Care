import { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { counsellorAPI } from '../../services/api';
import './Content.css';
import '../client/Dashboard.css';

const Content = () => {
  const [activeTab, setActiveTab] = useState('blog');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  // Blog form state
  const [blogForm, setBlogForm] = useState({
    title: '',
    content: '',
    summary: '',
    featuredImage: '',
    categories: '',
    tags: '',
    status: 'draft'
  });
  
  // Video form state
  const [videoForm, setVideoForm] = useState({
    title: '',
    description: '',
    videoUrl: '',
    videoType: 'youtube',
    thumbnailUrl: '',
    categories: '',
    tags: '',
    status: 'draft'
  });

  const handleBlogChange = (e) => {
    const { name, value } = e.target;
    setBlogForm({
      ...blogForm,
      [name]: value
    });
  };

  const handleVideoChange = (e) => {
    const { name, value } = e.target;
    setVideoForm({
      ...videoForm,
      [name]: value
    });
  };

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      // Format categories and tags as arrays
      const formattedData = {
        ...blogForm,
        categories: blogForm.categories.split(',').map(item => item.trim()),
        tags: blogForm.tags.split(',').map(item => item.trim())
      };

      await counsellorAPI.createBlog(formattedData);
      setSuccess('Blog post created successfully! It will be reviewed by an admin before publishing.');
      
      // Reset form
      setBlogForm({
        title: '',
        content: '',
        summary: '',
        featuredImage: '',
        categories: '',
        tags: '',
        status: 'draft'
      });
    } catch (error) {
      console.error('Error creating blog post:', error);
      setError('Failed to create blog post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVideoSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    try {
      // Format categories and tags as arrays
      const formattedData = {
        ...videoForm,
        categories: videoForm.categories.split(',').map(item => item.trim()),
        tags: videoForm.tags.split(',').map(item => item.trim())
      };

      await counsellorAPI.uploadVideo(formattedData);
      setSuccess('Video uploaded successfully! It will be reviewed by an admin before publishing.');
      
      // Reset form
      setVideoForm({
        title: '',
        description: '',
        videoUrl: '',
        videoType: 'youtube',
        thumbnailUrl: '',
        categories: '',
        tags: '',
        status: 'draft'
      });
    } catch (error) {
      console.error('Error uploading video:', error);
      setError('Failed to upload video. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-page">
      <div className="content-header">
        <div className="d-flex align-items-center mb-2">
          <div className="stat-icon me-3">
            <i className="bi bi-pencil-square"></i>
          </div>
          <h1>Create Content</h1>
        </div>
        <p>Share your expertise by creating blog posts and videos</p>
      </div>
      
      <Card className="content-card">
        <Card.Body className="p-4">
          <div className={`content-tabs ${activeTab === 'video' ? 'video-active' : ''}`}>
            <button 
              className={`content-tab ${activeTab === 'blog' ? 'active' : ''}`}
              onClick={() => setActiveTab('blog')}
            >
              <i className="bi bi-file-earmark-text"></i>Blog Post
            </button>
            <button 
              className={`content-tab ${activeTab === 'video' ? 'active' : ''}`}
              onClick={() => setActiveTab('video')}
            >
              <i className="bi bi-camera-video"></i>Video
            </button>
          </div>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          
          {activeTab === 'blog' ? (
            <Form onSubmit={handleBlogSubmit}>
              <div className="form-section">
                <h5 className="form-section-title">
                  <i className="bi bi-info-circle text-primary"></i>
                  Basic Information
                </h5>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={blogForm.title}
                    onChange={handleBlogChange}
                    placeholder="Enter blog title"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Summary</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="summary"
                    value={blogForm.summary}
                    onChange={handleBlogChange}
                    placeholder="Enter a brief summary of your blog post"
                    required
                  />
                  <Form.Text className="text-muted">
                    Maximum 500 characters
                  </Form.Text>
                </Form.Group>
              </div>
              
              <div className="form-section">
                <h5 className="form-section-title">
                  <i className="bi bi-file-text text-primary"></i>
                  Content
                </h5>
                <Form.Group className="mb-3">
                  <Form.Label>Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={10}
                    name="content"
                    value={blogForm.content}
                    onChange={handleBlogChange}
                    placeholder="Write your blog content here"
                    required
                  />
                  <Form.Text className="text-muted">
                    You can use HTML tags for formatting
                  </Form.Text>
                </Form.Group>
              </div>
              
              <div className="form-section">
                <h5 className="form-section-title">
                  <i className="bi bi-tags text-primary"></i>
                  Metadata
                </h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Featured Image URL</Form.Label>
                      <Form.Control
                        type="text"
                        name="featuredImage"
                        value={blogForm.featuredImage}
                        onChange={handleBlogChange}
                        placeholder="Enter image URL"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={blogForm.status}
                        onChange={handleBlogChange}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Submit for Review</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Categories</Form.Label>
                      <Form.Control
                        type="text"
                        name="categories"
                        value={blogForm.categories}
                        onChange={handleBlogChange}
                        placeholder="E.g. Mental Health, Anxiety (comma separated)"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tags</Form.Label>
                      <Form.Control
                        type="text"
                        name="tags"
                        value={blogForm.tags}
                        onChange={handleBlogChange}
                        placeholder="E.g. stress, meditation (comma separated)"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              
              <div className="d-flex justify-content-end mt-4">
                <Button 
                  className="submit-button" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send"></i>
                      Submit Blog Post
                    </>
                  )}
                </Button>
              </div>
            </Form>
          ) : (
            <Form onSubmit={handleVideoSubmit}>
              <div className="form-section">
                <h5 className="form-section-title">
                  <i className="bi bi-info-circle text-primary"></i>
                  Basic Information
                </h5>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={videoForm.title}
                    onChange={handleVideoChange}
                    placeholder="Enter video title"
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="description"
                    value={videoForm.description}
                    onChange={handleVideoChange}
                    placeholder="Enter video description"
                    required
                  />
                  <Form.Text className="text-muted">
                    Maximum 1000 characters
                  </Form.Text>
                </Form.Group>
              </div>
              
              <div className="form-section">
                <h5 className="form-section-title">
                  <i className="bi bi-camera-video text-primary"></i>
                  Video Details
                </h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Video Type</Form.Label>
                      <Form.Select
                        name="videoType"
                        value={videoForm.videoType}
                        onChange={handleVideoChange}
                      >
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                        <option value="uploaded">Upload Video</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Video URL</Form.Label>
                      <Form.Control
                        type="text"
                        name="videoUrl"
                        value={videoForm.videoUrl}
                        onChange={handleVideoChange}
                        placeholder="Enter YouTube or Vimeo URL"
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Thumbnail URL</Form.Label>
                      <Form.Control
                        type="text"
                        name="thumbnailUrl"
                        value={videoForm.thumbnailUrl}
                        onChange={handleVideoChange}
                        placeholder="Enter thumbnail image URL"
                      />
                      <Form.Text className="text-muted">
                        Optional - will use video thumbnail if not provided
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={videoForm.status}
                        onChange={handleVideoChange}
                      >
                        <option value="draft">Draft</option>
                        <option value="published">Submit for Review</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              
              <div className="form-section">
                <h5 className="form-section-title">
                  <i className="bi bi-tags text-primary"></i>
                  Metadata
                </h5>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Categories</Form.Label>
                      <Form.Control
                        type="text"
                        name="categories"
                        value={videoForm.categories}
                        onChange={handleVideoChange}
                        placeholder="E.g. Mental Health, Anxiety (comma separated)"
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tags</Form.Label>
                      <Form.Control
                        type="text"
                        name="tags"
                        value={videoForm.tags}
                        onChange={handleVideoChange}
                        placeholder="E.g. stress, meditation (comma separated)"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </div>
              
              <div className="d-flex justify-content-end mt-4">
                <Button 
                  className="submit-button" 
                  type="submit" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-send"></i>
                      Submit Video
                    </>
                  )}
                </Button>
              </div>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default Content;