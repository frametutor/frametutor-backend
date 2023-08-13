const express = require('express');
const router = express.Router();

const noti_controller = require('../controllers/notification_controller');

router.get('/', noti_controller.getAllNotifications);
router.post('/send' , noti_controller.sendNotification);

module.exports = router; 
