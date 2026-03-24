const express = require('express');
const {
  createAttachment,
  getAppointmentAttachments,
  getClientAttachments,
  getAttachment,
  updateAttachment,
  deleteAttachment
} = require('../controllers/postSessionController');

const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Counsellor routes (Psychiatrist/Psychologist only)
router.post('/appointments/:appointmentId/attachments', 
  protect, 
  authorize('counsellor'), 
  createAttachment
);

router.get('/appointments/:appointmentId/attachments', 
  protect, 
  authorize('counsellor'), 
  getAppointmentAttachments
);

router.put('/attachments/:id', 
  protect, 
  authorize('counsellor'), 
  updateAttachment
);

router.delete('/attachments/:id', 
  protect, 
  authorize('counsellor'), 
  deleteAttachment
);

// Client routes
router.get('/client/attachments', 
  protect, 
  authorize('client'), 
  getClientAttachments
);

router.get('/client/attachments/:id', 
  protect, 
  authorize('client'), 
  getAttachment
);

module.exports = router;