import { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col, Modal, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { adminAPI, uploadAPI } from '../../services/api';
import ImageUpload from '../../components/shared/ImageUpload';
import SEOHead from '../../components/shared/SEOHead';
import '../client/Dashboard.css';
import './AdminStyles.css';

const Content = () => {
  const [blogs, setBlogs] = useState([]);
  const [videos, setVideos] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('blogs');
  const [filter, setFilter] = useState({
    status: '',
    isFeatured: '',
    search: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('blog'); // blog, video, gallery
  const [modalAction, setModalAction] = useState('create'); // create, edit
  const [selectedItem, setSelectedItem] = useState(null);
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });


  useEffect(() => {
    if (activeTab === 'blogs') {
      fetchBlogs();
    } else if (activeTab === 'videos') {
      fetchVideos();
    } else if (activeTab === 'gallery') {
      fetchGallery();
    }
  }, [activeTab]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter.status) params.status = filter.status;
      if (filter.isFeatured) params.isFeatured = filter.isFeatured === 'true';
      if (filter.search) params.search = filter.search;
      
      const response = await adminAPI.getBlogs(params);
      setBlogs(response.data.data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      showAlert('Error fetching blogs', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter.status) params.status = filter.status;
      if (filter.isFeatured) params.isFeatured = filter.isFeatured === 'true';
      if (filter.search) params.search = filter.search;
      
      const response = await adminAPI.getVideos(params);
      setVideos(response.data.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
      showAlert('Error fetching videos', 'danger');
    } finally {
      setLoading(false);
    }
  };

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter.search) params.search = filter.search;
      
      const response = await adminAPI.getGallery(params);
      setGallery(response.data.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      showAlert('Error fetching gallery', 'danger');
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
    if (activeTab === 'blogs') {
      fetchBlogs();
    } else if (activeTab === 'videos') {
      fetchVideos();
    } else if (activeTab === 'gallery') {
      fetchGallery();
    }
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleCreate = (type) => {
    if (type === 'blog') return; // Blogs use advanced editor
    setModalType(type);
    setModalAction('create');
    setSelectedItem(getEmptyItem(type));
    setShowModal(true);
  };

  const handleEdit = (item, type) => {
    if (type === 'blog') return; // Blogs use advanced editor
    setModalType(type);
    setModalAction('edit');
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      if (type === 'blog') {
        await adminAPI.deleteBlog(id);
        setBlogs(blogs.filter(blog => blog._id !== id));
      } else if (type === 'video') {
        await adminAPI.deleteVideo(id);
        setVideos(videos.filter(video => video._id !== id));
      } else if (type === 'gallery') {
        await adminAPI.deleteGalleryImage(id);
        setGallery(gallery.filter(image => image._id !== id));
      }
      showAlert('Item deleted successfully');
    } catch (error) {
      console.error('Error deleting item:', error);
      showAlert('Error deleting item', 'danger');
    }
  };

  const getEmptyItem = (type) => {
    switch (type) {
      case 'blog':
        return {
          title: '',
          content: '',
          excerpt: '',
          featuredImage: '',
          categories: [],
          tags: [],
          status: 'draft',
          isFeatured: false
        };
      case 'video':
        return {
          title: '',
          videoUrl: ''
        };
      case 'gallery':
        return {
          title: '',
          imageUrl: '',
          altText: ''
        };
      default:
        return {};
    }
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (modalType === 'video' && (!selectedItem.title || !selectedItem.videoUrl)) {
        showAlert('Please provide title and upload a video', 'danger');
        return;
      }
      if (modalType === 'gallery' && (!selectedItem.title || !selectedItem.imageUrl || !selectedItem.altText)) {
        showAlert('Please provide title, image, and alt text', 'danger');
        return;
      }
      
      if (modalAction === 'create') {
        if (modalType === 'blog') {
          const response = await adminAPI.createBlog(selectedItem);
          setBlogs([response.data.data, ...blogs]);
        } else if (modalType === 'video') {
          const videoData = { ...selectedItem, status: 'published' };
          const response = await adminAPI.createVideo(videoData);
          setVideos([response.data.data, ...videos]);
        } else if (modalType === 'gallery') {
          const response = await adminAPI.uploadGalleryImage(selectedItem);
          setGallery([response.data.data, ...gallery]);
        }
        showAlert('Item created successfully');
      } else {
        if (modalType === 'blog') {
          const response = await adminAPI.updateBlog(selectedItem._id, selectedItem);
          setBlogs(blogs.map(blog => blog._id === selectedItem._id ? response.data.data : blog));
        } else if (modalType === 'video') {
          const response = await adminAPI.updateVideo(selectedItem._id, selectedItem);
          setVideos(videos.map(video => video._id === selectedItem._id ? response.data.data : video));
        }
        showAlert('Item updated successfully');
      }
      setShowModal(false);
    } catch (error) {
      console.error('Error saving item:', error);
      showAlert('Error saving item', 'danger');
    }
  };

  const handleInputChange = (field, value) => {
    setSelectedItem({ ...selectedItem, [field]: value });
  };

  const handleUpdateBlogStatus = async (id, status) => {
    try {
      await adminAPI.updateBlog(id, { status });
      
      // Update blog in the list
      setBlogs(blogs.map(blog => 
        blog._id === id ? { ...blog, status } : blog
      ));
    } catch (error) {
      console.error('Error updating blog status:', error);
    }
  };

  const handleToggleFeatured = async (id, isFeatured) => {
    try {
      await adminAPI.updateBlog(id, { isFeatured });
      
      // Update blog in the list
      setBlogs(blogs.map(blog => 
        blog._id === id ? { ...blog, isFeatured } : blog
      ));
    } catch (error) {
      console.error('Error updating featured status:', error);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    return new Date(dateString).toLocaleDateString();
  };

  // Get badge color based on status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'draft': return 'secondary';
      case 'published': return 'primary';
      case 'archived': return 'danger';
      default: return 'info';
    }
  };

  return (
    <div>
      <SEOHead 
        title="Content Management"
        description="Manage blogs, videos, and gallery content with advanced editing tools"
      />
      
      <div className="d-flex align-items-center mb-4">
        <div className="stat-icon me-3">
          <i className="bi bi-file-earmark-text"></i>
        </div>
        <h2 className="text-gradient mb-0">Content Management</h2>
      </div>
      
      <div>
        <Card className="dashboard-card mb-4">
          <Card.Header className="pb-0 border-bottom-0">
            <div className="content-tabs-wrapper">
              <div className={`content-tabs ${activeTab === 'videos' ? 'videos-active' : activeTab === 'gallery' ? 'gallery-active' : ''}`}>
                <button 
                  className={`content-tab ${activeTab === 'blogs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('blogs')}
                >
                  <i className="bi bi-journal-text"></i>Blogs
                </button>
                <button 
                  className={`content-tab ${activeTab === 'videos' ? 'active' : ''}`}
                  onClick={() => setActiveTab('videos')}
                >
                  <i className="bi bi-camera-video"></i>Videos
                </button>
                <button 
                  className={`content-tab ${activeTab === 'gallery' ? 'active' : ''}`}
                  onClick={() => setActiveTab('gallery')}
                >
                  <i className="bi bi-images"></i>Gallery
                </button>
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            {activeTab === 'blogs' && (
                <Form onSubmit={handleFilterSubmit}>
                  <Row>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small">Status</Form.Label>
                        <Form.Select 
                          name="status" 
                          value={filter.status} 
                          onChange={handleFilterChange}
                          size="sm"
                        >
                          <option value="">All</option>
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={3}>
                      <Form.Group className="mb-3">
                        <Form.Label className="small">Featured</Form.Label>
                        <Form.Select 
                          name="isFeatured" 
                          value={filter.isFeatured} 
                          onChange={handleFilterChange}
                          size="sm"
                        >
                          <option value="">All</option>
                          <option value="true">Featured</option>
                          <option value="false">Not Featured</option>
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
                          placeholder="Search by title or content"
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
            )}
            {(activeTab === 'videos' || activeTab === 'gallery') && (
              <Form onSubmit={handleFilterSubmit}>
                <Row>
                  {activeTab === 'videos' && (
                    <>
                      {/* Simplified - no filters for videos */}
                    </>
                  )}
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small">Search</Form.Label>
                      <Form.Control
                        type="text"
                        name="search"
                        value={filter.search}
                        onChange={handleFilterChange}
                        placeholder={`Search ${activeTab}`}
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
                  <Col md={2}>
                    <Form.Group className="mb-3">
                      <Form.Label className="small">&nbsp;</Form.Label>
                      <Button 
                        variant="success" 
                        size="sm" 
                        className="w-100"
                        onClick={() => handleCreate(activeTab === 'gallery' ? 'gallery' : activeTab.slice(0, -1))}
                      >
                        <i className="bi bi-plus-circle me-1"></i>Add
                      </Button>
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            )}
          </Card.Body>
        </Card>
        
        <Card className="dashboard-card">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div className="card-icon">
                <i className={`bi bi-${activeTab === 'blogs' ? 'journal-text' : activeTab === 'videos' ? 'camera-video' : 'images'}`}></i>
              </div>
              <h5 className="mb-0">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h5>
            </div>
            <div>
              {activeTab === 'blogs' && (
                <Link to="/admin/content/blog/new" className="btn btn-success btn-sm">
                  <i className="bi bi-journal-plus me-1"></i>Create Blog
                </Link>
              )}
              {activeTab !== 'blogs' && (
                <Button variant="primary" size="sm" onClick={() => handleCreate(activeTab === 'gallery' ? 'gallery' : activeTab.slice(0, -1))}>
                  <i className="bi bi-plus-circle me-2"></i>Add {activeTab === 'gallery' ? 'Image' : activeTab.slice(0, -1)}
                </Button>
              )}
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
                <p className="mt-2">Loading {activeTab}...</p>
              </div>
            ) : (
              <>
                {activeTab === 'blogs' && (
                  blogs.length > 0 ? (
                    <div className="table-container">
                      <Table responsive hover>
                      <thead>
                        <tr>
                          <th>Title</th>
                          <th>Author</th>
                          <th>Categories</th>
                          <th>Status</th>
                          <th>Featured</th>
                          <th>Published</th>
                          <th>Views</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogs.map((blog) => (
                          <tr key={blog._id}>
                            <td>{blog.title}</td>
                            <td>{blog.author?.name || 'Unknown'}</td>
                            <td>{blog.categories?.join(', ')}</td>
                            <td>
                              <Badge bg={getStatusBadge(blog.status)}>
                                {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                              </Badge>
                            </td>
                            <td>
                              <Form.Check
                                type="switch"
                                checked={blog.isFeatured}
                                onChange={() => handleToggleFeatured(blog._id, !blog.isFeatured)}
                              />
                            </td>
                            <td>{formatDate(blog.publishedAt)}</td>
                            <td>{blog.viewCount}</td>
                            <td>
                              <div className="d-flex gap-1">
                                <Link to={`/admin/content/blog/edit/${blog._id}`} className="btn btn-outline-success btn-sm">
                                  <i className="bi bi-pencil"></i>
                                </Link>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleDelete(blog._id, 'blog')}
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
                      <p className="mb-0">No blogs found</p>
                    </div>
                  )
                )}
                
                {activeTab === 'videos' && (
                  videos.length > 0 ? (
                    <Row>
                      {videos.map((video) => (
                        <Col md={4} key={video._id} className="mb-4">
                          <Card className="h-100">
                            <Card.Body>
                              <Card.Title className="h6 mb-3">{video.title}</Card.Title>
                              {video.videoUrl && (
                                <div className="mb-3" style={{ position: 'relative', paddingTop: '56.25%', backgroundColor: '#000', borderRadius: '4px', overflow: 'hidden' }}>
                                  <video 
                                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                    controls
                                  >
                                    <source src={video.videoUrl} type="video/mp4" />
                                  </video>
                                </div>
                              )}
                              <div className="d-flex gap-2">
                                <Button 
                                  variant="outline-primary" 
                                  size="sm"
                                  onClick={() => handleEdit(video, 'video')}
                                >
                                  <i className="bi bi-pencil"></i> Edit
                                </Button>
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleDelete(video._id, 'video')}
                                >
                                  <i className="bi bi-trash"></i> Delete
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <p className="mb-0">No videos found</p>
                    </div>
                  )
                )}
                
                {activeTab === 'gallery' && (
                  gallery.length > 0 ? (
                    <Row>
                      {gallery.map((image) => (
                        <Col md={3} key={image._id} className="mb-4">
                          <Card>
                            <Card.Img variant="top" src={image.imageUrl} style={{ height: '200px', objectFit: 'cover' }} />
                            <Card.Body>
                              <Card.Title className="h6">{image.title}</Card.Title>

                              <div className="d-flex justify-content-between">
                                <Button 
                                  variant="outline-danger" 
                                  size="sm"
                                  onClick={() => handleDelete(image._id, 'gallery')}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-5">
                      <p className="mb-0">No images found</p>
                    </div>
                  )
                )}
              </>
            )}
          </Card.Body>
        </Card>
      </div>
      
      {/* Content Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="xl" centered style={{ zIndex: 10500 }} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction === 'create' ? 'Create' : 'Edit'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedItem && (
            <Form>

              
              {modalType === 'video' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Video Title <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedItem.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter video title"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Video File <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="file"
                      accept="video/*"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (file) {
                          try {
                            const response = await uploadAPI.uploadVideo(file);
                            handleInputChange('videoUrl', response.data.data.url);
                          } catch (error) {
                            console.error('Video upload failed:', error);
                          }
                        }
                      }}
                    />
                    <Form.Text className="text-muted">
                      Upload video file (MP4, AVI, MOV, WMV - Max 100MB)
                    </Form.Text>
                    {selectedItem.videoUrl && (
                      <div className="mt-2">
                        <video width="300" height="200" controls>
                          <source src={selectedItem.videoUrl} type="video/mp4" />
                        </video>
                      </div>
                    )}
                  </Form.Group>
                </>
              )}
              
              {modalType === 'gallery' && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>Image Title <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedItem.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter image title"
                      required
                    />
                  </Form.Group>
                  
                  <Form.Group className="mb-3">
                    <Form.Label>Alt Text <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedItem.altText || ''}
                      onChange={(e) => handleInputChange('altText', e.target.value)}
                      placeholder="Describe the image for accessibility"
                      required
                    />
                  </Form.Group>
                  
                  <Row>
                    <Col md={5}>
                      <Form.Group className="mb-3">
                        <Form.Label>Gallery Image <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const file = e.target.files[0];
                            if (file) {
                              try {
                                const response = await uploadAPI.uploadGalleryImage(file);
                                handleInputChange('imageUrl', response.data.data.url);
                              } catch (error) {
                                console.error('Image upload failed:', error);
                              }
                            }
                          }}
                        />
                        <Form.Text className="text-muted">
                          Upload image file (JPG, PNG, GIF - Max 10MB)
                        </Form.Text>
                        {selectedItem.imageUrl && (
                          <div className="mt-2">
                            <img 
                              src={selectedItem.imageUrl} 
                              alt="Preview" 
                              style={{ width: '100%', maxWidth: '250px', height: 'auto', border: '1px solid #ddd', borderRadius: '4px' }}
                            />
                          </div>
                        )}
                      </Form.Group>
                    </Col>
                    <Col md={7}>
                      {/* Description removed */}
                    </Col>
                  </Row>
                </>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {modalAction === 'create' ? 'Create' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>
      

    </div>
  );
};

export default Content;