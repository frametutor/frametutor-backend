const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course_controller');
const userController = require('../controllers/user_controller');
const { Upload } = require('filestack-js/build/main/lib/api/upload');
const multer = require("multer");

const tmp = require('tmp'); // Add this line


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Use a temporary directory for storing uploads
    const tmpDir = tmp.dirSync();
    cb(null, tmpDir.name);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage });

router.post('/upload-video', upload.single('video') ,courseController.uploadVideo);

router.get('/', courseController.getAllCourses );
router.get('/enrollCourse', courseController.getCourseById );

// router.get('/:userId', userController.fetchUser);
router.post('/create', upload.none(), courseController.createNewCourse);
router.put('/update', courseController.updateCourse);


router.post('/upload-ebook', upload.single('video'), courseController.uploadEbook);

router.get('/download/:videoId',   courseController.downloadVideo);   
router.delete('/delete-video/:handle',   courseController.deleteVideo);   


module.exports = router;

