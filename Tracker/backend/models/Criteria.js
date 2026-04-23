const mongoose = require('mongoose');

const criteriaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Criteria title is required'],
    trim: true,
  },
  points: {
    type: Number,
    required: [true, 'Points value is required'],
    min: [0, 'Points cannot be negative'],
  },
  activityType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivityType',
    required: [true, 'ActivityType reference is required'],
  }
}, {
  timestamps: true,
});

// A specific criteria title for a specific activity type should be unique
criteriaSchema.index({ title: 1, activityType: 1 }, { unique: true });

module.exports = mongoose.model('Criteria', criteriaSchema);
