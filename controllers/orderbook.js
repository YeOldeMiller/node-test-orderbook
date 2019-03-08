const Product = require('../models/product'),
  Order = require('../models/order'),
  AppError = require('../util/app-error');

exports.getOrderbook = async (req, res, next) => {
  try{
    const page = req.query.page || 1,
      perPage = 5,
      orders = await Order.find()
        .populate({ path: 'product', select: 'name desc'})
        .populate({ path: 'user', select: 'name email' })
        .skip(perPage * (page - 1)).limit(perPage);
    res.status(200).json(orders);
  } catch(err) {
    next(err);
  }
};

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
      price = parseFloat(req.body.price),
      foundProduct = await Product.findById(product);
    if(foundProduct.owner_id.toString() === req.userId.toString()) throw new AppError('You already own this product', 403);
    const offer = await Order.findOne({ product, type: 'sell' }).sort({ price: 1 }).limit(1);
    if(!offer) throw new AppError('No sale offers found', 404);
    if(price > offer.price) throw new AppError('Listed price exceeded', 403);
    let order = await Order.findOne({ user: req.userId, product, type: 'buy' });
    if(order) {
      order.price = price;
      await order.save();
      res.status(200);
    } else {
      order = await Order.create({ type: 'buy', product, price, user: req.userId });
      res.status(201);
    }
    if(price === offer.price) {
      foundProduct.owner_id = req.userId;
      await foundProduct.save();
      await offer.remove();
      await order.remove();
      return res.status(200).json({ message: 'Transaction successful', foundProduct });
    }
    res.json({ message: 'Request listed', order });
  } catch(err) {
    next(err);
  } 
};