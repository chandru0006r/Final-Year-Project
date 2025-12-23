const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Mentor', // Reference to the Mentor Profile
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution',
        required: true,
    },
    cgpa: {
        type: Number,
        default: 0.0,
    },
    trustScore: {
        type: Number,
        default: 100, // Starting trust score
    },
    sefBalance: {
        type: Number,
        default: 0, // Student Emergency Fund balance
    },
    microLoanLimit: {
        type: Number,
        default: 5000, // Default limit, can be updated by mentor
    },
    isKycVerified: {
        type: Boolean,
        default: false,
    },
    // track SEF withdrawals separately if needed, or just transaction logs
});

module.exports = mongoose.model('Student', studentSchema);
