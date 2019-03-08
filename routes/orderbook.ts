import { Router } from 'express';
import { body } from 'express-validator/check';

import { getOrderbook, orderBuy, orderSell } from '../controllers/orderbook';
import { routeOrder, isLoggedIn, isProductOwner, doValidate } from '../util/middleware';

const router = Router();

const orderValidator = [
  body('product').isMongoId().withMessage('Invalid product id'),
  body('price').isCurrency({ allow_negatives: false }).withMessage('Invalid currency amount')
];

// sell route
router.put('/', isLoggedIn, orderValidator, doValidate, routeOrder, isProductOwner, orderSell);

// buy route, activated by routeOrder middleware
router.put('/', orderBuy);

router.get('/', getOrderbook);

export default router;