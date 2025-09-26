const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  text: String,
  sender: String,
  fileUrl: String,
  fileName: String,
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Message', MessageSchema);
