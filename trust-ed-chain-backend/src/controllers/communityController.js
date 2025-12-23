const Community = require('../models/Community');
const User = require('../models/User');

/*
  @desc   Create a new community
  @route  POST /api/communities
  @access Private
*/
const createCommunity = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can create communities' });
        }

        const { name, description } = req.body;

        if (!name || !description) {
            return res.status(400).json({ message: 'Please provide name and description' });
        }

        const existing = await Community.findOne({ name });
        if (existing) {
            return res.status(400).json({ message: 'Community name already exists' });
        }

        const community = await Community.create({
            name,
            description,
            createdBy: req.user.id,
            members: [req.user.id] // Creator is first member
        });

        res.status(201).json(community);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
  @desc   Get all communities
  @route  GET /api/communities
  @access Private
*/
const getAllCommunities = async (req, res) => {
    try {
        const communities = await Community.find()
            .select('-messages') // Don't fetch messages for list view to save bandwidth
            .populate('members', 'name')
            .sort({ createdAt: -1 });
        res.json(communities);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
  @desc   Get single community with messages
  @route  GET /api/communities/:id
  @access Private
*/
const getCommunity = async (req, res) => {
    try {
        const community = await Community.findById(req.params.id)
            .populate('members', 'name role')
            .populate('messages.sender', 'name role');

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        res.json(community);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
  @desc   Join a community
  @route  POST /api/communities/join
  @access Private
*/
const joinCommunity = async (req, res) => {
    try {
        if (req.user.role !== 'student') {
            return res.status(403).json({ message: 'Only students can join communities' });
        }

        const { communityId } = req.body;
        const community = await Community.findById(communityId);

        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // Check if already member
        if (community.members.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already a member' });
        }

        community.members.push(req.user.id);
        await community.save();

        res.json(community);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
  @desc   Send a message to community
  @route  POST /api/communities/message
  @access Private
*/
const sendMessage = async (req, res) => {
    try {
        const { communityId, text } = req.body;

        if (!text) {
            return res.status(400).json({ message: 'Message text is required' });
        }

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // Optional: Check if user is member
        if (!community.members.includes(req.user.id)) {
            return res.status(403).json({ message: 'Must be a member to send messages' });
        }

        const newMessage = {
            sender: req.user.id,
            text,
            createdAt: new Date()
        };

        community.messages.push(newMessage);
        await community.save();

        // Return the populated message so frontend can display sender name immediately
        // (A bit tricky with embedded, better to return whole updated list or fetch sender)
        // For MVP, we can re-fetch or populate just the last one?
        // Let's just return the new message object with basic user ID for now, 
        // frontend can use local user name for optimistic UI.

        res.json(newMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const createPoll = async (req, res) => {
    try {
        const { communityId, title, targetAmount } = req.body;

        if (!title || !targetAmount) {
            return res.status(400).json({ message: 'Title and target amount are required' });
        }

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        if (!community.members.includes(req.user.id)) {
            return res.status(403).json({ message: 'Must be a member to create a poll' });
        }

        const newPoll = {
            sender: req.user.id,
            text: title, // Using text field for Title
            type: 'poll',
            pollDetails: {
                targetAmount: Number(targetAmount),
                collectedAmount: 0,
                contributors: []
            },
            createdAt: new Date()
        };

        community.messages.push(newPoll);
        await community.save();

        res.json(newPoll);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

const contributeToPoll = async (req, res) => {
    try {
        const { communityId, messageId, amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ message: 'Invalid amount' });
        }

        const community = await Community.findById(communityId);
        if (!community) {
            return res.status(404).json({ message: 'Community not found' });
        }

        // Find the message (poll)
        const pollMessage = community.messages.id(messageId);
        if (!pollMessage || pollMessage.type !== 'poll') {
            return res.status(404).json({ message: 'Poll not found' });
        }

        // Logic check: Can't exceed target? Optional. Let's allow over-funding for now or cap it.
        // For MVP, just add.

        pollMessage.pollDetails.collectedAmount += Number(amount);
        pollMessage.pollDetails.contributors.push({
            user: req.user.id,
            amount: Number(amount)
        });

        await community.save();

        res.json(pollMessage);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createCommunity,
    getAllCommunities,
    getCommunity,
    joinCommunity,
    sendMessage,
    createPoll,
    contributeToPoll
};
