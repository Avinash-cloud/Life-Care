// Test script to debug admin user update
const axios = require('axios');

const testAdminUpdate = async () => {
  try {
    // First login as admin
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'admin@lifecare.com',
      password: 'admin123'
    }, {
      withCredentials: true
    });

    console.log('Login successful');

    // Get users to find a test user
    const usersResponse = await axios.get('http://localhost:5000/api/admin/users', {
      withCredentials: true
    });

    const testUser = usersResponse.data.data[0]; // Get first user
    console.log('Test user:', testUser.name, testUser.email);

    // Test avatar update
    const formData = new FormData();
    formData.append('name', testUser.name);
    formData.append('email', testUser.email);
    formData.append('role', testUser.role);
    formData.append('active', testUser.active);
    formData.append('avatar', '/uploads/profiles/test-avatar.jpg'); // Test avatar URL

    const updateResponse = await axios.put(`http://localhost:5000/api/admin/users/${testUser._id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      withCredentials: true
    });

    console.log('Update response:', updateResponse.data);
    console.log('Updated avatar:', updateResponse.data.data.avatar);

  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
};

testAdminUpdate();