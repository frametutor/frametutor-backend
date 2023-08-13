const Course = require('../models/course');
const fs = require('fs');



// video code
// courseController.js

// const Course = require('../models/course');
const mongoose = require('mongoose');
const crypto = require('crypto');
const multer = require('multer');
// const {client} = require('../server');




// file-Stack
const filestack = require('filestack-js');
const client = filestack.init(process.env.FILESTACKAPI);


const uploadEbook = async (req, res) => { 
  try {
    
      const  video  = req.file; 
      const  format = 'pdf';
      // const courseId = req.body.courseId;

      
  
      // Initialize Filestack client with your API key
      // const client = filestack.init(apiKey);
  
      // Upload the ebook file to Filestack
      // console.log(ebookFile.path);
      const result = await client.upload(video.path);
  
      // Store the Filestack URL or handle in your database for later retrieval
      const fileUrl = result.url;  // URL to access the uploaded ebook file

      fs.unlinkSync(video.path);

    // Assuming you have the course ID from the request body or URL parameters
    // const courseId = '64d3df3ecb876b1a9c1e7b88';

    // Update the Course document in the database with the ebook URL
    
  //   const updatedCourse = await Course.findOneAndUpdate(
  //     { 'ebook.url': fileUrl , 'ebook.format' : format},
  //     { new: true } // Return the updated course after the update operation
  // );

  const course = await Course.findOne();

  

    course.ebook = { 
      url: fileUrl,
      format: format
    }

    // Save the updated course with the new video data
    await course.save();

  
    console.log('Updated Course:', course);

    // Return the file URL or handle to the client
    res.status(200).json({ url: fileUrl, format: format, message: "successfully uploaded"});
  } catch (error) {
    console.error('Error uploading ebook:', error);
    res.status(500).json({ error: 'Error uploading ebook.' });
    console.error('Error uploading ebook:', error);
console.error('Error details:', error.details);

  }
};

const uploadVideo = async (req, res) => {
  try {
    const video = req.file;
    const title = req.body.title;
    
    if (!video) {
      return res.status(400).json({ error: 'No video file provided' });
    }

    // Upload the video to Filestack
    const filelink = await client.upload(video.path);
    const videoUrl = filelink.url;
    const videoHandle = filelink.handle;

    fs.unlinkSync(video.path);


    // Save the video URL and handle to the course schema (assuming you have a Course model)
    // const courseId = '64d3df3ecb876b1a9c1e7b88'; // Replace with the actual course ID
    const course = await Course.findOne();

    course.videos.push({
      videoUrl: videoUrl,
      videoHandle: videoHandle,
      title:title
    });

    // Save the updated course with the new video data
    await course.save();

    // Respond with a success message and the video URL
    res.status(200).json({ message: 'Video uploaded and URL saved successfully', videoUrl });
  } catch (error) {
    console.error('Error uploading video:', error);
    res.status(500).json({ error: 'Failed to upload video' });
  }
};


// // Function to upload a video file and save the URL in the course schema
// const uploadVideo = async (req, res) => {
//   try {
//     // console.log(req.files)
//     const videos = req.files;
//     const videoData = []; // Array to store video information (URLs and handles)

//     // Loop through the uploaded videos and upload them to Filestack
//     for (const video of videos) {
//       const filelink = await client.upload(video.path);
//       const videoInfo = {
//         url: filelink.url,
//         handle: filelink.handle, // Save the handle along with the URL
//       };
//       videoData.push(videoInfo);
//     }

//     // Save the video URLs and handles to the course schema (assuming you have a Course model)
//     const courseId = '64d3df3ecb876b1a9c1e7b88'; // Replace with the actual course ID
//     const course = await Course.findById(courseId);

//     // console.log(course.title);

  

//     // Push the new video data (URLs and handles) into the videos array
//     for (const { url, handle } of videoData) {
//       course.videos.push({
//         videoUrl: url,
//         videoHandle: handle, // Save the handle in the videos array
//       });
//     }

//     // Save the updated course with the new video data
//     await course.save();

//     // Respond with a success message and the list of video URLs
//     res.status(200).json({ message: 'Videos uploaded and URLs saved successfully', videoData });
//   } catch (error) {
//     console.error('Error uploading videos:', error);
//     res.status(500).json({ error: 'Failed to upload videos' });
//   }
// };


const generatePolicyAndSignature = () => {
  // Replace 'YOUR_APP_SECRET' with your actual Filestack app secret
  const appSecret = 'XWKVNM7JXVGD3ETCAG3RTPV4SA';

  const policy = {
    call: ['remove'],
    expiry: Math.floor(Date.now() / 1000) + 60 * 60, // Expiry time in seconds (1 hour from now)
  };

  const policyEncoded = Buffer.from(JSON.stringify(policy)).toString('base64');
  const signature = crypto
    .createHmac('sha256', appSecret)
    .update(policyEncoded)
    .digest('hex');

  return {
    policy: policyEncoded,
    signature: signature,
  };
};

const deleteVideo = async (req, res) => {
  try {
    const handle = req.params.handle; // The handle of the video you want to delete

    // Generate the security policy and signature
    const { policy, signature } = generatePolicyAndSignature();

    // Use the Filestack client to remove the video with the provided security policy and signature
    await client.remove(handle, { policy, signature });

    // Handle the video deletion in your database as well (e.g., remove the video entry from the course schema)
    // ...

    // Respond with a success message
    res.status(200).json({ message: 'Video deleted successfully' });
  } catch (error) {
    console.error('Error deleting video:', error);
    res.status(500).json({ error: 'Failed to delete video' });
  }
};


