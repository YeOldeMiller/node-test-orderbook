const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { collection: 'orderbook' });

module.exports = model('Order', orderSchema);