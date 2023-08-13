const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    enrolledCourse: 
      {
        type: mongoose.Schema.Types.Mixed,
        ref: 'Course',
      },
  
    progress: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Course',
          required: true,
        },
        section: {
          type: String,
          required: true,
        },
        lesson: {
          type: String,
          required: true,
        },
        mcqScore: {
          type: Number,
          default: 0,
        },
        flashCardsProgress: [
          {
            flashCardId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Course.flashCards',
            },
            completed: {
              type: Boolean,
              default: false,
            },
            score: {
              type: Number,
              default: 0,
            },
          },
        ],
      },
    ],

    videos: [
      {
        videoId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Video',
          required: true,
        },
        watchedDuration: {
          type: Number,
          default: 0,
        },
        completed: {
          type: Boolean,
          default: false,
        },
      },
    ],
    
    // lastWatchedVideo: {
    //   course: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Course',
    //   },
    //   videoId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Video',
    //   },
    //   timestamp: {
    //     type: Number,
    //     default: 0,
    //   },
    // },

   
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  });

const User = mongoose.model('Users', userSchema);

module.exports = User;
