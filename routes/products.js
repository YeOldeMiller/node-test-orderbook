const { Router } = require('express'),
  { body, param } = require('express-validator/check'),
  router = Router();

const productsController = require('../controllers/products'),
  { doValidate, isLoggedIn, isProductOwner } = require('../util/middleware');

const productValidator = [
  body('name').trim().isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
  body('desc').trim().not().isEmpty().withMessage('Description must not be empty')
],
  idValidator = param('productId').isMongoId().withMessage('Invalid product id');

router.get('/', isLoggedIn, productsController.getProducts);

router.post('/', isLoggedIn, productValidator, doValidate, productsController.createProduct);

router.put('/:productId', idValidator, productValidator, doValidate, isLoggedIn, isProductOwner, productsController.updateProduct);

router.delete('/:productId', idValidator, doValidate, isLoggedIn, isProductOwner, productsController.deleteProduct);

module.exports = router;