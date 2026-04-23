const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  usn: {
    type: String,
    required: [true, 'USN is required'],
    uppercase: true,
    trim: true,
  },
  activity_type: {
    type: String,
    required: [true, 'Activity type is required'],
  },
  criteria: {
    type: String,
    required: [true, 'Criteria is required'],
  },
  proof_url: {
    type: String,
    required: [true, 'Proof/Certificate is required'],
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  remarks: {
    type: String,
    default: '',
  },
  proctor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null,
  },
  points_awarded: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for faster queries
submissionSchema.index({ usn: 1, status: 1 });
submissionSchema.index({ status: 1 });

module.exports = mongoose.model('Submission', submissionSchema);
