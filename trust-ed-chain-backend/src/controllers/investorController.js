const Investor = require('../models/Investor');

/*
  @desc   Update KYC Status (Dummy for now)
  @route  POST /api/investor/kyc-status
  @access Private (Investor Only)
*/
const updateKYCStatus = async (req, res) => {
    try {
        const { status } = req.body; // 'VERIFIED'

        // Find investor profile linked to this user
        let investor = await Investor.findOne({ user: req.user.id });

        if (!investor) {
            // Create one if missing (should exist from seed, but for safety)
            investor = await Investor.create({
                user: req.user.id,
                companyName: 'New Investor Inc',
                investmentCapacity: 0,
                kycStatus: status
            });
        } else {
            investor.kycStatus = status;
            await investor.save();
        }

        res.json(investor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
  @desc   Get Current Investor Profile
  @route  GET /api/investor/me
  @access Private
*/
const getMyProfile = async (req, res) => {
    try {
        const investor = await Investor.findOne({ user: req.user.id });
        if (!investor) return res.status(404).json({ message: 'Investor profile not found' });
        res.json(investor);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    updateKYCStatus,
    getMyProfile
};
