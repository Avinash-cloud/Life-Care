const axios = require('axios');

const testApiLogin = async () => {
  try {
    console.log('Testing API login...');
    
    const response = await axios.post('http://localhost:8080/api/auth/login', {
      email: 'client@example.com',
      password: 'password123'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Login successful!');
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Login failed!');
    console.error('Error status:', error.response?.status);
    console.error('Error data:', JSON.stringify(error.response?.data, null, 2));
    console.error('Error message:', error.message);
  }
};

testApiLogin();