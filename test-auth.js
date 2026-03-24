const axios = require('axios');

const baseURL = 'http://localhost:8080/api';

// Test login and then access protected route
async function testAuth() {
  try {
    console.log('1. Testing login...');
    
    // Login first
    const loginResponse = await axios.post(`${baseURL}/auth/login`, {
      email: 'admin@example.com',
      password: 'password123'
    }, {
      withCredentials: true
    });
    
    console.log('Login successful:', loginResponse.data);
    
    // Extract cookies from login response
    const cookies = loginResponse.headers['set-cookie'];
    
    console.log('2. Testing protected route...');
    
    // Test protected route with cookies
    const protectedResponse = await axios.get(`${baseURL}/admin/dashboard`, {
      headers: {
        'Cookie': cookies ? cookies.join('; ') : ''
      },
      withCredentials: true
    });
    
    console.log('Protected route successful:', protectedResponse.data);
    
  } catch (error) {
    console.error('Error:', error.response?.status, error.response?.data);
  }
}

testAuth();