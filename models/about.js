const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  para1: {
    type: String,
    required: true,
  },
  para2: {
    type: String,
    required: true,
  },
//   img1: {
//     type: String,
//     required: true,
//   },
//   img2: {
//     type: String,
//     required: true,
//   },
});

const About = mongoose.model('About', aboutSchema);

module.exports = About;
