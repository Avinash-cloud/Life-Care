const otpGenerator = require('otp-generator');
const sendEmail = require('./sendEmail');

/**
 * Generate OTP and send via email
 * @param {Object} user - User object
 * @param {String} email - User email
 * @returns {String} - Generated OTP
 */
exports.generateAndSendOTP = async (user, email) => {
  // Generate OTP
  const otp = user.generateOTP();
  
  // Save user with OTP
  await user.save({ validateBeforeSave: false });
  
  // Send OTP via email
  try {
    await sendEmail({
      email,
      subject: 'Your OTP for S S Psychologist Life Care',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #4a5568;">S S Psychologist Life Care</h2>
          <p>Hello ${user.name},</p>
          <p>Your One Time Password (OTP) for verification is:</p>
          <div style="background-color: #f7fafc; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold;">
            ${otp}
          </div>
          <p>This OTP is valid for ${process.env.OTP_EXPIRE || 10} minutes.</p>
          <p>If you didn't request this OTP, please ignore this email.</p>
          <p>Regards,<br>S S Psychologist Life Care Team</p>
        </div>
      `
    });
    
    return otp;
  } catch (error) {
    // Reset OTP fields if email fails
    user.otp = undefined;
    await user.save({ validateBeforeSave: false });
    
    throw new Error('Email could not be sent');
  }
};

/**
 * Mock OTP generation for development
 * @param {Object} user - User object
 * @returns {String} - Generated OTP
 */
exports.mockOTP = (user) => {
  const otp = '123456'; // Fixed OTP for development/testing
  
  // Hash OTP and set in user model (same as generateOTP method)
  const crypto = require('crypto');
  const hashedOTP = crypto
    .createHash('sha256')
    .update(otp)
    .digest('hex');
  
  // Set OTP and expiry
  user.otp = {
    code: hashedOTP,
    expiresAt: Date.now() + (process.env.OTP_EXPIRE || 10) * 60 * 1000
  };
  
  return otp;
};