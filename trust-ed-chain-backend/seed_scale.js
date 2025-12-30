const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs'); // Needed to hash passwords if we bypass User model hook (but using User.create triggers it usually, wait, User model has pre-save? Let's check. Assuming yes or standard create.)
// Actually, better to just use the Models.
const User = require('./src/models/User');
const Student = require('./src/models/Student');
const Mentor = require('./src/models/Mentor');
const Institution = require('./src/models/Institution');

dotenv.config();

const DEPARTMENTS = ['Computer Science', 'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering', 'Business Administration'];

const seedScale = async (isStandalone = false) => {
    try {
        if (isStandalone) {
            await mongoose.connect(process.env.MONGO_URI);
            console.log('Connected to DB');
            
            console.log('🧹 Cleaning up old seed data...');
            await Student.deleteMany({});
            await Mentor.deleteMany({});
            await User.deleteMany({ email: { $regex: /@test\.com$/ } });
            // Keep Institution and Admin ideally, or find them. 
            // Previous code finds Institution.
        }

        // 1. Find Institution (Grab the first one)
        let institution = await Institution.findOne({ name: 'Tech University' });
        if (!institution) {
            console.log('⚠️ Specific name match failed. Picking first available institution...');
            institution = await Institution.findOne({});
        }

        if (!institution) {
            console.log('❌ No Institution found in DB. Run "npm run seed" first.');
            if (isStandalone) process.exit(1);
            return;
        }

        console.log(`🏫 Seeding into: ${institution.name}`);

        // 1. Create 5 Mentors (1 per Dept)
        const mentors = [];
        for (const dept of DEPARTMENTS) {
            const email = `mentor.${dept.split(' ')[0].toLowerCase()}@test.com`;

            // Check if exists
            let user = await User.findOne({ email });
            let mentor = null;

            if (!user) {
                user = await User.create({
                    name: `Dr. ${dept} Lead`,
                    email,
                    password: '123',
                    role: 'mentor'
                });
                console.log(`Created User: ${user.name}`);
            }

            mentor = await Mentor.findOne({ user: user._id });
            if (!mentor) {
                mentor = await Mentor.create({
                    user: user._id,
                    institution: institution._id,
                    specialization: dept,
                    isApprovedByAdmin: true
                });
                console.log(`Created Mentor Profile: ${dept}`);
            }
            mentors.push(mentor);
        }

        // 2. Create 50 Students
        const studentsCreated = [];
        for (let i = 1; i <= 50; i++) {
            const email = `student.scale.${i}@test.com`;

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('123', salt);

            // UPSERT User
            user = await User.findOneAndUpdate(
                { email },
                {
                    $setOnInsert: {
                        name: `Student Scale ${i}`,
                        password: hashedPassword,
                        role: 'student'
                    }
                },
                { upsert: true, new: true }
            );

            // Assign random mentor
            const randomMentor = mentors[Math.floor(Math.random() * mentors.length)];

            // UPSERT Student
            let student = await Student.findOneAndUpdate(
                { registerNumber: `REG2024${i.toString().padStart(3, '0')}` },
                {
                    $set: {
                        user: user._id,
                        institution: institution._id,
                        mentor: randomMentor._id,
                        cgpa: (Math.random() * (4.0 - 2.0) + 2.0).toFixed(1),
                        trustScore: Math.floor(Math.random() * (100 - 80) + 80),
                        sefBalance: Math.floor(Math.random() * 5000) + 500,
                        microLoanLimit: 5000,
                        isKycVerified: Math.random() > 0.3, // Random KYC
                        mentorRemarks: [{ text: 'Welcome to the platform! Keep up the good work.', date: new Date() }],
                        trustBreakdown: {
                            paymentHistory: 30,
                            academicPerformance: 40,
                            endorsements: 10,
                            platformActivity: 20
                        }
                    }
                },
                { upsert: true, new: true }
            );

            // Add to mentor's list
            if (!randomMentor.students.includes(student._id)) {
                randomMentor.students.push(student._id);
            }
            studentsCreated.push(student);
        }

        // Save updated mentors
        for (const m of mentors) {
            await m.save();
        }

        console.log(`✅ Created/Verified 5 Mentors`);
        console.log(`✅ Created/Verified 50 Students and assigned them.`);
        
        if (isStandalone) process.exit();
    } catch (error) {
        console.error('Error seeding scale data:', error);
        if (isStandalone) process.exit(1);
    }
};

if (require.main === module) {
    seedScale(true);
} else {
    module.exports = seedScale;
}
