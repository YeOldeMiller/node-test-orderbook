const { validationResult } = require('express-validator/check');

const Product = require('../models/product'),
  AppError = require('../util/app-error');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ owner_id: req.userId });
    res.status(200).json({ message: 'Products retrieved', products });
  } catch(err) {
    next(err);
  }
};

exports.createProduct = async (req, res, next) => {
  try {
    const { name, desc } = req.body,
      product = await Product.create({ name, desc, owner_id: req.userId });
    res.status(201).json({ message: 'Product created', product });
  } catch(err) {
    next(err);
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const { name, desc } = req.body,
      product = await Product.findByIdAndUpdate(req.params.productId, { name, desc });
    res.status(200).json({ message: 'Product updated', product });
  } catch(err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndRemove(req.params.productId);
    res.status(200).json({ message: 'Product deleted' });
  } catch(err) {
    next(err);
  }
};