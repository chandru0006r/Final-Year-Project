const express = require('express');
const router = express.Router();
const {
    applyLoan,
    getLoans,
    mentorApproveLoan,
    adminApproveLoan,
    fundLoan,
} = require('../controllers/loanController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, getLoans);
router.post('/apply', protect, authorize('student'), applyLoan);
router.post('/mentor-approve', protect, authorize('mentor'), mentorApproveLoan);
router.post('/admin-approve', protect, authorize('admin'), adminApproveLoan);
router.post('/fund', protect, authorize('investor'), fundLoan);

module.exports = router;
