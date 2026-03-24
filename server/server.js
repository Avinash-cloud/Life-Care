const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'https://www.plcc.in' // Add your actual frontend URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // For legacy browser support
}));

// Rate limiting for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Stricter rate limiting for refresh token endpoint
const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 refresh attempts per 15 minutes
  message: 'Too many token refresh attempts, please try again later',
  skipSuccessfulRequests: true // Only count failed requests
});

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser()); // For JWT cookies

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

// Serve static files with proper headers
app.use('/uploads', (req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/auth'));

// Apply stricter rate limiting to refresh token endpoint
app.use('/api/auth/refresh-token', refreshTokenLimiter);
app.use('/api/upload', require('./routes/upload'));
app.use('/api/appointments', require('./routes/appointments'));
app.use('/api/client', require('./routes/client'));
app.use('/api/counsellor', require('./routes/counsellor'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/cms', require('./routes/cms'));
app.use('/api/post-session', require('./routes/postSession'));
app.use('/api/payments', require('./routes/payments'));
app.use('/api/callback', require('./routes/callback'));

// Socket.IO for video calls
const rooms = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-room', (appointmentId) => {
    socket.join(appointmentId);
    
    if (!rooms.has(appointmentId)) {
      rooms.set(appointmentId, new Set());
    }
    rooms.get(appointmentId).add(socket.id);
    
    socket.to(appointmentId).emit('user-joined', socket.id);
  });

  socket.on('offer', (data) => {
    socket.to(data.appointmentId).emit('offer', {
      offer: data.offer,
      from: socket.id
    });
  });

  socket.on('answer', (data) => {
    socket.to(data.appointmentId).emit('answer', {
      answer: data.answer,
      from: socket.id
    });
  });

  socket.on('ice-candidate', (data) => {
    socket.to(data.appointmentId).emit('ice-candidate', {
      candidate: data.candidate,
      from: socket.id
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    rooms.forEach((users, appointmentId) => {
      if (users.has(socket.id)) {
        users.delete(socket.id);
        socket.to(appointmentId).emit('user-left', socket.id);
        if (users.size === 0) {
          rooms.delete(appointmentId);
        }
      }
    });
  });
});

// Root route
app.get('/api', (req, res) => {
  res.send('S S Psychologist Life Care API is running');
});

// Error handler middleware
app.use(errorHandler);

// Start server
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});