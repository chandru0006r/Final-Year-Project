const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    purpose: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['MICRO', 'MACRO'],
        required: true,
    },
    interestRate: {
        type: Number,
        default: 5.0,
    },
    status: {
        type: String,
        enum: ['PENDING_MENTOR', 'PENDING_ADMIN', 'APPROVED', 'FUNDED', 'REJECTED', 'REPAID'],
        default: 'PENDING_MENTOR',
    },
    documents: [
        {
            type: String, // URLs to documents
        },
    ],
    approvedByMentor: {
        type: Boolean,
        default: false,
    },
    approvedByAdmin: {
        type: Boolean,
        default: false,
    },
    investor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Investor who funded it
    },
    fundedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Loan', loanSchema);
