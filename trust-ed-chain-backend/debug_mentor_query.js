const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Student = require('./src/models/Student');
const Mentor = require('./src/models/Mentor');
const User = require('./src/models/User');

dotenv.config();

const debugQuery = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to DB');

        const email = 'mentor.mechanical@test.com';
        console.log(`\n🔍 Looking for User: ${email}`);
        
        const user = await User.findOne({ email });
        if (!user) {
            console.log('❌ User not found!');
            process.exit(1);
        }
        console.log(`✅ User Found: ${user.name} (ID: ${user._id})`);

        console.log(`\n🔍 resolving Mentor Profile for User ID: ${user._id}`);
        const mentorProfile = await Mentor.findOne({ user: user._id });
        
        if (!mentorProfile) {
            console.log('❌ Mentor Profile NOT FOUND for this user.');
            process.exit(1);
        }
        console.log(`✅ Mentor Profile Found (ID: ${mentorProfile._id})`);
        console.log(`   Internal Student List Size: ${mentorProfile.students.length}`);

        console.log(`\n🔍 Querying Students with query: { mentor: '${mentorProfile._id}' }`);
        const students = await Student.find({ mentor: mentorProfile._id });
        
        console.log(`✅ Students Found via Query: ${students.length}`);
        
        if (students.length === 0) {
            console.log('⚠️ Mismatch! Mentor has students in list, but Student models do not point back to Mentor?');
            console.log(`   Mentor ID used in query: ${mentorProfile._id} (Type: ${typeof mentorProfile._id})`);
            
            console.log('   Checking one student from mentor list...');
            if (mentorProfile.students.length > 0) {
                const sId = mentorProfile.students[0];
                const s = await Student.findById(sId);
                if (s) {
                    console.log(`   Student ${sId}:`);
                    console.log(`   - Mentor field: ${s.mentor} (Type: ${typeof s.mentor})`);
                    console.log(`   - Strings Match? ${String(s.mentor) === String(mentorProfile._id)}`);
                } else {
                    console.log(`   Student ${sId} NOT FOUND in DB.`);
                }
            } else {
                console.log('   Mentor has NO students in array either? Then why did user see count 10? Maybe user is wrong or I am checking wrong mentor.');
            }
        } else {
            console.log('sample student:', students[0].registerNumber);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

debugQuery();
