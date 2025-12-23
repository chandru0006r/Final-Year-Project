const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        required: true
    },
    type: {
        type: String,
        enum: ['text', 'poll'],
        default: 'text'
    },
    pollDetails: {
        targetAmount: Number,
        collectedAmount: {
            type: Number,
            default: 0
        },
        contributors: [{
            user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            amount: Number,
            contributedAt: { type: Date, default: Date.now }
        }]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const communitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    messages: [messageSchema],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Community', communitySchema);
