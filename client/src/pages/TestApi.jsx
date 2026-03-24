import { useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const TestApi = () => {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Testing login API...');
      const response = await authAPI.login({
        email: 'client@example.com',
        password: 'password123'
      });
      console.log('Login response:', response);
      setResult(response.data);
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>API Test Page</h1>
      <button 
        onClick={testLogin} 
        disabled={loading}
        style={{
          padding: '10px 20px',
          backgroundColor: '#4a5568',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer'
        }}
      >
        {loading ? 'Testing...' : 'Test Login API'}
      </button>

      {error && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fed7d7', borderRadius: '5px' }}>
          <h3>Error:</h3>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      {result && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#c6f6d5', borderRadius: '5px' }}>
          <h3>Success:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestApi;