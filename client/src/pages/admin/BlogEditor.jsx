import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { adminAPI, uploadAPI } from '../../services/api';
import LexicalEditor from '../../components/shared/LexicalEditor';
import ImageUpload from '../../components/shared/ImageUpload';
import SEOHead from '../../components/shared/SEOHead';
import slugify from 'slugify';

const BlogEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const [blog, setBlog] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    status: 'draft',
    isFeatured: false,
    tags: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (isEdit) {
      fetchBlog();
    }
  }, [id, isEdit]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBlog(id);
      setBlog(response.data.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
      showAlert('Error fetching blog', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleInputChange = (field, value) => {
    setBlog(prev => ({ ...prev, [field]: value }));
    
    // Auto-generate slug from title
    if (field === 'title' && value) {
      const autoSlug = slugify(value, { lower: true, strict: true });
      setBlog(prev => ({ ...prev, slug: autoSlug }));
    }
    
    // Auto-generate meta title and description
    if (field === 'title' && value && !blog.metaTitle) {
      setBlog(prev => ({ ...prev, metaTitle: value }));
    }
    if (field === 'excerpt' && value && !blog.metaDescription) {
      setBlog(prev => ({ ...prev, metaDescription: value }));
    }
  };

  const handleContentChange = (htmlContent, textContent, editorState) => {
    setBlog(prev => ({ ...prev, content: htmlContent }));
  };

  const handleImageUpload = (url) => {
    setBlog(prev => ({ ...prev, featuredImage: url }));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !blog.tags.includes(tagInput.trim())) {
      setBlog(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setBlog(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSave = async (status = blog.status) => {
    try {
      setSaving(true);
      const blogData = { ...blog, status };
      
      if (isEdit) {
        await adminAPI.updateBlog(id, blogData);
        showAlert('Blog updated successfully');
      } else {
        const response = await adminAPI.createBlog(blogData);
        showAlert('Blog created successfully');
        navigate(`/admin/content/blog/edit/${response.data.data._id}`);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      showAlert('Error saving blog', 'danger');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = () => handleSave('published');
  const handleSaveDraft = () => handleSave('draft');

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEOHead 
        title={isEdit ? `Edit Blog: ${blog.title}` : 'Create New Blog'}
        description="Create and edit blog posts with advanced SEO features"
      />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-gradient mb-0">
          {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
        </h2>
        <div>
          <Button 
            variant="outline-secondary" 
            className="me-2"
            onClick={() => navigate('/admin/content')}
          >
            Cancel
          </Button>
          <Button 
            variant="secondary" 
            className="me-2"
            onClick={handleSaveDraft}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Draft'}
          </Button>
          <Button 
            variant="primary"
            onClick={handlePublish}
            disabled={saving}
          >
            {saving ? 'Publishing...' : 'Publish'}
          </Button>
        </div>
      </div>

      {alert.show && (
        <Alert variant={alert.type} dismissible onClose={() => setAlert({ show: false, message: '', type: 'success' })}>
          {alert.message}
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="dashboard-card mb-4">
            <Card.Header>
              <h5 className="mb-0">Content</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Title *</Form.Label>
                <Form.Control
                  type="text"
                  value={blog.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter blog title"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Slug *</Form.Label>
                <Form.Control
                  type="text"
                  value={blog.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="blog-url-slug"
                  required
                />
                <Form.Text className="text-muted">
                  URL: /blog/{blog.slug}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Excerpt</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={blog.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief description of the blog post"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Content *</Form.Label>
                <LexicalEditor
                  initialContent={blog.content}
                  onChange={handleContentChange}
                  placeholder="Start writing your blog post..."
                />
              </Form.Group>
            </Card.Body>
          </Card>

          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">SEO Settings</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Meta Title</Form.Label>
                <Form.Control
                  type="text"
                  value={blog.metaTitle}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  placeholder="SEO title (60 characters max)"
                  maxLength={60}
                />
                <Form.Text className="text-muted">
                  {blog.metaTitle.length}/60 characters
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Meta Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={blog.metaDescription}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  placeholder="SEO description (160 characters max)"
                  maxLength={160}
                />
                <Form.Text className="text-muted">
                  {blog.metaDescription.length}/160 characters
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Meta Keywords</Form.Label>
                <Form.Control
                  type="text"
                  value={blog.metaKeywords}
                  onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </Form.Group>


            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="dashboard-card mb-4">
            <Card.Header>
              <h5 className="mb-0">Publish Settings</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select
                  value={blog.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Check
                  type="checkbox"
                  label="Featured Post"
                  checked={blog.isFeatured}
                  onChange={(e) => handleInputChange('isFeatured', e.target.checked)}
                />
              </Form.Group>
            </Card.Body>
          </Card>

          <Card className="dashboard-card mb-4">
            <Card.Header>
              <h5 className="mb-0">Featured Image</h5>
            </Card.Header>
            <Card.Body>
              <ImageUpload
                type="featured"
                currentImage={blog.featuredImage}
                onImageUploaded={handleImageUpload}
                size="100%"
                accept="image/*"
              />
            </Card.Body>
          </Card>

          <Card className="dashboard-card">
            <Card.Header>
              <h5 className="mb-0">Tags</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                {blog.tags.map((tag, index) => (
                  <Badge 
                    key={index} 
                    bg="secondary" 
                    className="me-1 mb-1"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
              
              <div className="d-flex">
                <Form.Control
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="Add tag"
                  size="sm"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                />
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="ms-2"
                  onClick={handleAddTag}
                >
                  Add
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default BlogEditor;