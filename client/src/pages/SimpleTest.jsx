import React, { useState } from 'react';
import { Container, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const SimpleTest = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await axios.get('http://localhost:5000/api/counsellors');
      setResult(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <h2>Simple API Test</h2>
      <Button 
        variant="primary" 
        onClick={testApi} 
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Test API'}
      </Button>
      
      {error && (
        <Alert variant="danger" className="mt-3">
          Error: {error}
        </Alert>
      )}
      
      {result && (
        <Alert variant="success" className="mt-3">
          Success!
          <pre className="mt-2">
            {JSON.stringify(result, null, 2)}
          </pre>
        </Alert>
      )}
    </Container>
  );
};

export default SimpleTest;