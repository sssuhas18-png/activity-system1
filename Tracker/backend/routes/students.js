const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// CREATE STUDENT (ADMIN ONLY)
router.post('/', protect, isAdmin, async (req, res) => {
    try {
        const { usn, name, email, password, role } = req.body;

        if (!usn || !name || !email || !password) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const normalizedUsn = usn.toUpperCase();
        const existing = await Student.findOne({ $or: [{ email: email.toLowerCase() }, { usn: normalizedUsn }] });

        if (existing) {
            return res.status(409).json({ error: 'Student with given email or USN already exists' });
        }

        const student = new Student({
            usn: normalizedUsn,
            name,
            email: email.toLowerCase(),
            password,
            role: role || 'student',
        });

        await student.save();

        return res.status(201).json({
            message: 'Student created successfully',
            student: {
                id: student._id,
                usn: student.usn,
                name: student.name,
                email: student.email,
                role: student.role,
                total_points: student.total_points,
            },
        });
    } catch (error) {
        console.error('Create student error:', error);
        return res.status(500).json({ error: error.message });
    }
});

// GET ALL STUDENTS (ADMIN ONLY)
router.get('/', protect, isAdmin, async (req, res) => {
    try {
        const students = await Student.find().select('-password');
        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET SINGLE STUDENT BY USN (STUDENT OR ADMIN)
router.get('/:usn', protect, async (req, res) => {
    try {
        const requestedUsn = req.params.usn.toUpperCase();

        if (req.user.role !== 'admin' && req.user.usn !== requestedUsn) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const student = await Student.findOne({ usn: requestedUsn }).select('-password');

        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.json(student);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
