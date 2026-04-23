const mongoose = require('mongoose');

const pointsRuleSchema = new mongoose.Schema({
  activity_type: {
    type: String,
    required: [true, 'Activity type is required'],
    trim: true,
  },
  criteria: {
    type: String,
    required: [true, 'Criteria is required'],
    trim: true,
  },
  points: {
    type: Number,
    required: [true, 'Points value is required'],
    min: [0, 'Points cannot be negative'],
  },
  description: {
    type: String,
    default: '',
  },
  is_active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Compound index to ensure unique activity_type + criteria combination
pointsRuleSchema.index({ activity_type: 1, criteria: 1 }, { unique: true });

module.exports = mongoose.model('PointsRule', pointsRuleSchema);
