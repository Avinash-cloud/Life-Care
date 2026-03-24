const mongoose = require('mongoose');
const User = require('./models/User');
const Blog = require('./models/Blog');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lifecare')
.then(() => console.log('MongoDB Connected'))
.catch(err => {
  console.log('MongoDB Connection Error:', err);
  process.exit(1);
});

const fixImageUrls = async () => {
  try {
    console.log('Fixing image URLs...');
    
    // Fix user avatars
    const users = await User.find({ avatar: { $regex: '^/uploads/uploads' } });
    for (let user of users) {
      user.avatar = user.avatar.replace('/uploads/uploads', '/uploads');
      await user.save();
      console.log(`Fixed user avatar: ${user.email}`);
    }
    
    // Fix blog featured images
    const blogs = await Blog.find({ featuredImage: { $regex: '^/uploads/uploads' } });
    for (let blog of blogs) {
      blog.featuredImage = blog.featuredImage.replace('/uploads/uploads', '/uploads');
      await blog.save();
      console.log(`Fixed blog image: ${blog.title}`);
    }
    
    console.log('Image URLs fixed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error fixing URLs:', error);
    process.exit(1);
  }
};

fixImageUrls();