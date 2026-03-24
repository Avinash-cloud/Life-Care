const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './server/.env' });

// Import models
const User = require('./server/models/User');
const Counsellor = require('./server/models/Counsellor');

const createTestUsers = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📡 Connected to MongoDB');

    // Create test client
    const clientPassword = await bcrypt.hash('client123', 12);
    const testClient = await User.findOneAndUpdate(
      { email: 'client@test.com' },
      {
        name: 'Test Client',
        email: 'client@test.com',
        password: clientPassword,
        role: 'client',
        isVerified: true,
        phone: '+1234567890'
      },
      { upsert: true, new: true }
    );

    // Create test counsellor user
    const counsellorPassword = await bcrypt.hash('counsellor123', 12);
    const testCounsellorUser = await User.findOneAndUpdate(
      { email: 'counsellor@test.com' },
      {
        name: 'Dr. Test Counsellor',
        email: 'counsellor@test.com',
        password: counsellorPassword,
        role: 'counsellor',
        isVerified: true,
        phone: '+1234567891'
      },
      { upsert: true, new: true }
    );

    // Create counsellor profile
    const testCounsellor = await Counsellor.findOneAndUpdate(
      { user: testCounsellorUser._id },
      {
        user: testCounsellorUser._id,
        specializations: ['Anxiety', 'Depression', 'Stress Management'],
        qualifications: ['PhD in Psychology', 'Licensed Therapist'],
        experience: 5,
        bio: 'Experienced counsellor specializing in anxiety and depression treatment.',
        consultationFee: 100,
        isVerified: true,
        isApproved: true,
        availability: {
          monday: { isAvailable: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          tuesday: { isAvailable: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          wednesday: { isAvailable: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          thursday: { isAvailable: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          friday: { isAvailable: true, slots: ['09:00', '10:00', '11:00', '14:00', '15:00'] },
          saturday: { isAvailable: false, slots: [] },
          sunday: { isAvailable: false, slots: [] }
        }
      },
      { upsert: true, new: true }
    );

    console.log('✅ Test users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('👤 Client:');
    console.log('   Email: client@test.com');
    console.log('   Password: client123');
    console.log('\n🧑‍⚕️ Counsellor:');
    console.log('   Email: counsellor@test.com');
    console.log('   Password: counsellor123');
    console.log('\n🎯 Next Steps:');
    console.log('1. Start the application: ./start-network-test.sh');
    console.log('2. Login as client on this device');
    console.log('3. Login as counsellor on another device');
    console.log('4. Book an appointment and test video/chat features');

  } catch (error) {
    console.error('❌ Error creating test users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('📡 Disconnected from MongoDB');
  }
};

createTestUsers();