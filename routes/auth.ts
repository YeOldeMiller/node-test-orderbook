import { Router } from 'express';
import { body } from 'express-validator/check';

import { signupUser, loginUser } from '../controllers/auth';
import User from '../models/user';
import { doValidate } from '../util/middleware';

const router = Router();


const userValidator = [
  body('email').normalizeEmail().isEmail().withMessage('Not a valid email')
    .custom((email, { req }) => {
      return User.findOne({ email }).then(user => {
        if(user) {
          return Promise.reject('Email already in use');
        }
        return true;
      });
    }),
  body('password').trim().isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),
  body('name').trim().not().isEmpty()
];

router.put('/signup', userValidator, doValidate, signupUser);

router.post('/login', loginUser);

export default router;