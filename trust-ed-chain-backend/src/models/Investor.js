const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    companyName: {
        type: String,
    },
    investmentCapacity: {
        type: Number, // Max amount willing to invest
    },
    kycStatus: {
        type: String,
        enum: ['PENDING', 'VERIFIED', 'REJECTED', 'NOT_SUBMITTED'],
        default: 'NOT_SUBMITTED',
    },
    kycDocuments: [{
        type: String,
    }],
    portfolio: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Loan', // Funded loans
    }],
});

module.exports = mongoose.model('Investor', investorSchema);
