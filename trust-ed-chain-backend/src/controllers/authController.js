const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Student = require('../models/Student');
const Investor = require('../models/Investor');

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

/*
  @desc   Register new user
  @route  POST /api/auth/register
  @access Public
*/
const registerUser = async (req, res) => {
    const { name, email, password, role, institution } = req.body;

    if (!name || !email || !password || !role) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // Create User
    const user = await User.create({
        name,
        email,
        password,
        role,
    });

    if (user) {
        // If Student, create Student Profile
        if (role === 'student') {
            await Student.create({
                user: user._id,
                institution: institution || 'Unknown Institution',
            });
        } else if (role === 'investor') {
            await Investor.create({
                user: user._id,
                companyName: req.body.companyName || 'Independent',
                kycStatus: 'NOT_SUBMITTED'
            });
        }

        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};

/*
  @desc   Authenticate a user
  @route  POST /api/auth/login
  @access Public
*/
const loginUser = async (req, res) => {
    const { email, password, role } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    // Validate Password
    if (!user || !(await user.matchPassword(password))) {
        return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Validate Role (Strict Check)
    if (role && user.role !== role) {
        return res.status(401).json({
            message: `Role Validation Failed: Account is registered as '${user.role}', not '${role}'.`
        });
    }

    res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
    });
};

/*
  @desc   Get user data
  @route  GET /api/auth/me
  @access Private
*/
const getMe = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports = {
    registerUser,
    loginUser,
    getMe,
};
