const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Institution = require('./src/models/Institution');

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const institutions = await Institution.find();
        console.log('Institutions found:', institutions);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
