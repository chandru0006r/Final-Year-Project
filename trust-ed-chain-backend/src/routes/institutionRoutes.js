const express = require('express');
const router = express.Router();
const {
    getDashboardData,
    addMentor,
    addStudent,
    assignStudent
} = require('../controllers/institutionController');
const { protect, authorize } = require('../middleware/authMiddleware');

// All routes are for Admin only
router.use(protect);
router.use(authorize('admin'));

router.get('/dashboard', getDashboardData);
router.post('/add-mentor', addMentor);
router.post('/add-student', addStudent);
router.post('/assign-student', assignStudent);

module.exports = router;
