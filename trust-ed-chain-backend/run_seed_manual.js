const mongoose = require('mongoose');
const dotenv = require('dotenv');
const seedData = require('./src/utils/seeder');

dotenv.config();

const run = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');
    const User = require('./src/models/User');
    const Institution = require('./src/models/Institution');
    const Student = require('./src/models/Student');
    const Mentor = require('./src/models/Mentor');
    const Community = require('./src/models/Community');
    const Loan = require('./src/models/Loan');
    const seedScale = require('./seed_scale');
    const seedLoans = require('./seed_loans');

    // Clean all
    await User.deleteMany({ email: { $regex: /@test\.com$/ } });
    await Institution.deleteMany({ name: 'Tech University' });
    await Student.deleteMany({});
    await Mentor.deleteMany({});
    await Community.deleteMany({});
    await Loan.deleteMany({}); // Ensure no stale loans

    console.log('🌱 Starting Basic Seed...');
    await seedData();
    console.log('🚀 Starting Scale Seed (50 Students)...');
    await seedScale(); 
    console.log('💰 Starting Loan Seed...');
    await seedLoans();

    console.log('✅ ALL SEEDS COMPLETED SUCCESSFULLY');
    process.exit();
};

run();
