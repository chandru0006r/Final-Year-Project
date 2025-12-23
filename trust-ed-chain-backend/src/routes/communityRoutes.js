const express = require('express');
const router = express.Router();
const {
    createCommunity,
    getAllCommunities,
    getCommunity,
    joinCommunity,
    sendMessage,
    createPoll,
    contributeToPoll
} = require('../controllers/communityController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createCommunity)
    .get(protect, getAllCommunities);

router.route('/:id')
    .get(protect, getCommunity);

router.post('/join', protect, joinCommunity);
router.post('/message', protect, sendMessage);
router.post('/poll', protect, createPoll);
router.post('/poll/contribute', protect, contributeToPoll);

module.exports = router;
