const express = require('express');
const router = express.Router();
const {
    updateKYCStatus,
    getMyProfile
} = require('../controllers/investorController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/kyc-status', protect, authorize('investor'), updateKYCStatus);
router.get('/me', protect, authorize('investor'), getMyProfile);

module.exports = router;
