require("dotenv").config();
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); // Import the 'cors' package

const PORT =  8080 || process.env.PORT;


const app = express();


app.use(cors());



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}))
// app.use('/', require('./routes/user'))
// app.use('/', require('./routes/menuitem'))
app.use('/users', require('./routes/users'));
app.use('/courses', require('./routes/courses'));
app.use('/message', require('./routes/messages'));
app.use('/feedback', require('./routes/feedbacks'));
app.use('/notification', require('./routes/notifications'));
app.use('/about', require('./routes/about'));





// 'mongodb://localhost:27017/DB121'

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

// Event handler for MongoDB connection
db.on('connected', () => {
  console.log('Connected to MongoDB');
});

db.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
