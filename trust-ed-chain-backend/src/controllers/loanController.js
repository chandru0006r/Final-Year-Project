const Loan = require('../models/Loan');
const Student = require('../models/Student');

/*
  @desc   Apply for a loan
  @route  POST /api/loans/apply
  @access Private (Student only)
*/
const applyLoan = async (req, res) => {
    try {
        const { amount, purpose, type, documents } = req.body;

        // 1. Get Student Profile
        const student = await Student.findOne({ user: req.user.id });
        if (!student) {
            return res.status(404).json({ message: 'Student profile not found' });
        }

        let status = 'PENDING_MENTOR';
        let approvedByMentor = false;
        let approvedByAdmin = false;

        // 2. Logic for MICRO vs MACRO
        if (type === 'MICRO') {
            if (amount <= student.microLoanLimit) {
                // "get without any approvals within the justified amount"
                // Auto-approve effectively means it skips manual approval steps
                status = 'APPROVED'; // Ready for funding (or withdrawal if funded by pool)
                approvedByMentor = true; // Auto-assume mentor permitted this limit
                approvedByAdmin = true;  // Small amounts don't need admin
            } else {
                return res.status(400).json({
                    message: `Micro loan amount exceeds your limit of ${student.microLoanLimit}`
                });
            }
        } else if (type === 'MACRO') {
            // Macro loans go to Mentor first
            status = 'PENDING_MENTOR';
        } else {
            return res.status(400).json({ message: 'Invalid loan type. Must be MICRO or MACRO' });
        }

        // 3. Create Loan
        const loan = await Loan.create({
            student: student._id,
            amount,
            purpose,
            type,
            status,
            documents,
            approvedByMentor,
            approvedByAdmin,
        });

        res.status(201).json(loan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
  @desc   Get all loans (with filters)
  @route  GET /api/loans
  @access Private
*/
const getLoans = async (req, res) => {
    try {
        const { type, status } = req.query;
        let query = {};

        if (type) query.type = type;
        if (status) query.status = status;

        // If Student, only own loans
        if (req.user.role === 'student') {
            const student = await Student.findOne({ user: req.user.id });
            if (student) query.student = student._id;
        }
        // If Mentor, only assigned students? (For now, all loans or filter later)

        // Populate student details
        const loans = await Loan.find(query).populate({
            path: 'student',
            populate: [
                { path: 'user', select: 'name email' },
                { path: 'mentor', select: 'specialization user', populate: { path: 'user', select: 'name' } }
            ]
        });

        res.json(loans);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
  @desc   Mentor Approves Loan
  @route  POST /api/loans/mentor-approve
  @access Private (Mentor)
*/
const mentorApproveLoan = async (req, res) => {
    try {
        const { loanId } = req.body;
        const loan = await Loan.findById(loanId);

        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        if (loan.status !== 'PENDING_MENTOR') {
            return res.status(400).json({ message: 'Loan is not pending mentor approval' });
        }

        loan.approvedByMentor = true;
        // Move to Admin Approval for Macro logic
        loan.status = 'PENDING_ADMIN';
        await loan.save();

        res.json(loan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
  @desc   Admin Approves Loan
  @route  POST /api/loans/admin-approve
  @access Private (Admin)
*/
const adminApproveLoan = async (req, res) => {
    try {
        const { loanId } = req.body;
        const loan = await Loan.findById(loanId);

        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        // Allow jumping queue if needed, but typically follows mentor
        if (loan.status !== 'PENDING_ADMIN' && loan.status !== 'PENDING_MENTOR') {
            // Flexible: Admins can approve anything, but let's warn if strictly sequential
        }

        loan.approvedByAdmin = true;
        loan.status = 'APPROVED'; // Ready for funding
        await loan.save();

        res.json(loan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
  @desc   Investor Funds Loan
  @route  POST /api/loans/fund
  @access Private (Investor)
*/
const fundLoan = async (req, res) => {
    try {
        const { loanId } = req.body;
        const loan = await Loan.findById(loanId);

        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }

        if (loan.status !== 'APPROVED') {
            return res.status(400).json({ message: 'Loan is not approved for funding' });
        }

        loan.investor = req.user.id;
        loan.status = 'FUNDED';
        loan.fundedAt = Date.now();
        await loan.save();

        // TODO: Update Student Balance? Or Blockchain trigger?

        res.json(loan);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    applyLoan,
    getLoans,
    mentorApproveLoan,
    adminApproveLoan,
    fundLoan,
};
