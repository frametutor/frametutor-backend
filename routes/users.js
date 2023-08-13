const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

router.get('/', userController.getAllUsers);
router.post('/find/user', userController.getUserByEmail);
router.get('/:videoIndex/watchTime', userController.fetchWatchTime);
router.get('/Complete/Status', userController.getCompleteStatus);
router.put('/watchTime/update', userController.updateWatchTime);
router.put('/video/Completed', userController.updateVideoCompleted);
// router.get('/:userId', userController.fetchUser);
router.post('/signUp', userController.createUser);
router.post('/signIn', userController.signInUser);
router.post('/home/enroll', userController.enrollCourse);
router.put('/update/score', userController.updateMcqsScore);
router.put('/update/card', userController.updateFlashcardMastered);





module.exports = router;
