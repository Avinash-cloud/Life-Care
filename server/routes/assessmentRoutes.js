const express = require('express');
const router = express.Router();
const { saveAssessmentResult, getAssessmentResults } = require('../controllers/assessmentController');
const { protect, authorize } = require('../middleware/auth');

router.post('/save', saveAssessmentResult);
router.get('/admin', protect, authorize('admin'), getAssessmentResults);

module.exports = router;
