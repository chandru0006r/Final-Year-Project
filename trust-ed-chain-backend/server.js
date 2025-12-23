const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./src/config/db');

const seedData = require('./src/utils/seeder');

// Load env vars
dotenv.config();

// Connect to database and seed
const startServer = async () => {
    await connectDB();
    await seedData();
};
startServer();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Basic route
app.get('/', (req, res) => {
    res.send('Trust-Ed-Chain API is running...');
});

// Import Routes (Placeholders for now)
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/student', require('./src/routes/studentRoutes'));
app.use('/api/loans', require('./src/routes/loanRoutes'));
app.use('/api/communities', require('./src/routes/communityRoutes'));
app.use('/api/investor', require('./src/routes/investorRoutes'));
app.use('/api/institution', require('./src/routes/institutionRoutes'));
// app.use('/api/files', require('./src/routes/fileRoutes'));
// app.use('/api/sef', require('./src/routes/sefRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
