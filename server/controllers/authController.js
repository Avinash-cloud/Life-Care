const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const User = require('../models/User');
const ErrorResponse = require('../utils/errorResponse');
const sendEmail = require('../utils/sendEmail');
const { generateAndSendOTP, mockOTP } = require('../utils/otpGenerator');
const fs = require('fs');
const path = require('path');

// Helper function to delete old file
const deleteOldFile = (filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new ErrorResponse('Email already registered', 400));
    }

    // Only allow client registration through public registration
    if (role && role !== 'client') {
      return next(new ErrorResponse('Public registration is only available for clients. Mental health professionals should contact administrators.', 400));
    }

    // Create user
    const userData = {
      name,
      email,
      password,
      role: 'client', // Force role to client for public registration
      phone
    };

    const user = await User.create(userData);

    // Generate email verification token
    const verificationToken = user.getEmailVerificationToken();
    await user.save({ validateBeforeSave: false });

    // Create verification URL
    const verificationUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

    // Send verification email
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">Welcome to SS Psychologist Life Care!</h2>
        <p>Hello ${user.name},</p>
        <p>Thank you for registering with us. Please verify your email address by clicking the button below:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${verificationUrl}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
        </div>
        <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
        <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
        <p><strong>Note:</strong> You can start using your account immediately, but some features may be limited until you verify your email.</p>
        <p>This link will expire in 24 hours.</p>
        <p>Best regards,<br>SS Psychologist Life Care Team</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Verify Your Email - SS Psychologist Life Care',
        html: message
      });
    } catch (error) {
      console.error('Email verification error:', error);
      // Don't fail registration if email fails
    }

    // Send success response - user can login immediately
    res.status(201).json({
      success: true,
      message: 'Registration successful! A verification link has been sent to your email. You can start using your account now.',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
exports.verifyEmail = async (req, res, next) => {
  try {
    // Get hashed token
    const emailVerificationToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid or expired verification token', 400));
    }

    // Mark email as verified
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpire = undefined;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP (kept for backward compatibility)
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    // Find user by email
    const user = await User.findOne({ email }).select('+otp.code +otp.expiresAt');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if OTP exists and is valid
    if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
      return next(new ErrorResponse('OTP not found or expired. Please request a new one.', 400));
    }

    // Verify OTP
    const isValid = user.verifyOTP(otp);
    if (!isValid) {
      return next(new ErrorResponse('Invalid OTP', 401));
    }

    // Mark email as verified
    user.isEmailVerified = true;
    await user.save();

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Generate new OTP
    let otp;
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_OTP === 'true') {
      otp = mockOTP(user);
      await user.save({ validateBeforeSave: false });
    } else {
      try {
        otp = await generateAndSendOTP(user, email);
      } catch (error) {
        return next(new ErrorResponse('Failed to send OTP. Please try again.', 500));
      }
    }

    // Send response
    const responseData = {
      success: true,
      message: 'OTP sent successfully'
    };

    // Include OTP in development mode for testing
    if (process.env.NODE_ENV === 'development' && process.env.MOCK_OTP === 'true') {
      responseData.otp = otp;
    }

    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return next(new ErrorResponse('Please provide an email and password', 400));
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Allow login even if email is not verified
    // Just show a warning message in the response

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res, next) => {
  try {
    const { idToken } = req.body;

    // Verify Google token
    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if not exists
      user = await User.create({
        name,
        email,
        password: crypto.randomBytes(20).toString('hex'), // Random password
        googleId,
        avatar: picture,
        isEmailVerified: true // Google already verified the email
      });
    } else {
      // Update existing user with Google ID if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.isEmailVerified = true;
        await user.save({ validateBeforeSave: false });
      }
    }

    // Update last login
    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user details
// @route   PUT /api/auth/updatedetails
// @access  Private
exports.updateDetails = async (req, res, next) => {
  try {
    const fieldsToUpdate = {};
    
    if (req.body.name) {
      fieldsToUpdate.name = req.body.name;
    }

    if (req.body.phone) {
      fieldsToUpdate.phone = req.body.phone;
      if (req.user.phone !== req.body.phone) {
        fieldsToUpdate.isPhoneVerified = false;
      }
    }

    // Handle avatar upload
    if (req.file) {
      // Delete old avatar if exists
      if (req.user.avatar && req.user.avatar.startsWith('/uploads/')) {
        const oldPath = path.join(__dirname, '..', req.user.avatar);
        deleteOldFile(oldPath);
      }
      
      fieldsToUpdate.avatar = `/${req.file.path.replace(/\\/g, '/')}`;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Check current password
    const user = await User.findById(req.user.id).select('+password');
    if (!await user.matchPassword(currentPassword)) {
      return next(new ErrorResponse('Current password is incorrect', 401));
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse('There is no user with that email', 404));
    }

    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Create email message
    const message = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4a5568;">Reset Your Password</h2>
        <p>Hello ${user.name},</p>
        <p>You are receiving this email because you (or someone else) has requested the reset of a password.</p>
        <p>Please click the button below to reset your password:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #4a5568; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        </div>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
        <p>This link will expire in 10 minutes.</p>
        <p>Regards,<br>S S Psychologist Life Care Team</p>
      </div>
    `;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        html: message
      });

      res.status(200).json({
        success: true,
        message: 'Email sent'
      });
    } catch (error) {
      console.error('Email error:', error);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    // Get hashed token
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(new ErrorResponse('Invalid token or token has expired', 400));
    }

    // Set new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    // Send token response
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  try {
    if (req.user) {
      await User.findByIdAndUpdate(req.user.id, {
        refreshToken: undefined
      });
    }

    res
      .clearCookie('token', { path: '/' })
      .clearCookie('refreshToken', { path: '/' })
      .status(200)
      .json({
        success: true,
        message: 'Logged out successfully'
      });
  } catch (error) {
    next(error);
  }
};

// Helper function to send token response
const sendTokenResponse = (user, statusCode, res) => {
  const accessToken = user.getSignedJwtToken();
  const refreshToken = user.getRefreshToken();
  
  user.save({ validateBeforeSave: false });
  
  const tokenOptions = {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/'
  };

  const refreshOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    path: '/'
  };

  res
    .status(statusCode)
    .cookie('token', accessToken, tokenOptions)
    .cookie('refreshToken', refreshToken, refreshOptions)
    .json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        counsellorType: user.counsellorType,
        avatar: user.avatar,
        phone: user.phone,
        isEmailVerified: user.isEmailVerified
      }
    });
};