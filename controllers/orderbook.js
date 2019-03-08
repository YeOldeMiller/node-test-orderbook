const Product = require('../models/product'),
  Order = require('../models/order'),
  AppError = require('../util/app-error');

exports.orderSell = async (req, res, next) => {
  try{
    const { price, product } = req.body;
    let order = await Order.findOne({ user: req.userId, product, type: 'sell' });
    if(order) {
      order.price = price;
      await order.save();
      res.status(200);
    } else {
      order = await Order.create({ type: 'sell', price, product, user: req.userId });
      res.status(201);
    }
    res.json({ message: 'Offer listed', order });
  } catch(err) {
    next(err);
  }
};

exports.orderBuy = async (req, res, next) => {
  try {
    const { product } = req.body,
      price = parseFloat(req.body.price);
      foundProduct = await Product.findById(product);
    if(foundProduct.owner_id.toString() === req.userId.toString()) throw new AppError('You already own this product', 403);
    const offer = await Order.findOne({ product, type: 'sell' }).sort({ price: 1 }).limit(1);
    if(!offer) throw new AppError('No sale offers found', 404);
    if(price > offer.price) throw new AppError('Listed price exceeded', 403);
    else if(price === offer.price) {
      foundProduct.owner_id = req.userId;
      await foundProduct.save();
      offer.remove();
      return res.status(200).json({ message: 'Transaction successful', foundProduct });
    }
    let order = await Order.findOne({ user: req.userId, product, type: 'buy' });
    if(order) {
      order.price = price;
      await order.save();
      res.status(200);
    } else {
      Order.create({ type: 'buy', product, price, user: req.userId });
      res.status(201);
    }
    res.json({ message: 'Request listed', order });
  } catch(err) {
    next(err);
  } 
};