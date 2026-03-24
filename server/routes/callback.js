const express = require('express');
const { createCallbackRequest } = require('../controllers/callbackController');

const router = express.Router();

router.post('/', createCallbackRequest);

module.exports = router;
