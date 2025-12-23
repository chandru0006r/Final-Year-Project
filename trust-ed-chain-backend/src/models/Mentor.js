const mongoose = require('mongoose');

const mentorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    institution: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Institution', // Mentor belongs to a college
    },
    specialization: {
        type: String,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student', // List of assigned students
    }],
    isApprovedByAdmin: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Mentor', mentorSchema);
