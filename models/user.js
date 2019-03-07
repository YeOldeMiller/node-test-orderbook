const { Schema, model } = require('mongoose'),
  bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  initial: {
    type: Boolean,
    default: false
  }
});

module.exports = model('User', userSchema);