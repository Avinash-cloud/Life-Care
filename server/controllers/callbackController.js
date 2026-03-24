const CallbackRequest = require('../models/CallbackRequest');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create callback request
// @route   POST /api/callback
// @access  Public
exports.createCallbackRequest = async (req, res, next) => {
  try {
    const { name, phoneNumber, primaryConcern } = req.body;

    const callbackRequest = await CallbackRequest.create({
      name,
      phoneNumber,
      primaryConcern
    });

    res.status(201).json({
      success: true,
      data: callbackRequest
    });
  } catch (error) {
    next(error);
  }
};
