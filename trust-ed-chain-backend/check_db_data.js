const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./src/models/Student');
const Mentor = require('./src/models/Mentor');
const User = require('./src/models/User');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const studentCount = await Student.countDocuments();
        const mentorCount = await Mentor.countDocuments();
        const userCount = await User.countDocuments();

        console.log('--- Counts ---');
        console.log(`Users: ${userCount}`);
        console.log(`Mentors: ${mentorCount}`);
        console.log(`Students: ${studentCount}`);

        console.log('\n--- Sample Mentor ---');
        const mentor = await Mentor.findOne().populate('user');
        if (mentor) {
            console.log(`Name: ${mentor.user.name} (${mentor.user.email})`);
            console.log(`Mentor ID: ${mentor._id}`);
            console.log(`User ID: ${mentor.user._id}`);
            console.log(`Students Assigned: ${mentor.students.length}`);
            console.log(`Sample Student ID in list: ${mentor.students[0]}`);
        } else {
            console.log('No mentors found.');
        }

        console.log('\n--- Sample Student ---');
        const student = await Student.findOne().populate('user').populate('mentor');
        if (student) {
            console.log(`Name: ${student.user.name}`);
            console.log(`Student ID: ${student._id}`);
            console.log(`Register No: ${student.registerNumber}`);
            console.log(`Mentor: ${student.mentor ? student.mentor.specialization : 'Unassigned'}`);
            if (student.mentor) {
               console.log(`Mentor ID (Ref): ${student.mentor._id}`);
            }
        } else {
            console.log('No students found.');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
