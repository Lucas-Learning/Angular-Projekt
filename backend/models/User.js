const mongoose = require('mongoose');
//Schema for the mongoDB
const userSchema = new mongoose.Schema({
  emailId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

module.exports = User;