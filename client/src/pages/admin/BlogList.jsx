import { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import SEOHead from '../../components/shared/SEOHead';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    status: '',
    search: '',
    isFeatured: ''
  });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter.status) params.status = filter.status;
      if (filter.search) params.search = filter.search;
      if (filter.isFeatured) params.isFeatured = filter.isFeatured === 'true';
      
      const response = await adminAPI.getBlogs(params);
      setBlogs(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showAlert('Error fetching blogs', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchBlogs();
  };

  const handleDeleteBlog = async () => {
    try {
      await adminAPI.deleteBlog(blogToDelete._id);
      showAlert('Blog deleted successfully');
      setShowDeleteModal(false);
      setBlogToDelete(null);
      fetchBlogs();
    } catch (error) {
      console.error('Error deleting blog:', error);
      showAlert('Error deleting blog', 'danger');
    }
  };

  const handleStatusChange = async (blogId, newStatus) => {
    try {
      await adminAPI.updateBlog(blogId, { status: newStatus });
      showAlert(`Blog ${newStatus} successfully`);
      fetchBlogs();
    } catch (error) {
      console.error('Error updating blog status:', error);
      showAlert('Error updating blog status', 'danger');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'secondary';
      case 'archived': return 'warning';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <SEOHead 
        title="Blog Management"
        description="Manage blog posts, create new content, and optimize SEO"
      />
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-gradient mb-0">Blog Management</h2>
        <Link to="/admin/blogs/new">
          <Button variant="primary">
            <i className="bi bi-plus-circle me-2"></i>New Blog Post
          </Button>
        </Link>
      </div>
      
      <Card className="dashboard-card mb-4">
        <Card.Header>
          <h5 className="mb-0">Filter Blogs</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleFilterSubmit}>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    name="status" 
                    value={filter.status} 
                    onChange={handleFilterChange}
                    size="sm"
                  >
                    <option value="">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Featured</Form.Label>
                  <Form.Select 
                    name="isFeatured" 
                    value={filter.isFeatured} 
                    onChange={handleFilterChange}
                    size="sm"
                  >
                    <option value="">All Posts</option>
                    <option value="true">Featured</option>
                    <option value="false">Not Featured</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Search</Form.Label>
                  <Form.Control
                    type="text"
                    name="search"
                    value={filter.search}
                    onChange={handleFilterChange}
                    placeholder="Search by title or content"
                    size="sm"
                  />
                </Form.Group>
              </Col>
              <Col md={2}>
                <Form.Group className="mb-3">
                  <Form.Label>&nbsp;</Form.Label>
                  <Button type="submit" variant="primary" size="sm" className="w-100">
                    Apply
                  </Button>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
      
      <Card className="dashboard-card">
        <Card.Header>
          <h5 className="mb-0">Blog Posts ({pagination.total} total)</h5>
        </Card.Header>
        <Card.Body>
          {alert.show && (
            <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
              {alert.message}
              <button type="button" className="btn-close" onClick={() => setAlert({ show: false, message: '', type: 'success' })}></button>
            </div>
          )}
          
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : blogs.length > 0 ? (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Author</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {blogs.map((blog) => (
                  <tr key={blog._id}>
                    <td>
                      <div>
                        <strong>{blog.title}</strong>
                        {blog.excerpt && (
                          <div className="text-muted small">{blog.excerpt.substring(0, 100)}...</div>
                        )}
                      </div>
                    </td>
                    <td>
                      <Badge bg={getStatusBadge(blog.status)}>
                        {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                      </Badge>
                    </td>
                    <td>
                      {blog.isFeatured && <Badge bg="warning">Featured</Badge>}
                    </td>
                    <td>{blog.author?.name || 'Unknown'}</td>
                    <td>{new Date(blog.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Link to={`/admin/blogs/edit/${blog._id}`}>
                        <Button variant="outline-primary" size="sm" className="me-1">
                          <i className="bi bi-pencil"></i>
                        </Button>
                      </Link>
                      
                      {blog.status === 'draft' && (
                        <Button 
                          variant="outline-success" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleStatusChange(blog._id, 'published')}
                        >
                          <i className="bi bi-check-circle"></i>
                        </Button>
                      )}
                      
                      {blog.status === 'published' && (
                        <Button 
                          variant="outline-warning" 
                          size="sm" 
                          className="me-1"
                          onClick={() => handleStatusChange(blog._id, 'draft')}
                        >
                          <i className="bi bi-archive"></i>
                        </Button>
                      )}
                      
                      <Button 
                        variant="outline-danger" 
                        size="sm"
                        onClick={() => {
                          setBlogToDelete(blog);
                          setShowDeleteModal(true);
                        }}
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <div className="text-center py-5">
              <p className="mb-0">No blog posts found</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered style={{ zIndex: 1060 }}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the blog post "{blogToDelete?.title}"? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteBlog}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BlogList;