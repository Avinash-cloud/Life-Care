const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./models/User');
const Counsellor = require('./models/Counsellor');
const Blog = require('./models/Blog');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI )
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.log('MongoDB Connection Error:', err);
  process.exit(1);
});

// Create test data
const createTestData = async () => {
  try {
    // Clear existing data
    await User.deleteMany();
    await Counsellor.deleteMany();
    await Blog.deleteMany();
    
    console.log('Creating test users...');
    
    // Create admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@plcc.in',
      password: 'password123',
      role: 'admin',
      isEmailVerified: true,
      active: true
    });
    
    // Create client user
    const clientUser = await User.create({
      name: 'Test Client',
      email: 'client@example.com',
      password: 'password123',
      role: 'client',
      isEmailVerified: true,
      active: true
    });
    
    // Create counsellor user
    const counsellorUser = await User.create({
      name: 'Dr. Jane Smith',
      email: 'counsellor@example.com',
      password: 'password123',
      role: 'counsellor',
      counsellorType: 'psychologist',
      isEmailVerified: true,
      active: true
    });
    
    console.log('Creating test counsellor profile...');
    
    // Create counsellor profile
    const counsellor = await Counsellor.create({
      user: counsellorUser._id,
      name: 'Dr. Jane Smith',
      bio: 'Experienced therapist specializing in cognitive behavioral therapy with 8 years of practice.',
      specializations: ['Cognitive Behavioral Therapy', 'Anxiety', 'Depression'],
      qualifications: [
        {
          degree: 'Ph.D. in Clinical Psychology',
          institution: 'Stanford University',
          year: 2015,
          certificate: 'https://example.com/certificate.pdf'
        },
        {
          degree: 'M.A. in Psychology',
          institution: 'University of California',
          year: 2012,
          certificate: 'https://example.com/certificate2.pdf'
        }
      ],
      experience: 8,
      languages: ['English', 'Spanish'],
      fees: {
        video: 1500,
        chat: 1000,
        inPerson: 2000
      },
      availability: {
        monday: {
          isAvailable: true,
          startTime: '09:00',
          endTime: '17:00',
          slots: []
        },
        tuesday: {
          isAvailable: true,
          startTime: '09:00',
          endTime: '17:00',
          slots: []
        },
        wednesday: {
          isAvailable: true,
          startTime: '09:00',
          endTime: '17:00',
          slots: []
        },
        thursday: {
          isAvailable: true,
          startTime: '09:00',
          endTime: '17:00',
          slots: []
        },
        friday: {
          isAvailable: true,
          startTime: '09:00',
          endTime: '17:00',
          slots: []
        },
        saturday: {
          isAvailable: false,
          startTime: '00:00',
          endTime: '00:00',
          slots: []
        },
        sunday: {
          isAvailable: false,
          startTime: '00:00',
          endTime: '00:00',
          slots: []
        }
      },
      sessionDuration: 60,
      isVerified: true,
      ratings: {
        average: 4.8,
        count: 25
      }
    });
    
    console.log('Creating test blog post...');
    
    // Create a sample blog post
    await Blog.create({
      title: 'Understanding Anxiety: Causes and Coping Strategies',
      content: `
        <h2>What is Anxiety?</h2>
        <p>Anxiety is a normal and often healthy emotion. However, when a person regularly feels disproportionate levels of anxiety, it might become a medical disorder.</p>
        
        <h2>Common Causes of Anxiety</h2>
        <p>Anxiety disorders can be caused by a complex set of risk factors including:</p>
        <ul>
          <li>Genetics</li>
          <li>Brain chemistry</li>
          <li>Personality</li>
          <li>Life events</li>
        </ul>
        
        <h2>Effective Coping Strategies</h2>
        <p>Here are some strategies that can help manage anxiety:</p>
        <ol>
          <li>Practice deep breathing exercises</li>
          <li>Maintain a healthy lifestyle</li>
          <li>Limit caffeine and alcohol</li>
          <li>Get enough sleep</li>
          <li>Practice mindfulness meditation</li>
        </ol>
        
        <p>If you're struggling with anxiety, remember that professional help is available. Reach out to a mental health professional for personalized guidance.</p>
      `,
      excerpt: 'Learn about the causes of anxiety and discover effective strategies to manage anxiety symptoms in your daily life.',
      featuredImage: 'https://example.com/anxiety-image.jpg',
      author: counsellorUser._id,
      categories: ['Anxiety', 'Mental Health', 'Self-Help'],
      tags: ['anxiety', 'stress', 'mental health', 'coping strategies'],
      status: 'published',
      publishedAt: new Date(),
      isFeatured: true,
      readTime: 5
    });
    
    console.log('Test data created successfully');
    console.log('\nTest User Credentials:');
    console.log('Admin: admin@example.com / password123');
    console.log('Client: client@example.com / password123');
    console.log('Counsellor: counsellor@example.com / password123');
    
    process.exit();
  } catch (error) {
    console.error('Error creating test data:', error);
    process.exit(1);
  }
};

createTestData();