const { Router } = require('express'),
  { body } = require('express-validator/check'),
  router = Router();

const authController = require('../controllers/auth'),
  User = require('../models/user');

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

router.put('/signup', userValidator, authController.signupUser);

router.post('/login', authController.loginUser);

module.exports = router;