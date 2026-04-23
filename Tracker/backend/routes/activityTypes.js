const express = require('express');
const router = express.Router();
const ActivityType = require('../models/ActivityType');
const Criteria = require('../models/Criteria');
const { protect } = require('../middleware/authMiddleware');

// GET ALL ACTIVITY TYPES
router.get('/', protect, async (req, res) => {
    try {
        const types = await ActivityType.find().sort({ name: 1 });
        res.json(types);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// GET CRITERIA FOR AN ACTIVITY TYPE
router.get('/:activityTypeId/criteria', protect, async (req, res) => {
    try {
        const criteria = await Criteria.find({ activityType: req.params.activityTypeId }).sort({ title: 1 });
        res.json(criteria);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
