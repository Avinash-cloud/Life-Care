const mongoose = require('mongoose');
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

const fixPasswords = async () => {
  try {
    // Find all users
    const users = await User.find();
    console.log(`Found ${users.length} users`);
    
    // Update each user's password
    for (const user of users) {
      console.log(`Updating password for ${user.email}...`);
      
      // Set the password directly (will be hashed by the pre-save hook)
      user.password = 'password123';
      await user.save();
      
      console.log(`Password updated for ${user.email}`);
    }
    
    console.log('All passwords updated successfully');
    console.log('\nTest User Credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Client: client@example.com / password123');
    console.log('Counsellor: counsellor@example.com / password123');
    
    process.exit();
  } catch (error) {
    console.error('Error fixing passwords:', error);
    process.exit(1);
  }
};

fixPasswords();