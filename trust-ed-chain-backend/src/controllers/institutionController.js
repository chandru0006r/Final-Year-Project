const User = require('../models/User');
const Mentor = require('../models/Mentor');
const Student = require('../models/Student');
const Institution = require('../models/Institution');

/*
  @desc   Get Dashboard Data (Mentors & Students)
  @route  GET /api/institution/dashboard
  @access Private (Admin)
*/
const getDashboardData = async (req, res) => {
    try {
        // Find institution managed by this admin
        const institution = await Institution.findOne({ adminUser: req.user.id });
        if (!institution) {
            return res.status(404).json({ message: 'Institution not found for this admin' });
        }

        const mentors = await Mentor.find({ institution: institution._id })
            .populate('user', 'name email role')
            .populate('students', 'name'); // Populate student names count or details

        const students = await Student.find({ institution: institution._id })
            .populate('user', 'name email role')
            .populate('mentor', 'specialization'); // Populate mentor details if assigned

        res.json({
            institution: institution.name,
            mentors,
            students
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
  @desc   Add a new Mentor
  @route  POST /api/institution/add-mentor
  @access Private (Admin)
*/
const addMentor = async (req, res) => {
    try {
        const { name, email, password, specialization } = req.body;

        if (!name || !email || !password || !specialization) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const institution = await Institution.findOne({ adminUser: req.user.id });
        if (!institution) {
            return res.status(404).json({ message: 'Institution not found' });
        }

        // 1. Create User
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'mentor'
        });

        // 2. Create Mentor Profile
        const mentor = await Mentor.create({
            user: user._id,
            institution: institution._id,
            specialization,
            isApprovedByAdmin: true // Auto-approve since admin added them
        });

        res.status(201).json(mentor);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
  @desc   Add a new Student
  @route  POST /api/institution/add-student
  @access Private (Admin)
*/
const addStudent = async (req, res) => {
    try {
        const { name, email, password, cgpa } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all fields' });
        }

        const institution = await Institution.findOne({ adminUser: req.user.id });
        if (!institution) {
            return res.status(404).json({ message: 'Institution not found' });
        }

        // 1. Create User
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'student'
        });

        // 2. Create Student Profile
        const student = await Student.create({
            user: user._id,
            institution: institution._id,
            cgpa: cgpa || 0,
            trustScore: 100, // Default start
            microLoanLimit: 5000
        });

        res.status(201).json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
  @desc   Assign Student to Mentor
  @route  POST /api/institution/assign-student
  @access Private (Admin)
*/
const assignStudent = async (req, res) => {
    try {
        const { studentId, mentorId } = req.body;

        const student = await Student.findById(studentId);
        const mentor = await Mentor.findById(mentorId);

        if (!student || !mentor) {
            return res.status(404).json({ message: 'Student or Mentor not found' });
        }

        // Update Student
        student.mentor = mentor._id;
        await student.save();

        // Update Mentor (Add to list if not present)
        if (!mentor.students.includes(studentId)) {
            mentor.students.push(studentId);
            await mentor.save();
        }

        res.json({ message: 'Assigned successfully', student, mentor });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getDashboardData,
    addMentor,
    addStudent,
    assignStudent
};
