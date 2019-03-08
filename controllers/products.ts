import Product from '../models/product';

export const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ owner_id: req.userId });
    res.status(200).json({ message: 'Products retrieved', products });
  } catch(err) {
    next(err);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const { name, desc } = req.body,
      product = await Product.create({ name, desc, owner_id: req.userId });
    res.status(201).json({ message: 'Product created', product });
  } catch(err) {
    next(err);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const { name, desc } = req.body,
      product = await Product.findByIdAndUpdate(req.params.productId, { name, desc });
    res.status(200).json({ message: 'Product updated', product });
  } catch(err) {
    next(err);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndRemove(req.params.productId);
    res.status(200).json({ message: 'Product deleted' });
  } catch(err) {
    next(err);
  }
};