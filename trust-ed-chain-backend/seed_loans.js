const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Student = require('./src/models/Student');
const Mentor = require('./src/models/Mentor');
const Loan = require('./src/models/Loan');

dotenv.config();

const seedLoans = async (isStandalone = false) => {
    try {
        if (isStandalone) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('Connected to DB');
        }

        // Clean up old pending loans to avoid duplicates if re-run (optional)
        // await Loan.deleteMany({ status: 'PENDING_ADMIN' });

        const students = await Student.find();
        const mentors = await Mentor.find();

        if (students.length === 0 || mentors.length === 0) {
            console.log('No students or mentors found. Run main seeder first.');
            if (isStandalone) process.exit(1);
            return;
        }

        const loanData = [
            { amount: 50000, purpose: 'High Performance Laptop', type: 'MACRO', date: new Date('2024-01-15') },
            { amount: 120000, purpose: 'Semester Fees', type: 'MACRO', date: new Date('2024-02-10') },
            { amount: 25000, purpose: 'Research Component', type: 'MACRO', date: new Date('2024-03-05') },
            { amount: 75000, purpose: 'Final Year Project', type: 'MACRO', date: new Date('2024-03-20') },
            { amount: 200000, purpose: 'International Conference', type: 'MACRO', date: new Date('2024-04-01') },
        ];

        for (let i = 0; i < loanData.length; i++) {
            const data = loanData[i];
            const student = students[i % students.length];
            
            // Check if comparable loan exists to avoid duplication spam
            const exists = await Loan.findOne({ student: student._id, purpose: data.purpose, amount: data.amount });
            if (!exists) {
                await Loan.create({
                    student: student._id,
                    amount: data.amount,
                    purpose: data.purpose,
                    type: data.type,
                    interestRate: Math.floor(Math.random() * (12 - 4) + 4), // Random Interest 4-12%
                    status: 'PENDING_MENTOR', // Ready for mentor to see/approve
                    approvedByMentor: false,
                    createdAt: data.date
                });
                console.log(`Created Loan: ${data.purpose} for ₹${data.amount}`);
            }
        }

        console.log('✅ Loan Seeding Completed');
        if (isStandalone) process.exit();
    } catch (error) {
        console.error(error);
        if (isStandalone) process.exit(1);
    }
};

if (require.main === module) {
    seedLoans(true);
} else {
    module.exports = seedLoans;
}
