const mongoose = require('mongoose');

const emailSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  attachment: { type: String },
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Email', emailSchema);
