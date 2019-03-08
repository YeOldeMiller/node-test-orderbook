import { Router } from 'express';
import { body, param } from 'express-validator/check';

import { getProducts, createProduct, updateProduct, deleteProduct } from '../controllers/products';
import { doValidate, isLoggedIn, isProductOwner } from '../util/middleware';

const router = Router(),
  productValidator = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('desc').trim().not().isEmpty().withMessage('Description must not be empty')
],
  idValidator = param('productId').isMongoId().withMessage('Invalid product id');

router.get('/', isLoggedIn, getProducts);

router.post('/', isLoggedIn, productValidator, doValidate, createProduct);

router.put('/:productId', idValidator, productValidator, doValidate, isLoggedIn, isProductOwner, updateProduct);

router.delete('/:productId', idValidator, doValidate, isLoggedIn, isProductOwner, deleteProduct);

export default router;