const User = require('../models/user');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const express = require("express");

const app = express();

// Middleware to parse cookies
app.use(cookieParser());

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users.', error });
  }
};

const getUserByEmail = async (req, res) => {
  const { email } = req.body; // Assuming the email is passed in the request body
  
  try {
    const user = await User.findOne({ email }); // Find the user by their email
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json({user : user}); // Return the user if found
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user.', error });
  }
};





const createUser = async (req, res) => {
    try {

      
      // Extract user information from the request body
      const { username, email, password,
         enrolledCourse
         } = req.body;

        //  console.log(enrollCourse);
  
      // Check if the required fields are provided
      if (!username || !email || !password) {
        return res.status(400).json({ message: 'Username, email, and password are required fields.' });
      }
  
      // Check if the user with the same email already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ message: 'User with this email already exists.' });
      }
  
      // Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);

  
      // Create a new user using the User model
      const newUser = new User({ username, email, password: hashedPassword,
         enrolledCourse
       });
  
      // Save the user to the database
      await newUser.save();

      // enrollCourse();


  
      // Send a success response with the newly created user data
      res.status(201).json({ message: 'User created successfully.', user: newUser });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user.', error });
    }
  };
  
  const jwt = require('jsonwebtoken');
const { getCourseById } = require('./course_controller');

  // ... (Other imports and functions)
  
  // User sign-in with JWT generation
  const signInUser = async (req, res) => {
    try {
      // Extract username and password from the request body
      const { email, password } = req.body;
  
      // Check if the required fields are provided
      if (!email || !password) {
        return res.status(400).json({ message: 'email and password are required fields.' });
      }
  
      // Find the user with the provided username
      const user = await User.findOne({ email  });
      // console.log(user.email);
      const  mail =  user.email;
  
      // If the user does not exist, return an error
      if (!mail) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Compare the provided password with the hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
  
      // If the password doesn't match, return an error
      if (!passwordMatch) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }
  
      // Password is correct, user can be authenticated
  
     


  
      // Send the JWT in the response
      res.status(200).json({ message: 'User signed in successfully.', user : user });
      // console.log(token)
    } catch (error) {
      res.status(500).json({ message: 'Error signing in user.', error });
    }
  };



  const enrollCourse = async (req, res) => {
    try {
      // Extract user ID and course ID from the request body
      const { userId, courseId } = req.body;
  
      // Find the user with the provided ID
      const user = await User.findById(userId);
  
      // If the user does not exist, return an error
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }
  
      // Check if the course is already enrolled by the user
      if (user.enrolledCourses.includes(courseId)) {
        return res.status(400).json({ message: 'Course already enrolled by the user.' });
      }
  
      // Add the course ID to the enrolledCourses array
      user.enrolledCourses.push(courseId);
  
      // Save the updated user document
      await user.save();
  
      // Send a success response with the updated user data
      res.status(200).json({ message: 'Course enrolled successfully.', user: user });
    } catch (error) {
      res.status(500).json({ message: 'Error enrolling course.', error });
    }
  };


const updateMcqsScore = async (req, res) => {
  try {
    // Extract user ID and new MCQs score from the request body
    const { userId, newScore } = req.body;

    // Find the user by the provided ID and update the mcqScore property within the enrolledCourse subdocument
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { 'enrolledCourse.mcqScore': newScore },
      { new: true } // Return the updated user after the update operation
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Send a success response with the updated user data
    res.status(200).json({ message: 'MCQs score updated successfully.', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating MCQs score.', error });
  }
};

const updateFlashcardMastered = async (req, res) => {
  try {
    const { userId, flashcardIndex, newMasteredValue } = req.body;

    // Update the isMastered value of the specified flashcard using findByIdAndUpdate
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { [`enrolledCourse.flashCards.${flashcardIndex}.isMastered`]: newMasteredValue } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Send a success response with the updated user data
    res.status(200).json({ message: 'Flashcard mastered value updated successfully.', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating flashcard mastered value.', error });
  }
};

const fetchWatchTime = async (req, res) => {
  try {
    const videoIndex = req.params.videoIndex;
    const userId = req.query.userId;

    // Find the enrolled course for the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user has enrolled in any courses
    if (!user.enrolledCourse || user.enrolledCourse.length === 0) {
      return res.status(404).json({ error: 'User has no enrolled courses' });
    }
    const video = user.enrolledCourse.videos[videoIndex];

    if (!video) {
      return res.status(404).json({ error: 'Video not found in the enrolled course' });
    }

    // Return the watchTime for the video
    res.json({ watchTime: video.watchTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateWatchTime = async (req, res) => {
  try {
    const videoIndex = req.body.videoIndex;
    const userId = req.body.userId;
    const newWatchTime = req.body.watchTime;

    console.log(newWatchTime);

    // Update the watchTime for the selected video index in the user's enrolledCourse
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { [`enrolledCourse.videos.${videoIndex}.watchTime`]: newWatchTime } },
      { new: true }
    );

    // console.log(updatedUser.enrolledCourse.videos.$videoIndex.watchTime);

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return success response
    res.json({ message: 'Watch time updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateVideoCompleted = async (req, res) => {
  try {
    const videoIndex = req.body.videoIndex;
    const userId = req.body.userId;
    const completed = req.body.completed;

    // Find the user by userId and update the completed property
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { [`enrolledCourse.videos.${videoIndex}.completed`]: completed } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Return success response
    res.json({ message: 'Completed status updated successfully', user: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getCompleteStatus=  async (req, res) => {
  const userId = req.query.userId; // Get userId from query parameter
  const videoIndex = req.query.videoIndex; // Get videoIndex from query parameter

  
  try {console.log(userId);
  console.log(videoIndex);
    // Find the enrolled course for the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the user has enrolled in any courses
    if (!user.enrolledCourse || user.enrolledCourse.length === 0) {
      return res.status(404).json({ error: 'User has no enrolled courses' });
    }
    const video = user.enrolledCourse.videos[videoIndex];
    if (!video) {
      return res.status(404).json({ message: 'Video not found for the given index' });
    }

    const completedStatus = video.completed;

    res.json({ completed: completedStatus });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};







// router.get('/courses/:courseId/videos/:videoIndex/watchTime', fetchWatchTime);






  
  module.exports = {
    getUserByEmail,
    updateVideoCompleted,
    getCompleteStatus,
    updateWatchTime,
    signInUser,
    createUser,
    getAllUsers,
    updateMcqsScore,
    updateFlashcardMastered,
    fetchWatchTime,
    enrollCourse, // Add the enrollCourse function to the module exports
  };
  

  
 

// module.exports = {
//     signInUser,
//     createUser,
//     enrollCourse,
//   getAllUsers,
  

// };