// const deleteVideo = async (req, res) => {
//   try {
//     const handle = req.params.handle;

//     if (!handle) {
//       return res.status(400).json({ error: 'Video handle is missing in request parameters' });
//     }

//     // Use the Filestack client to remove the video with the provided handle
//     await client.remove(handle);

//     // Handle the video deletion in your database as well (e.g., remove the video entry from the course schema)
//     // ...

//     // Respond with a success message
//     res.status(200).json({ message: 'Video deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting video:', error);
//     res.status(500).json({ error: 'Failed to delete video' });
//   }
// };

const { ObjectId } = require('mongodb'); // Corrected import to ObjectId (lowercase "d")

async function downloadVideo(req, res) {
  try {

    
  } catch (error) {
    console.error('Error downloading video:', error);
    return res.status(500).json({ error: 'Failed to download video' });
  }
}


// video code

const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching courses.', error });
  }
};


const getEnrolledCourse = async (req, res) => {
  try {
    const course = await Course.find('64ce77f0458867c6baf3be2c');
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course.', error });
  }
};

const createNewCourse = async (req, res) => {
    try {
      // Extract course information from the request body
      const {
        title,
        author,
        // description,
        // videos,
        briefs,
        // ebook,
        flashCards,
        multipleChoiceQuestions,
      } = req.body;
  
      console.log(title);
      console.log(author);
      console.log(briefs);
      // console.log(ebook);
      console.log(flashCards);
      console.log(multipleChoiceQuestions);





      // Check if the required fields are provided
      if (!title || !author || !briefs || !flashCards || !multipleChoiceQuestions) {
        return res.status(400).json({ message: 'All fields are required for creating a new course.' });
      }


  
      // Create a new course using the Course model
      const newCourse = new Course({
        title,
        author,
        // description,
        // videos,
        briefs,
        // ebook,
        flashCards,
        multipleChoiceQuestions,
      });
  
      // Save the course to the database
      await newCourse.save();
  
      // Send a success response with the newly created course data
      res.status(201).json({ message: 'New course created successfully.', course: newCourse });
    } catch (error) {
      res.status(500).json({ message: 'Error creating the course.', error });
    }
  };



  const updateCourse = async (req, res) => {
    try {
        // Find the first course in the database
        const firstCourse = await Course.findOne();

        // Check if a course exists
        if (!firstCourse) {
            return res.status(404).json({ message: 'No courses found.' });
        }

        // Extract course information from the request body
        const {
            title,
            author,
            // description,
            // videos,
            briefs,
            // ebook,
            flashCards,
            multipleChoiceQuestions,
        } = req.body;

        // Update the course details
        firstCourse.title = title;
        firstCourse.author = author;
        // firstCourse.description = description;
        // firstCourse.videos = videos;
        firstCourse.briefs = briefs;
        // firstCourse.ebook = ebook;
        firstCourse.flashCards = flashCards;
        firstCourse.multipleChoiceQuestions = multipleChoiceQuestions;

        // Save the updated course to the database
        await firstCourse.save();

        // Send a success response with the updated course data
        res.status(200).json({ message: 'Course details updated successfully.', course: firstCourse });
    } catch (error) {
        res.status(500).json({ message: 'Error updating the course details.', error });
    }
};


// const createNewCourse = async (req, res) => {
//   try {
//     const { 
//       // title,
//       //  briefs, 
//        ebook 
//       } = req.body;
//     const videos = req.files; // Assuming you are using multer to handle video uploads

//     if (
//       // !title 
//       // || !briefs
//         !ebook 
//        ) {
//       console.log('here');
      

//       return res.status(400).json({ message: 'All fields and video files are required for creating a new course.' });
//     }

//     // Array to store the video URLs
//     const videoUrls = [];
 
//     // Loop through the uploaded videos and upload them to Filestack
//     for (const video of videos) {
     
//       const filelink = await client.upload(video.path); // Assuming the file is saved to the 'path' property by multer
//       videoUrls.push(filelink.url);
//     }

//     // Create a new course using the Course model with videoUrls
//     const newCourse = new Course({
//       title,
//       briefs,
//       ebook,
//       videos: videoUrls, // Store the array of video URLs in the 'videos' field of the course schema
//     });

//     // Save the course to the database
//     await newCourse.save();

//     // Send a success response with the newly created course data
//     res.status(201).json({ message: 'New course created successfully.', course: newCourse });
//   } catch (error) {
//     res.status(500).json({ message: 'Error creating the course.', error });
//   }
// };


const getCourseById = async (req, res) => {
  // const { courseId } = req.params;
  try {
    const course = await Course.findOne();
    if (!course) {
      return res.status(404).json({ message: 'Course not found.' });
    }
    res.status(200).json(course);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching course.', error });
  }
};

// Add other controller functions (createCourse, updateCourse, deleteCourse, etc.) as needed

module.exports = {
    createNewCourse,
  getAllCourses,
  getCourseById,
  uploadVideo,
  deleteVideo,
  downloadVideo,
  getEnrolledCourse,
  uploadEbook,
  updateCourse
  // Export other controller functions here
};
