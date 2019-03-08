const { Router } = require('express'),
  { body, param } = require('express-validator/check'),
  router = Router();

const { getProducts, createProduct, updateProduct, deleteProduct } = require('../controllers/products'),
  { doValidate, isLoggedIn, isProductOwner } = require('../util/middleware');

const productValidator = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('desc').trim().not().isEmpty().withMessage('Description must not be empty')
],
  idValidator = param('productId').isMongoId().withMessage('Invalid product id');

router.get('/', isLoggedIn, getProducts);

router.post('/', isLoggedIn, productValidator, doValidate, createProduct);

router.put('/:productId', idValidator, productValidator, doValidate, isLoggedIn, isProductOwner, updateProduct);

router.delete('/:productId', idValidator, doValidate, isLoggedIn, isProductOwner, deleteProduct);

module.exports = router;