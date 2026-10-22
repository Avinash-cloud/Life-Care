import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Form, Row, Col, Button, Badge, Alert } from 'react-bootstrap';
import { adminAPI } from '../../services/api';
import LexicalEditor from '../../components/shared/LexicalEditor';
import ImageUpload from '../../components/shared/ImageUpload';
import SEOHead from '../../components/shared/SEOHead';
import slugify from 'slugify';

const PRESET_CATEGORIES = [
  'Mental Health',
  'Anxiety',
  'Depression',
  'Stress Management',
  'Mindfulness',
  'Relationships',
  'Self-Care',
  'Therapy',
  'Workplace Wellbeing'
];

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
    categories: [],
    tags: [],
    metaTitle: '',
    metaDescription: '',
    metaKeywords: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [tagInput, setTagInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');
  const [isSlugCustomized, setIsSlugCustomized] = useState(false);

  useEffect(() => {
    if (isEdit) {
      fetchBlog();
    }
  }, [id, isEdit]);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getBlog(id);
      const data = response.data?.data || {};
      
      // Cleanly sanitize all values to prevent crashes from undefined/null
      setBlog({
        title: data.title || '',
        slug: data.slug || '',
        excerpt: data.excerpt || '',
        content: data.content || '',
        featuredImage: data.featuredImage || '',
        status: data.status || 'draft',
        isFeatured: Boolean(data.isFeatured),
        categories: Array.isArray(data.categories) ? data.categories : [],
        tags: Array.isArray(data.tags) ? data.tags : [],
        metaTitle: data.metaTitle || '',
        metaDescription: data.metaDescription || '',
        metaKeywords: data.metaKeywords || ''
      });
      setIsSlugCustomized(Boolean(data.slug));
    } catch (error) {
      console.error('Error fetching blog:', error);
      showAlert(error.response?.data?.message || 'Error fetching blog', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3500);
  };

  const handleInputChange = (field, value) => {
    setBlog(prev => {
      const updated = { ...prev, [field]: value };
      
      // Auto-generate slug from title if user hasn't explicitly customized it
      if (field === 'title' && value && (!isSlugCustomized && !isEdit || !prev.slug)) {
        updated.slug = slugify(value, { lower: true, strict: true });
      }
      
      // Auto-populate SEO fields if empty
      if (field === 'title' && value && !prev.metaTitle) {
        updated.metaTitle = value.substring(0, 60);
      }
      if (field === 'excerpt' && value && !prev.metaDescription) {
        updated.metaDescription = value.substring(0, 160);
      }
      
      return updated;
    });

    if (field === 'slug') {
      setIsSlugCustomized(true);
    }
  };

  const handleContentChange = (htmlContent, textContent, editorState) => {
    setBlog(prev => ({ ...prev, content: htmlContent }));
  };

  const handleImageUpload = (url) => {
    setBlog(prev => ({ ...prev, featuredImage: url }));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed) {
      setBlog(prev => {
        const currentTags = prev.tags || [];
        if (!currentTags.includes(trimmed)) {
          return { ...prev, tags: [...currentTags, trimmed] };
        }
        return prev;
      });
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setBlog(prev => ({
      ...prev,
      tags: (prev.tags || []).filter(tag => tag !== tagToRemove)
    }));
  };

  const handleToggleCategory = (category) => {
    setBlog(prev => {
      const current = prev.categories || [];
      if (current.includes(category)) {
        return { ...prev, categories: current.filter(c => c !== category) };
      } else {
        return { ...prev, categories: [...current, category] };
      }
    });
  };

  const handleAddCustomCategory = () => {
    const trimmed = categoryInput.trim();
    if (trimmed) {
      setBlog(prev => {
        const current = prev.categories || [];
        if (!current.includes(trimmed)) {
          return { ...prev, categories: [...current, trimmed] };
        }
        return prev;
      });
      setCategoryInput('');
    }
  };

  const handleSave = async (status = blog.status) => {
    // Client-side validations
    if (!blog.title || !blog.title.trim()) {
      showAlert('Please enter a blog title', 'danger');
      return;
    }
    if (!blog.content || !blog.content.trim()) {
      showAlert('Please write some content before saving', 'danger');
      return;
    }

    try {
      setSaving(true);
      const blogData = {
        ...blog,
        title: blog.title.trim(),
        slug: blog.slug ? blog.slug.trim() : slugify(blog.title, { lower: true, strict: true }),
        status
      };
      
      if (isEdit) {
        await adminAPI.updateBlog(id, blogData);
        showAlert(`Blog ${status === 'published' ? 'published' : 'updated'} successfully`);
        // Refresh local state status
        setBlog(prev => ({ ...prev, status }));
      } else {
        const response = await adminAPI.createBlog(blogData);
        showAlert('Blog created successfully');
        navigate(`/admin/content/blog/edit/${response.data.data._id}`);
      }
    } catch (error) {
      console.error('Error saving blog:', error);
      showAlert(error.response?.data?.message || 'Error saving blog', 'danger');
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
      
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
        <div>
          <h2 className="text-gradient mb-1">
            {isEdit ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <small className="text-muted">
            Status: <Badge bg={blog.status === 'published' ? 'success' : 'secondary'}>{blog.status.toUpperCase()}</Badge>
          </small>
        </div>
        <div className="d-flex flex-wrap gap-2">
          <Button 
            variant="outline-secondary" 
            onClick={() => navigate('/admin/content')}
          >
            Cancel
          </Button>

          {(id || blog.slug) && (
            <Button
              variant="outline-primary"
              onClick={() => window.open(`/blog/${blog.slug || id}`, '_blank')}
              title="Preview how article looks on the site"
            >
              <i className="bi bi-box-arrow-up-right me-1"></i> Preview
            </Button>
          )}

          <Button 
            variant="secondary" 
            onClick={handleSaveDraft}
            disabled={saving}
          >
            {saving && blog.status === 'draft' ? 'Saving...' : 'Save Draft'}
          </Button>

          <Button 
            variant="primary"
            onClick={handlePublish}
            disabled={saving}
          >
            {saving && blog.status === 'published' ? 'Publishing...' : 'Publish'}
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
                <Form.Label className="fw-semibold">Title <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={blog.title || ''}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter blog title"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Slug (URL Path) <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={blog.slug || ''}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="blog-url-slug"
                  required
                />
                <Form.Text className="text-muted d-flex align-items-center gap-2 mt-1">
                  <span>URL: <code>/blog/{blog.slug || 'slug-placeholder'}</code></span>
                  {blog.slug && (
                    <a 
                      href={`/blog/${blog.slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-primary text-decoration-none small"
                    >
                      <i className="bi bi-box-arrow-up-right me-1"></i>Preview Link
                    </a>
                  )}
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Excerpt</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={blog.excerpt || ''}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief summary shown on blog list cards and search engines"
                  maxLength={500}
                />
                <Form.Text className="text-muted">
                  {(blog.excerpt || '').length}/500 characters
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Content <span className="text-danger">*</span></Form.Label>
                <LexicalEditor
                  key={id || 'new'}
                  initialContent={blog.content}
                  onChange={handleContentChange}
                  placeholder="Start writing your blog post..."
                />
              </Form.Group>
            </Card.Body>
          </Card>

          <Card className="dashboard-card mb-4">
            <Card.Header>
              <h5 className="mb-0">SEO Settings</h5>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Meta Title</Form.Label>
                <Form.Control
                  type="text"
                  value={blog.metaTitle || ''}
                  onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                  placeholder="SEO title (60 characters max)"
                  maxLength={60}
                />
                <Form.Text className="text-muted">
                  {(blog.metaTitle || '').length}/60 characters
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Meta Description</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={blog.metaDescription || ''}
                  onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                  placeholder="SEO description (160 characters max)"
                  maxLength={160}
                />
                <Form.Text className="text-muted">
                  {(blog.metaDescription || '').length}/160 characters
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Meta Keywords</Form.Label>
                <Form.Control
                  type="text"
                  value={blog.metaKeywords || ''}
                  onChange={(e) => handleInputChange('metaKeywords', e.target.value)}
                  placeholder="anxiety, therapy, mental health, counseling"
                />
                <Form.Text className="text-muted">
                  Comma-separated keywords for search engines
                </Form.Text>
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
                <Form.Label className="fw-semibold">Status</Form.Label>
                <Form.Select
                  value={blog.status || 'draft'}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-0">
                <Form.Check
                  type="checkbox"
                  label="Featured Post (Show on Home & Top of Blog)"
                  checked={Boolean(blog.isFeatured)}
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

          {/* Categories Section */}
          <Card className="dashboard-card mb-4">
            <Card.Header>
              <h5 className="mb-0">Categories</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                {(blog.categories || []).length > 0 ? (
                  (blog.categories || []).map((cat, index) => (
                    <Badge 
                      key={index} 
                      bg="primary" 
                      className="me-1 mb-1 p-2"
                      style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                      title="Click to remove"
                      onClick={() => handleToggleCategory(cat)}
                    >
                      {cat} ×
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted small">No categories selected</span>
                )}
              </div>

              <Form.Label className="small fw-semibold text-muted mb-1">Preset Categories:</Form.Label>
              <div className="d-flex flex-wrap gap-1 mb-3">
                {PRESET_CATEGORIES.map((preset) => {
                  const isSelected = (blog.categories || []).includes(preset);
                  return (
                    <Button
                      key={preset}
                      variant={isSelected ? 'primary' : 'outline-secondary'}
                      size="sm"
                      className="py-0 px-2"
                      style={{ fontSize: '0.78rem' }}
                      onClick={() => handleToggleCategory(preset)}
                      type="button"
                    >
                      {isSelected ? '✓ ' : '+ '}{preset}
                    </Button>
                  );
                })}
              </div>

              <div className="d-flex">
                <Form.Control
                  type="text"
                  value={categoryInput}
                  onChange={(e) => setCategoryInput(e.target.value)}
                  placeholder="Custom category"
                  size="sm"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCustomCategory())}
                />
                <Button 
                  variant="outline-primary" 
                  size="sm" 
                  className="ms-2"
                  onClick={handleAddCustomCategory}
                  type="button"
                >
                  Add
                </Button>
              </div>
            </Card.Body>
          </Card>

          {/* Tags Section */}
          <Card className="dashboard-card mb-4">
            <Card.Header>
              <h5 className="mb-0">Tags</h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                {(blog.tags || []).length > 0 ? (
                  (blog.tags || []).map((tag, index) => (
                    <Badge 
                      key={index} 
                      bg="secondary" 
                      className="me-1 mb-1 p-2"
                      style={{ cursor: 'pointer', fontSize: '0.85rem' }}
                      title="Click to remove"
                      onClick={() => handleRemoveTag(tag)}
                    >
                      #{tag} ×
                    </Badge>
                  ))
                ) : (
                  <span className="text-muted small">No tags added</span>
                )}
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
                  type="button"
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