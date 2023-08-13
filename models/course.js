const mongoose = require('mongoose');

// const feedbackSchema = new mongoose.Schema({
//   // Feedback schema remains the same
// });

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  author : {
    type : String,
    required : true,
  },
//   description: {
//     type: String,
//     required: true,
//   },
  videos: [
    {
      
      title: {
        type: String,
        // required: true,
      },
      // description: {
      //   type: String,
      //   required: true,
      // },
      videoUrl: {
        type: String,
        required: true,
      },
      totalTime: {
        type: Number, // Store video total duration in seconds
        required: false,
      },
      watchTime: {
        type: Number, // Store user's watch time for the video in seconds
        default: 0,
      },

      videoHandle : {
        type : String
      },

      completed : {
        type: Boolean,
        default: false
      }


      
      // thumbnailUrl: {
      //   type: String,
      //   // required: true,
      // },
    },
  ],
  

  briefs: [
    {
      chapter: {
        type: String,
        required: true,
      },
      content: {
        type: String,
        required: true,
      },
    },
  ],
  ebook:  {
    title: {
      type: String,
      required: false,
    },
    author: {
      type: String,
      required: false,
    },
    format: {
      type: String,
      enum: ['pdf', 'epub', 'other'], // You can customize the supported formats
      required: false,
    },
    url: {
      type: String,
      required: false,
    },
    coverImage: {
      type: String,
      // required: true,
    },
    bookmarks: [
      {
        pageNumber: {
          type: Number,
          required: true,
        },
        label: {
          type: String,
          required: true,
        },
        note: String,
      },
    ],
    highlights: [
      {
        pageNumber: {
          type: Number,
          required: true,
        },
        content: {
          type: String,
          required: true,
        },
        color: {
          type: String,
          required: true,
        },
      },
    ],
  },
  flashCards: [
    {
      question: {
        type: String,
        required: true,
      },
      answer: {
        type: String,
        required: true,
      },
      isMastered: {
        type: Boolean,
        default: false,
      },
    },
  ],
  multipleChoiceQuestions: 
  
  [
    {
      question: {
        type: String,
        required: true,
      },
      options: {
        type: [String],
        required: true,
      },
      correctOption: {
        type: Number,
        required: true,
      },
      selectedOption: {
        type: Number,
        default: -1,
        required: true,
      },
    },
  ],

  mcqScore: {
    type: Number,
    default: 0,
  },
  
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;
