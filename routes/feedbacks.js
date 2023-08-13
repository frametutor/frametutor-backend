const express = require('express');
const router = express.Router();

const feed_controller = require('../controllers/feedback_controller');

router.get('/', feed_controller.getAllFeedback);
router.post('/send' , feed_controller.sendFeedback);

module.exports = router;