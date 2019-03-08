import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator/check';

import Product from '../models/product';
import AppError from './app-error';

export const doValidate = (req, res, next) => {
  const errors = validationResult(req).formatWith((({ msg }) => msg));
  if(!errors.isEmpty()) throw new AppError(errors.array().join(', '), 422);
  next();
};

export const isLoggedIn = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if(authHeader) {
    let token;
    try {
      token = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET)
    } catch(err) {
      next(err);
    }
    if(token) {
      req.userId = token.userId;
      return next();
    }
  }
  throw new AppError('Not authenticated', 401);
};

export const isProductOwner = async (req, res, next) => {
  try{
    const productId = req.params.productId || req.body.product;
    const product = await Product.findById(productId);
    if(!product) throw new AppError('Product not found', 404);
    if(product.owner_id.toString() !== req.userId.toString()) throw new AppError('You must own this product to proceed', 403);
    next();
  } catch(err) {
    next(err);
  }
};

export const routeOrder = (req, res, next) => {
  const { type } = req.body;
  if(type === 'sell') return next();
  else if(type === 'buy') return next('route');
  throw new AppError('Unrecognized action type', 422);
};