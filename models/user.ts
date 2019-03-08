import { Schema, model } from 'mongoose';

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

export default model('User', userSchema);