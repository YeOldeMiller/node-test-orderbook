const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  price: {
    type: Number,
    required: true
  }
});