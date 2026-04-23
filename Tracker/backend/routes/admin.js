const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// @route   GET /api/admin/admins
// @desc    Get all admins (proctors)
// @access  Private (Admin only)
router.get('/admins', protect, isAdmin, async (req, res) => {
    try {
        const admins = await Student.find({ role: 'admin' }).select('-password');
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   POST /api/admin/assign-student
// @desc    Assign a student to a proctor
// @access  Private (Admin only)
router.post('/assign-student', protect, isAdmin, async (req, res) => {
    try {
        const { studentId, proctorId } = req.body;

        if (!studentId || !proctorId) {
            return res.status(400).json({ error: 'Both studentId and proctorId are required' });
        }

        // Validate roles
        const student = await Student.findById(studentId);
        const proctor = await Student.findById(proctorId);

        if (!student || student.role !== 'student') {
            return res.status(400).json({ error: 'Invalid student ID or user is not a student' });
        }

        if (!proctor || proctor.role !== 'admin') {
            return res.status(400).json({ error: 'Invalid proctor ID or user is not an admin' });
        }

        // Assign proctor
        student.proctor = proctorId;
        await student.save();

        res.json({ message: 'Proctor assigned successfully', student });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/admin/students
// @desc    Get all students with search & filter
// @access  Private (Admin only)
router.get('/students', protect, isAdmin, async (req, res) => {
    try {
        const { search, proctorId } = req.query;
        let query = { role: 'student' };

        // Handle Search
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [
                { name: searchRegex },
                { email: searchRegex },
                { usn: searchRegex }
            ];
        }

        // Handle Filtering
        if (proctorId) {
            if (proctorId === 'unassigned') {
                query.proctor = { $exists: false };
            } else {
                query.proctor = proctorId;
            }
        }

        const students = await Student.find(query)
            .select('-password')
            .populate('proctor', 'name email usn _id');

        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/admin/my-students
// @desc    Get students under logged-in proctor
// @access  Private (Admin only)
router.get('/my-students', protect, isAdmin, async (req, res) => {
    try {
        const students = await Student.find({ role: 'student', proctor: req.user._id })
            .select('-password')
            .populate('proctor', 'name email usn _id');

        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// @route   GET /api/admin/grouped-students
// @desc    Group students by proctor
// @access  Private (Admin only)
router.get('/grouped-students', protect, isAdmin, async (req, res) => {
    try {
        const students = await Student.find({ role: 'student' })
            .populate('proctor', 'name email usn _id')
            .select('-password');

        // Grouping locally
        const grouped = {};

        students.forEach(student => {
            const proctorId = student.proctor ? student.proctor._id.toString() : 'unassigned';

            if (!grouped[proctorId]) {
                grouped[proctorId] = {
                    proctor: student.proctor || { name: 'Unassigned', _id: 'unassigned' },
                    students: []
                };
            }
            grouped[proctorId].students.push(student);
        });

        res.json(Object.values(grouped));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
