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

const seedScale = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        // 1. Find Institution (Grab the first one)
        let institution = await Institution.findOne({ name: 'Tech University' });
        if (!institution) {
            console.log('⚠️ Specific name match failed. Picking first available institution...');
            institution = await Institution.findOne({});
        }

        if (!institution) {
            console.log('❌ No Institution found in DB. Run "npm run seed" first.');
            process.exit(1);
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
                    password: 'password123',
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

            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    name: `Student Scale ${i}`,
                    email,
                    password: 'password123',
                    role: 'student'
                });
            }

            // Assign random mentor
            const randomMentor = mentors[Math.floor(Math.random() * mentors.length)];

            let student = await Student.findOne({ user: user._id });
            if (!student) {
                student = await Student.create({
                    user: user._id,
                    institution: institution._id,
                    mentor: randomMentor._id,
                    cgpa: (Math.random() * (4.0 - 2.0) + 2.0).toFixed(1), // Random CGPA 2.0-4.0
                    trustScore: Math.floor(Math.random() * (100 - 80) + 80), // Random Trust 80-100
                    microLoanLimit: 5000
                });

                // Add to mentor's list
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
        process.exit();
    } catch (error) {
        console.error('Error seeding scale data:', error);
        process.exit(1);
    }
};

seedScale();
