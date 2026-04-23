const mongoose = require('mongoose');

const activityTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Activity Type name is required'],
    trim: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('ActivityType', activityTypeSchema);
