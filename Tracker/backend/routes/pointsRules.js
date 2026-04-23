const express = require('express');
const router = express.Router();
const PointsRule = require('../models/PointsRule');
const { protect, isAdmin } = require('../middleware/authMiddleware');

// GET ALL POINTS RULES
router.get('/', protect, async (req, res) => {
    try {
        const rules = await PointsRule.find();
        res.json(rules);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CREATE POINTS RULE (ADMIN ONLY)
router.post('/', protect, isAdmin, async (req, res) => {
    try {
        const { activity_type, criteria, points } = req.body;

        if (!activity_type || !criteria || points === undefined) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const rule = new PointsRule({
            activity_type,
            criteria,
            points,
        });

        await rule.save();

        return res.status(201).json({
            message: 'Points rule created successfully',
            rule,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE POINTS RULE (ADMIN ONLY)
router.put('/:id', protect, isAdmin, async (req, res) => {
    try {
        const { points } = req.body;

        if (points === undefined) {
            return res.status(400).json({ error: 'Points value is required' });
        }

        const rule = await PointsRule.findByIdAndUpdate(req.params.id, { points }, { new: true });

        if (!rule) {
            return res.status(404).json({ error: 'Points rule not found' });
        }

        return res.json({
            message: 'Points rule updated successfully',
            rule,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
