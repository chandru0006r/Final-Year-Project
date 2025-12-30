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

        const student = await Student.findOne({ _id: studentId })
            .populate('user', 'name email role')
            .populate('institution', 'name')
            .populate({ path: 'mentor', populate: { path: 'user', select: 'name' } });

        if (!student) {
            // Try finding by User ID if the param is actually a user ID (common confusion)
            const studentByUser = await Student.findOne({ user: studentId })
                .populate('user', 'name email role')
                .populate('institution', 'name')
                .populate({ path: 'mentor', populate: { path: 'user', select: 'name' } });
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

        console.log(`[getStudents] Request mentorId (User ID): ${mentorId}`);

        if (mentorId) {
            // Check if this ID belongs to a User (Mentor) and get their Mentor Profile ID
            // Using User ID to find Mentor Profile
            const mentorProfile = await require('../models/Mentor').findOne({ user: mentorId });
            
            if (mentorProfile) {
                console.log(`[getStudents] Resolved Mentor Profile ID: ${mentorProfile._id}`);
                query.mentor = mentorProfile._id;
            } else {
                console.log(`[getStudents] Mentor Profile NOT FOUND for User ID: ${mentorId}. Using raw ID.`);
                // Fallback: maybe it was already a mentor profile ID?
                query.mentor = mentorId;
            }
        }

        const students = await Student.find(query)
            .populate('user', 'name email')
            .populate('institution', 'name')
            .populate('mentor', 'specialization');
            
        console.log(`[getStudents] Found ${students.length} students matching query.`);

        // Flatten data for Frontend
        const formattedStudents = students.map(s => ({
            id: s._id,
            name: s.user?.name || 'Unknown',
            email: s.user?.email || 'No Email',
            registerNumber: s.registerNumber,
            department: s.mentor?.specialization || 'Unassigned',
            college: s.institution?.name || 'Unknown',
            cgpa: s.cgpa,
            trustScore: s.trustScore,
            kycVerified: s.isKycVerified,
            mentorRemarks: s.mentorRemarks || [] // Ensure this field exists or handled
        }));

        res.json(formattedStudents);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getStudentProfile,
    getStudents,
};
