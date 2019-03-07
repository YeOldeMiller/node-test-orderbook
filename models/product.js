const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  owner_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

module.exports = model('Product', productSchema);