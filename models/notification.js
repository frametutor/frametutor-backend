const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  username: {
    type: String,
    default: 'admin', // Set default value to "admin"
    required: true,
    
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
