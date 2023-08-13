const ChatMessage = require('../models/message');

// Method to send a new message
exports.sendMessage = async (req, res) => {
  try {
    const { username, message } = req.body;

    // Create a new chat message
    const newMessage = new ChatMessage({
      sender: username,
      message,
    });

    await newMessage.save();

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error sending message' });
  }
};

// Method to fetch all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};
