import React, { useState, useEffect } from 'react';
import { Card, Table, Pagination, Badge, Spinner, Alert } from 'react-bootstrap';
import { adminAPI } from '../../services/api';

const AssessmentResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0
  });

  const fetchResults = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      const response = await adminAPI.getAssessmentResults({ page, limit: 10 });
      setResults(response.data.data);
      setPagination({
        currentPage: response.data.currentPage,
        totalPages: response.data.totalPages,
        total: response.data.total
      });
    } catch (err) {
      console.error('Error fetching assessment results:', err);
      setError('Failed to load assessment results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, []);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchResults(newPage);
    }
  };

  const getSeverityBadge = (score) => {
    // Score scaling based on AnxietyTest.jsx standard (max 75)
    const percentage = (score / 75) * 100;
    
    if (percentage <= 25) return <Badge bg="success">Low Concern</Badge>;
    if (percentage <= 50) return <Badge bg="warning" text="dark">Mild/Moderate</Badge>;
    if (percentage <= 75) return <Badge bg="orange" style={{backgroundColor: '#fd7e14'}}>High Distress</Badge>;
    return <Badge bg="danger">Severe Distress</Badge>;
  };

  return (
    <div className="admin-assessments">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Assessment Results</h2>
        <div className="text-muted">Total Submissions: {pagination.total}</div>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card className="shadow-sm border-0">
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Score</th>
                  <th className="px-4 py-3">Severity</th>
                  <th className="px-4 py-3">Source</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5">
                      <Spinner animation="border" variant="primary" />
                    </td>
                  </tr>
                ) : results.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-5 text-muted">
                      No assessment results found.
                    </td>
                  </tr>
                ) : (
                  results.map((result) => (
                    <tr key={result._id}>
                      <td className="px-4 py-3">
                        {new Date(result.createdAt).toLocaleDateString()}<br/>
                        <small className="text-muted">
                          {new Date(result.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </small>
                      </td>
                      <td className="px-4 py-3 fw-medium">
                        {result.name || <span className="text-muted fst-italic">Not Provided</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div><i className="bi bi-telephone text-muted me-2"></i>{result.phone}</div>
                        {result.email && (
                          <div className="text-muted small">
                            <i className="bi bi-envelope me-2"></i>{result.email}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 fw-bold">
                        {result.score} / 75
                      </td>
                      <td className="px-4 py-3">
                        {getSeverityBadge(result.score)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="small">
                          {(() => {
                            try {
                              const url = result.testUrl || '';
                              // Game results store as "origin/game — Game Name"
                              if (url.includes(' — ')) return url.split(' — ')[1];
                              const path = new URL(url).pathname.replace(/^\//, '');
                              const names = { 'anxiety-test': 'Anxiety Assessment', 'game': 'Wellness Game' };
                              return names[path] || path || 'Assessment';
                            } catch { return 'Assessment'; }
                          })()}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
        
        {/* Pagination control */}
        {pagination.totalPages > 1 && (
          <Card.Footer className="bg-white border-top-0 pt-4 pb-3">
            <Pagination className="justify-content-center mb-0">
              <Pagination.Prev 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
              />
              {[...Array(pagination.totalPages)].map((_, idx) => (
                <Pagination.Item 
                  key={idx + 1}
                  active={idx + 1 === pagination.currentPage}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
              />
            </Pagination>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default AssessmentResults;
