const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const { protect } = require('../middleware/authMiddleware');

// GET LEADERBOARD (TOP STUDENTS BY POINTS)
router.get('/', protect, async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 50;
        const leaderboard = await Student.find()
            .select('name usn total_points email')
            .sort({ total_points: -1 })
            .limit(limit);

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
