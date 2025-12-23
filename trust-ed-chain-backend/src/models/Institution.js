const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    adminUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // The college admin login
        required: true,
    },
    address: {
        type: String,
    },
    website: {
        type: String,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Institution', institutionSchema);
