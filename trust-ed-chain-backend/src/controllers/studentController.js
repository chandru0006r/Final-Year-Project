const Student = require('../models/Student');
const User = require('../models/User');

/*
  @desc   Get Student Profile by ID
  @route  GET /api/student/:id
  @access Private
*/
const getStudentProfile = async (req, res) => {
    try {
        const studentId = req.params.id;

        // Check permissions ? (Student can see own, Mentor/Admin can see all)

        const student = await Student.findOne({ _id: studentId }).populate('user', 'name email role');

        if (!student) {
            // Try finding by User ID if the param is actually a user ID (common confusion)
            const studentByUser = await Student.findOne({ user: studentId }).populate('user', 'name email role');
            if (studentByUser) {
                return res.json(studentByUser);
            }
            return res.status(404).json({ message: 'Student profile not found' });
        }

        res.json(student);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/*
  @desc   Get All Students (Mentor View)
  @route  GET /api/students
  @access Private (Mentor/Admin)
*/
const getStudents = async (req, res) => {
    try {
        const { mentorId } = req.query;
        let query = {};

        if (mentorId) {
            // If query has mentorId, filter by it. 
            // Note: We need to implement mentor assignment logic first to make this useful.
            // For now, assuming 'mentor' field in Student model matches.

            // Find mentor user first to get their ID if needed, 
            // but schema stores 'mentor' as User ObjectId.
            query.mentor = mentorId;
        }

        const students = await Student.find(query).populate('user', 'name email');
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getStudentProfile,
    getStudents,
};
