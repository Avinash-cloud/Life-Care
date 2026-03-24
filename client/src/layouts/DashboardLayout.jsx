import { Outlet, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/dashboard/Sidebar';
import { Spinner } from 'react-bootstrap';

const DashboardLayout = ({ role }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    // Check if user is logged in and has correct role
    if (!loading && (!user || user.role !== role)) {
      navigate('/login');
    }
  }, [user, loading, navigate, role]);

  const handleSidebarToggle = (collapsed) => {
    setSidebarCollapsed(collapsed);
  };

  const handleLogout = () => {
    logout();
  };

  // Check if we're on mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Update isMobile state when window resizes
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {isMobile && (
        <button 
          className="mobile-sidebar-toggle dashboard-toggle" 
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle Sidebar"
        >
          <i className="bi bi-list"></i>
        </button>
      )}
      
      {mobileOpen && <div className="sidebar-overlay" onClick={() => setMobileOpen(false)}></div>}
      
      <Sidebar 
        userRole={role} 
        onToggle={handleSidebarToggle}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      
      <div className={`dashboard-content ${sidebarCollapsed ? 'expanded' : ''}`}>
        <div className="dashboard-header">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h1 className="h3 mb-0">Welcome, <span className="text-gradient">{user?.name || 'User'}</span></h1>
              {/* <p className="text-muted mb-0">Here's what's happening with your account today.</p> */}
            </div>
            <div className="d-flex">
              <Link to="/" className="btn btn-outline-primary me-2">
                <i className="bi bi-house-door me-1"></i>Home
              </Link>
              {/* <button onClick={handleLogout} className="btn btn-outline-danger">
                <i className="bi bi-box-arrow-right me-1"></i>Logout
              </button> */}
            </div>
          </div>
        </div>
        <div className="dashboard-main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;