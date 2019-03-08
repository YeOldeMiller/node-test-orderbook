const { Router } = require('express'),
  { body } = require('express-validator/check'),
  router = Router();

const orderController = require('../controllers/orderbook'),
  { routeOrder, isLoggedIn, isProductOwner, doValidate } = require('../util/middleware');

const orderValidator = [
  body('product').isMongoId().withMessage('Invalid product id'),
  body('price').isCurrency({ allow_negatives: false }).withMessage('Invalid currency amount')
];

// sell route
router.put('/', isLoggedIn, orderValidator, doValidate, routeOrder, isProductOwner, orderController.orderSell);

// buy route
router.put('/', orderController.orderBuy);

module.exports = router;