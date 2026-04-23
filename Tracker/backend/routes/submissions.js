const express = require('express');
const router = express.Router();
const Submission = require('../models/Submission');
const Student = require('../models/Student');
const PointsRule = require('../models/PointsRule');
const Notification = require('../models/Notification');
const { protect, isAdmin } = require('../middleware/authMiddleware');
const fs = require('fs');
const path = require('path');
const { IncomingForm } = require('formidable');

// GET ALL SUBMISSIONS (ADMIN)
router.get('/', protect, isAdmin, async (req, res) => {
    try {
        const submissions = await Submission.find();
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST NEW SUBMISSION (STUDENT)
router.post('/', protect, async (req, res) => {
    const user = req.user;

    const form = new IncomingForm({ keepExtensions: true });

    form.parse(req, async (err, fields, files) => {
        if (err) {
            return res.status(500).json({ error: 'Upload error' });
        }

        try {
            const usn = user.usn;
            const activity_type = Array.isArray(fields.activity_type) ? fields.activity_type[0] : fields.activity_type;
            const criteria = Array.isArray(fields.criteria) ? fields.criteria[0] : fields.criteria;
            const file = Array.isArray(files.file) ? files.file[0] : files.file;

            if (!activity_type || !criteria || !file) {
                return res.status(400).json({ error: 'Missing required fields with proof file.' });
            }

            const uploadFolder = path.join(__dirname, '../uploads', usn);
            if (!fs.existsSync(uploadFolder)) {
                fs.mkdirSync(uploadFolder, { recursive: true });
            }

            const newFilename = file.originalFilename || `${Date.now()}_${file.newFilename}`;
            const newPath = path.join(uploadFolder, newFilename);
            fs.renameSync(file.filepath, newPath);

            const proofUrl = `/uploads/${usn}/${newFilename}`;

            const submission = new Submission({
                usn,
                activity_type,
                criteria,
                proof_url: proofUrl,
                status: 'pending',
            });

            // Prevent Duplicate Submissions (Strict Mode: approved and pending)
            const existingSubmission = await Submission.findOne({
                usn,
                activity_type,
                criteria,
                status: { $in: ['pending', 'approved'] }
            });

            if (existingSubmission) {
                if (existingSubmission.status === 'approved') {
                    return res.status(400).json({ error: 'You have already claimed points for this activity.' });
                } else {
                    return res.status(400).json({ error: 'You already have a pending submission for this activity.' });
                }
            }

            await submission.save();

            await Notification.create({
                usn: 'ADMIN',
                message: `New submission from ${usn}`,
                type: 'submission',
            });

            return res.status(201).json({ message: 'Submission created', submission });
        } catch (error) {
            console.error('Submission create error:', error);
            return res.status(500).json({ error: error.message });
        }
    });
});

// GET SUBMISSIONS BY STUDENT USN (STUDENT OR ADMIN)
router.get('/student/:usn', protect, async (req, res) => {
    try {
        const requestedUsn = req.params.usn.toUpperCase();

        // Allow students to see their own submissions or admins to see any
        if (req.user.role !== 'admin' && req.user.usn !== requestedUsn) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const submissions = await Submission.find({ usn: requestedUsn });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET SUBMISSIONS BY STUDENT USN (ALIAS FOR BONUS)
router.get('/user/:usn', protect, async (req, res) => {
    try {
        const requestedUsn = req.params.usn.toUpperCase();

        if (req.user.role !== 'admin' && req.user.usn !== requestedUsn) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const submissions = await Submission.find({ usn: requestedUsn });
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET PENDING SUBMISSIONS (ADMIN)
router.get('/pending', protect, isAdmin, async (req, res) => {
    try {
        // Find students assigned to this proctor or unassigned
        const allowedStudents = await Student.find({
            $or: [
                { proctor: req.user._id },
                { proctor: { $exists: false } },
                { proctor: null }
            ]
        }).select('usn');
        
        const allowedUsns = allowedStudents.map(s => s.usn);

        const submissions = await Submission.find({ 
            status: 'pending',
            usn: { $in: allowedUsns }
        });
        
        res.json(submissions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// VERIFY submission (ADMIN)
router.put('/verify/:id', protect, isAdmin, async (req, res) => {
    try {
        const { status, remarks } = req.body;

        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const submission = await Submission.findById(req.params.id);
        if (!submission) {
            return res.status(404).json({ error: 'Submission not found' });
        }

        if (submission.status === 'approved') {
            return res.json({ message: 'Already verified' });
        }

        submission.status = status;
        submission.remarks = remarks || '';
        submission.proctor_id = req.user._id;

        if (status === 'approved') {
            const rule = await PointsRule.findOne({
                activity_type: submission.activity_type,
                criteria: submission.criteria
            });

            const student = await Student.findOne({ usn: submission.usn });
            if (student && rule) {
                student.total_points += rule.points;
                await student.save();
                submission.points_awarded = rule.points;
            }

            await Notification.create({
                usn: submission.usn,
                message: 'Your submission has been approved',
                type: 'approval',
            });
        } else {
            await Notification.create({
                usn: submission.usn,
                message: 'Your submission was rejected',
                type: 'rejection',
            });
        }

        await submission.save();

        return res.json({ message: 'Submission updated', submission });
    } catch (err) {
        console.error('Verify submission error:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
