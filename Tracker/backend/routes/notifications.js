const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const { protect } = require('../middleware/authMiddleware');

// GET NOTIFICATIONS FOR A STUDENT
router.get('/:usn', protect, async (req, res) => {
    try {
        const requestedUsn = req.params.usn.toUpperCase();

        // Allow students to see their own notifications or admins to see any
        if (req.user.role !== 'admin' && req.user.usn !== requestedUsn) {
            return res.status(403).json({ error: 'Access denied' });
        }

        const notifications = await Notification.find({ usn: requestedUsn }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET ADMIN NOTIFICATIONS
router.get('/', protect, async (req, res) => {
    try {
        // Only admins can get general notifications
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const notifications = await Notification.find({ usn: 'ADMIN' }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
