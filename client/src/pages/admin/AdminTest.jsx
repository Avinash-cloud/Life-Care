import { useState } from 'react';
import { Card, Button, Alert, Row, Col } from 'react-bootstrap';
import { adminAPI } from '../../services/api';

const AdminTest = () => {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testEndpoint = async (name, apiCall) => {
    try {
      setLoading(true);
      const response = await apiCall();
      setResults(prev => ({
        ...prev,
        [name]: { success: true, data: response.data }
      }));
    } catch (error) {
      setResults(prev => ({
        ...prev,
        [name]: { success: false, error: error.message }
      }));
    } finally {
      setLoading(false);
    }
  };

  const tests = [
    {
      name: 'Dashboard Stats',
      test: () => testEndpoint('dashboard', () => adminAPI.getDashboardStats())
    },
    {
      name: 'Users List',
      test: () => testEndpoint('users', () => adminAPI.getUsers())
    },
    {
      name: 'Counsellors List',
      test: () => testEndpoint('counsellors', () => adminAPI.getCounsellors())
    },
    {
      name: 'Appointments List',
      test: () => testEndpoint('appointments', () => adminAPI.getAppointments())
    },
    {
      name: 'Withdrawals List',
      test: () => testEndpoint('withdrawals', () => adminAPI.getWithdrawals())
    },
    {
      name: 'Blogs List',
      test: () => testEndpoint('blogs', () => adminAPI.getBlogs())
    },
    {
      name: 'Videos List',
      test: () => testEndpoint('videos', () => adminAPI.getVideos())
    },
    {
      name: 'Gallery List',
      test: () => testEndpoint('gallery', () => adminAPI.getGallery())
    },
    {
      name: 'Reports',
      test: () => testEndpoint('reports', () => adminAPI.getReports())
    },
    {
      name: 'Settings',
      test: () => testEndpoint('settings', () => adminAPI.getSettings())
    }
  ];

  const runAllTests = async () => {
    setResults({});
    for (const test of tests) {
      await test.test();
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <h2 className="text-gradient mb-0">Admin API Test</h2>
        <Button 
          variant="primary" 
          onClick={runAllTests}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Run All Tests'}
        </Button>
      </div>

      <Row>
        {tests.map((test, index) => (
          <Col md={6} lg={4} key={index} className="mb-3">
            <Card className="h-100">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <h6 className="mb-0">{test.name}</h6>
                  <Button 
                    size="sm" 
                    variant="outline-primary"
                    onClick={test.test}
                    disabled={loading}
                  >
                    Test
                  </Button>
                </div>
                
                {results[test.name.toLowerCase().replace(' ', '')] && (
                  <Alert 
                    variant={results[test.name.toLowerCase().replace(' ', '')].success ? 'success' : 'danger'}
                    className="mb-0 mt-2"
                  >
                    {results[test.name.toLowerCase().replace(' ', '')].success ? (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Success
                      </>
                    ) : (
                      <>
                        <i className="bi bi-x-circle me-2"></i>
                        {results[test.name.toLowerCase().replace(' ', '')].error}
                      </>
                    )}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {Object.keys(results).length > 0 && (
        <Card className="mt-4">
          <Card.Header>
            <h5 className="mb-0">Test Results Summary</h5>
          </Card.Header>
          <Card.Body>
            <div className="mb-3">
              <strong>Passed:</strong> {Object.values(results).filter(r => r.success).length} / {Object.keys(results).length}
            </div>
            <div className="mb-3">
              <strong>Failed:</strong> {Object.values(results).filter(r => !r.success).length} / {Object.keys(results).length}
            </div>
            
            {Object.values(results).some(r => !r.success) && (
              <div>
                <strong>Failed Tests:</strong>
                <ul className="mt-2">
                  {Object.entries(results)
                    .filter(([_, result]) => !result.success)
                    .map(([name, result]) => (
                      <li key={name} className="text-danger">
                        {name}: {result.error}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AdminTest;