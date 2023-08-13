const Feedback = require('../models/feedback');

// Method to send feedback
exports.sendFeedback = async (req, res) => {
  try {
    const { username, comment, rating } = req.body;

    if (!username || !comment || !rating) {
      return res.status(400).json({ error: 'Username, comment, and rating are required' });
    }

    const feedback = new Feedback({
      username,
      comment,
      rating,
    });

    await feedback.save();

    res.status(201).json({ message: 'Feedback sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Method to get all feedback
exports.getAllFeedback = async (req, res) => {
  try {
    const feedbackList = await Feedback.find();
    res.status(200).json(feedbackList);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
