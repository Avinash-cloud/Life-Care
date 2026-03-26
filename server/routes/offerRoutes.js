const express = require('express');
const {
  getOffers,
  getAllOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  validateOffer
} = require('../controllers/offerController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public route for active offers
router.get('/', getOffers);
router.post('/validate', validateOffer);

// Admin routes
router.use(protect);
router.use(authorize('admin'));

router.route('/admin')
  .get(getAllOffers);

router.route('/')
  .post(createOffer);

router.route('/:id')
  .put(updateOffer)
  .delete(deleteOffer);

module.exports = router;
