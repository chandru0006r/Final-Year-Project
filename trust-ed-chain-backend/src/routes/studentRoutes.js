const express = require('express');
const router = express.Router();
const {
    getStudentProfile,
    getStudents,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/:id', protect, getStudentProfile);
router.get('/', protect, authorize('mentor', 'admin'), getStudents);

module.exports = router;
