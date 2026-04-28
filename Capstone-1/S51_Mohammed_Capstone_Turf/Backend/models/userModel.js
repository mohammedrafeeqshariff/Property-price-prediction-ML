const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  appwriteId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  role: {
    type: String,
    enum: ['user', 'owner'],
    default: 'user'
  },
  profileImage: {
    type: String,
    default: ''
  },
  about: {
    type: String,
    default: ''
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;

