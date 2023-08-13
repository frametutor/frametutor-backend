const express = require('express');
const router = express.Router();

const abt_controller = require('../controllers/about_controller');

router.get('/', abt_controller.getAbout);
router.put('/update' , abt_controller.updateAbout);
router.post('/create' , abt_controller.crateAbout);


module.exports = router; 
