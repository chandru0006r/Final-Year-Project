const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Student = require('../models/Student');
const Mentor = require('../models/Mentor');
const Institution = require('../models/Institution');
const Investor = require('../models/Investor');
const Loan = require('../models/Loan');
const Community = require('../models/Community');

const seedData = async () => {
    try {
        // 1. Create Admin User First
        const adminUser = await User.create({
            name: 'Super Admin',
            email: 'admin@test.com',
            password: 'password123',
            role: 'admin',
        });

        // 2. Create Institution (College) linked to Admin
        const college = await Institution.create({
            name: 'Tech University',
            adminUser: adminUser._id, // Linked to the real admin
            address: '123 Education Lane',
            website: 'www.techuni.edu',
            isVerified: true,
        });
        console.log('✅ Institution created');

        // 3. Create Other Users (Mentor, Student, Investor)
        // Passwords will be hashed by pre-save hook in User model
        const mentorUser = await User.create({
            name: 'Dr. Smith',
            email: 'mentor@test.com',
            password: 'password123',
            role: 'mentor',
        });

        const studentUser = await User.create({
            name: 'John Doe',
            email: 'student@test.com',
            password: 'password123',
            role: 'student',
        });

        const investorUser = await User.create({
            name: 'Angel Alice',
            email: 'investor@test.com',
            password: 'password123',
            role: 'investor',
        });
        console.log('✅ Users created');

        // 3. Create Mentor Profile
        const mentorProfile = await Mentor.create({
            user: mentorUser._id,
            institution: college._id,
            specialization: 'Computer Science',
            isApprovedByAdmin: true,
        });
        console.log('✅ Mentor Profile created');

        // 4. Create Student Profile
        const studentProfile = await Student.create({
            user: studentUser._id,
            mentor: mentorProfile._id, // Assigned to Dr. Smith
            institution: college._id,  // Belongs to Tech Uni
            cgpa: 3.8,
            trustScore: 100,
            microLoanLimit: 5000,
        });
        console.log('✅ Student Profile created');

        // Update mentor with student
        mentorProfile.students.push(studentProfile._id);
        await mentorProfile.save();

        // 5. Create Investor Profile
        await Investor.create({
            user: investorUser._id,
            companyName: 'Future Ventures',
            investmentCapacity: 100000,
            kycStatus: 'VERIFIED',
        });
        console.log('✅ Investor Profile created');

        // 6. Create Loans
        // Micro Loan (Auto-Approved)
        await Loan.create({
            student: studentProfile._id,
            amount: 2000,
            purpose: 'Textbooks',
            type: 'MICRO',
            status: 'APPROVED',
            approvedByMentor: true,
            approvedByAdmin: true,
        });

        // Macro Loan (Pending)
        await Loan.create({
            student: studentProfile._id,
            amount: 50000,
            purpose: 'Laptop',
            type: 'MACRO',
            status: 'PENDING_MENTOR',
        });
        console.log('✅ Loans created');

        // 7. Create Communities (Students Only)
        await Community.create({
            name: 'Web Development',
            description: 'A space for React, Node, and Web enthusiasts.',
            createdBy: studentUser._id,
            members: [studentUser._id],
            messages: [{
                sender: studentUser._id,
                text: 'Welcome to the Web Dev community!',
                createdAt: new Date()
            }]
        });
        await Community.create({
            name: 'AI & Machine Learning',
            description: 'Discussing the future of AI.',
            createdBy: studentUser._id,
            members: [studentUser._id]
        });
        console.log('✅ Communities created');

        console.log('🌱 Database Seeded Successfully!');
    } catch (error) {
        console.error('Error seeding data:', error);
    }
};

module.exports = seedData;
