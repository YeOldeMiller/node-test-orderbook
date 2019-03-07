const { Schema, model } = require('mongoose'),
  bcrypt = require('bcryptjs');

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  }
});

module.exports = model('User', userSchema);