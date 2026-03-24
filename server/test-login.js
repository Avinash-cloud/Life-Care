const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lifecare')
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.log('MongoDB Connection Error:', err);
  process.exit(1);
});

const testLogin = async () => {
  try {
    // Find the client user
    const email = 'client@example.com';
    const password = 'password123';
    
    console.log(`Testing login for ${email}...`);
    
    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      console.log('User not found!');
      process.exit(1);
    }
    
    console.log('User found:', {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isEmailVerified: user.isEmailVerified
    });
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    
    if (!isMatch) {
      console.log('Password does not match!');
    } else {
      console.log('Login would be successful!');
    }
    
    process.exit();
  } catch (error) {
    console.error('Error testing login:', error);
    process.exit(1);
  }
};

testLogin();