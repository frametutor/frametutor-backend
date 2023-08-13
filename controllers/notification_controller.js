const Notification = require('../models/notification'); // Import the Notification model

const NotificationController = {
  // Method to send a notification
  sendNotification: async (req, res) => {
    try {
      const { content } = req.body;
      
      const newNotification = new Notification({
        content,
      });
      
      await newNotification.save();
      
      res.status(201).json({ message: 'Notification sent successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to send notification' });
    }
  },

  // Method to get all notifications
  getAllNotifications: async (req, res) => {
    try {
      const notifications = await Notification.find().sort({ timestamp: -1 });
      res.status(200).json(notifications);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch notifications' });
    }
  },
};

module.exports = NotificationController;
