const Offer = require('../models/Offer');

// @desc    Validate an offer code
// @route   POST /api/offers/validate
// @access  Public
exports.validateOffer = async (req, res, next) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, error: 'Please provide an offer code' });
    }

    const offer = await Offer.findOne({ offerCode: code.toUpperCase(), isActive: true });
    
    if (!offer) {
      return res.status(404).json({ success: false, error: 'Invalid or inactive offer code' });
    }

    if (offer.validUntil && new Date(offer.validUntil) < new Date()) {
      return res.status(400).json({ success: false, error: 'Offer code has expired' });
    }

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all active offers
// @route   GET /api/offers
// @access  Public
exports.getOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find({ isActive: true }).sort('-createdAt');
    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all offers (for admin)
// @route   GET /api/offers/admin
// @access  Private/Admin
exports.getAllOffers = async (req, res, next) => {
  try {
    const offers = await Offer.find().sort('-createdAt');
    res.status(200).json({
      success: true,
      count: offers.length,
      data: offers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new offer
// @route   POST /api/offers
// @access  Private/Admin
exports.createOffer = async (req, res, next) => {
  try {
    const offer = await Offer.create(req.body);

    res.status(201).json({
      success: true,
      data: offer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update offer
// @route   PUT /api/offers/:id
// @access  Private/Admin
exports.updateOffer = async (req, res, next) => {
  try {
    let offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        error: `Offer not found with id of ${req.params.id}`
      });
    }

    offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: offer
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete offer
// @route   DELETE /api/offers/:id
// @access  Private/Admin
exports.deleteOffer = async (req, res, next) => {
  try {
    const offer = await Offer.findById(req.params.id);

    if (!offer) {
      return res.status(404).json({
        success: false,
        error: `Offer not found with id of ${req.params.id}`
      });
    }

    await offer.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};
