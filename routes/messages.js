const express = require('express');
const router = express.Router();

const msg_controller = require('../controllers/message_controller');

router.get('/', msg_controller.getAllMessages);
router.post('/send' , msg_controller.sendMessage);

module.exports = router;
