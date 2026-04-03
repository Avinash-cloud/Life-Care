const AssessmentResult = require('../models/AssessmentResult');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Save public assessment result
// @route   POST /api/assessment/save
// @access  Public
exports.saveAssessmentResult = async (req, res, next) => {
  try {
    const { name, email, phone, score, testUrl } = req.body;

    // Validate required fields
    if (!phone) {
      return next(new ErrorResponse('Please provide a phone number', 400));
    }
    if (!name && !email) {
      return next(new ErrorResponse('Please provide either a name or an email', 400));
    }
    if (score === undefined) {
      return next(new ErrorResponse('Score is missing', 400));
    }

    const result = await AssessmentResult.create({
      name,
      email,
      phone,
      score,
      testUrl: testUrl || 'Unknown'
    });

    res.status(201).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all assessment results
// @route   GET /api/assessment/admin
// @access  Private/Admin
exports.getAssessmentResults = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const results = await AssessmentResult.find()
      .sort('-createdAt')
      .skip(skip)
      .limit(limit);

    const total = await AssessmentResult.countDocuments();

    res.status(200).json({
      success: true,
      count: results.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      data: results
    });
  } catch (error) {
    next(error);
  }
};
