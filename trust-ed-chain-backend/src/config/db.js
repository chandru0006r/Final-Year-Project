const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // Clear Database on Startup (As requested)
    console.log('Dropping database to recreate fresh state...');
    await conn.connection.db.dropDatabase();
    console.log('Database dropped and ready.');
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
