import { useState, useEffect } from 'react';
import { Card, Table, Badge, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { adminAPI } from '../../services/api';
import ImageUpload from '../../components/shared/ImageUpload';
import '../client/Dashboard.css';
import './AdminStyles.css';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({
    role: '',
    search: '',
    active: ''
  });
  
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [modalAction, setModalAction] = useState('view'); // view, edit, create
  const [alert, setAlert] = useState({ show: false, message: '', type: 'success' });
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {};
      
      if (filter.role) params.role = filter.role;
      if (filter.search) params.search = filter.search;
      if (filter.active) params.active = filter.active === 'true';
      
      const response = await adminAPI.getUsers(params);
      setUsers(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
      showAlert('Error fetching users', 'danger');
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
    fetchUsers();
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setModalAction('view');
    setShowUserModal(true);
  };

  const handleEditUser = (user) => {
    setSelectedUser(user);
    setModalAction('edit');
    setShowUserModal(true);
  };

  const handleCreateUser = () => {
    setSelectedUser({
      name: '',
      email: '',
      password: '',
      role: 'client',
      active: true
    });
    setModalAction('create');
    setShowUserModal(true);
  };

  const showAlert = (message, type = 'success') => {
    setAlert({ show: true, message, type });
    setTimeout(() => setAlert({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleSaveUser = async () => {
    try {
      if (modalAction === 'create') {
        await adminAPI.createUser(selectedUser);
        showAlert('User created successfully');
      } else if (modalAction === 'edit') {
        console.log('Updating user with data:', selectedUser);
        await adminAPI.updateUser(selectedUser._id, selectedUser);
        showAlert('User updated successfully');
      }
      setShowUserModal(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      showAlert('Error saving user', 'danger');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    
    try {
      await adminAPI.deleteUser(userId);
      showAlert('User deleted successfully');
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showAlert('Error deleting user', 'danger');
    }
  };

  const handleBanUser = async (userId, banned, reason = '') => {
    try {
      await adminAPI.banUser(userId, { banned, reason });
      showAlert(`User ${banned ? 'banned' : 'unbanned'} successfully`);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user status:', error);
      showAlert('Error updating user status', 'danger');
    }
  };

  const handleInputChange = (field, value) => {
    setSelectedUser({ ...selectedUser, [field]: value });
  };
  
  const handleAvatarUpload = (url) => {
    console.log('Avatar uploaded:', url);
    setSelectedUser({ ...selectedUser, avatar: url });
  };

  const handlePageChange = (page) => {
    setFilter({ ...filter, page });
    fetchUsers();
  };

  // Get badge color based on role
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin': return 'danger';
      case 'counsellor': return 'success';
      case 'client': return 'primary';
      default: return 'secondary';
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center mb-4">
        <div className="stat-icon me-3">
          <i className="bi bi-people"></i>
        </div>
        <h2 className="text-gradient mb-0">User Management</h2>
      </div>
      
      <Card className="dashboard-card mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center py-2">
          <div className="d-flex align-items-center">
            <div className="card-icon">
              <i className="bi bi-funnel"></i>
            </div>
            <h5 className="mb-0">Filter Users</h5>
          </div>
          <Button variant="primary" size="sm" onClick={handleCreateUser}>
            <i className="bi bi-plus-circle me-2"></i>Add User
          </Button>
        </Card.Header>
        <Card.Body className="py-2">
          
          <Form onSubmit={handleFilterSubmit}>
            <Row>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label className="small">Role</Form.Label>
                  <Form.Select 
                    name="role" 
                    value={filter.role} 
                    onChange={handleFilterChange}
                    size="sm"
                  >
                    <option value="">All Roles</option>
                    <option value="client">Client</option>
                    <option value="counsellor">Counsellor</option>
                    <option value="admin">Admin</option>
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
                    placeholder="Search by name or email"
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
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <div className="card-icon">
                <i className="bi bi-table"></i>
              </div>
              <h5 className="mb-0">Users List ({pagination.total} total)</h5>
            </div>
          </div>
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
              <p className="mt-2">Loading users...</p>
            </div>
          ) : users.length > 0 ? (
            <div className="table-container">
              <Table responsive hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Verified</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <Badge bg="primary">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={user.active ? 'primary' : 'danger'}>
                        {user.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={user.isEmailVerified ? 'primary' : 'warning'}>
                        {user.isEmailVerified ? 'Verified' : 'Unverified'}
                      </Badge>
                    </td>
                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td>
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        className="me-1"
                        onClick={() => handleViewUser(user)}
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        className="me-1"
                        onClick={() => handleEditUser(user)}
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      {user.role !== 'admin' && (
                        <>
                          <Button 
                            variant={user.active ? 'outline-warning' : 'outline-success'} 
                            size="sm"
                            className="me-1"
                            onClick={() => handleBanUser(user._id, user.active, 'Admin action')}
                          >
                            <i className={`bi bi-${user.active ? 'ban' : 'check-circle'}`}></i>
                          </Button>
                          <Button 
                            variant="outline-danger" 
                            size="sm"
                            onClick={() => handleDeleteUser(user._id)}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-5">
              <p className="mb-0">No users found</p>
            </div>
          )}
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      Previous
                    </button>
                  </li>
                  {[...Array(pagination.pages)].map((_, i) => (
                    <li key={i + 1} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => handlePageChange(i + 1)}
                      >
                        {i + 1}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${pagination.page === pagination.pages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </Card.Body>
      </Card>
      
      {/* User Modal */}
      <Modal show={showUserModal} onHide={() => setShowUserModal(false)} size="xl" centered style={{ zIndex: 1050 }} dialogClassName="modal-90w">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalAction === 'view' ? 'User Details' : 
             modalAction === 'edit' ? 'Edit User' : 'Create User'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <Form>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      value={selectedUser.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      readOnly={modalAction === 'view'}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      value={selectedUser.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      readOnly={modalAction === 'view'}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              
              {modalAction !== 'view' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Avatar</Form.Label>
                      <ImageUpload
                        type="avatar"
                        currentImage={selectedUser.avatar}
                        onImageUploaded={handleAvatarUpload}
                        size="80px"
                      />
                    </Form.Group>
                  </Col>
                </Row>
              )}
              
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Role</Form.Label>
                    <Form.Select
                      value={selectedUser.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      disabled={modalAction === 'view' || selectedUser.role === 'counsellor'}
                    >
                      <option value="client">Client</option>
                      {selectedUser.role === 'counsellor' && <option value="counsellor">Counsellor</option>}
                      {selectedUser.role === 'admin' && <option value="admin">Admin</option>}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Status</Form.Label>
                    <Form.Select
                      value={selectedUser.active ? 'active' : 'inactive'}
                      onChange={(e) => handleInputChange('active', e.target.value === 'active')}
                      disabled={modalAction === 'view'}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              {modalAction !== 'view' && (
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password</Form.Label>
                      <div className="position-relative">
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          value={selectedUser.password || ''}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          placeholder={modalAction === 'edit' ? 'Leave blank to keep current' : 'Enter password'}
                          required={modalAction === 'create'}
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
                    </Form.Group>
                  </Col>
                </Row>
              )}
              
              {modalAction === 'view' && (
                <>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Created At</Form.Label>
                        <Form.Control
                          type="text"
                          value={new Date(selectedUser.createdAt).toLocaleString()}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Login</Form.Label>
                        <Form.Control
                          type="text"
                          value={selectedUser.lastLogin ? new Date(selectedUser.lastLogin).toLocaleString() : 'Never'}
                          readOnly
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </>
              )}
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowUserModal(false)}>
            {modalAction === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {modalAction !== 'view' && (
            <Button variant="primary" onClick={handleSaveUser}>
              {modalAction === 'edit' ? 'Save Changes' : 'Create User'}
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Users;