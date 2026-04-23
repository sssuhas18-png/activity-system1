const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  usn: {
    type: String,
    required: [true, 'USN is required'],
    uppercase: true,
    trim: true,
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
  },
  type: {
    type: String,
    enum: ['submission', 'approval', 'rejection', 'info'],
    default: 'info',
  },
  is_read: {
    type: Boolean,
    default: false,
  },
  submission_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Submission',
    default: null,
  },
}, {
  timestamps: true,
});

// Index for faster queries
notificationSchema.index({ usn: 1, createdAt: -1 });

module.exports = mongoose.model('Notification', notificationSchema);
