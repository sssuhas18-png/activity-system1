const mongoose = require('mongoose');

const activitySubmissionSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: [true, 'Student is required'],
  },
  activityType: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ActivityType',
    required: [true, 'Activity Type is required'],
  },
  criteria: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Criteria',
    required: [true, 'Criteria is required'],
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL or proof is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  remarks: {
    type: String,
    default: '',
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('ActivitySubmission', activitySubmissionSchema);
