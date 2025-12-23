const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Student = require('./src/models/Student');
const Mentor = require('./src/models/Mentor');
const Loan = require('./src/models/Loan');

dotenv.config();

const seedLoans = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // Clean up old pending loans to avoid duplicates if re-run (optional)
        // await Loan.deleteMany({ status: 'PENDING_ADMIN' });

        const students = await Student.find();
        const mentors = await Mentor.find();

        if (students.length === 0 || mentors.length === 0) {
            console.log('No students or mentors found. Run main seeder first.');
            process.exit(1);
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

            // Assign a mentor if not assigned, just for logical consistency in test data
            // (In real app, student has one mentor, but for seeding we might reuse)

            await Loan.create({
                student: student._id,
                amount: data.amount,
                purpose: data.purpose,
                type: data.type,
                status: 'PENDING_ADMIN', // Directly ready for admin to see
                approvedByMentor: true,
                createdAt: data.date
            });
            console.log(`Created Loan: ${data.purpose} for ₹${data.amount}`);
        }

        console.log('✅ Loan Seeding Completed');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedLoans();
