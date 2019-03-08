const { validationResult } = require('express-validator/check'),
  { hash, compare } = require('bcryptjs'),
  jwt = require('jsonwebtoken');

const User = require('../models/user'),
  AppError = require('../util/app-error');

exports.signupUser = async (req, res, next) => {
  try {
    const { email, name, password } = req.body,
      user = new User({
      email,
      name,
      hash: await hash(password, 12)
    }),
    { _id } = await user.save();
    res.status(201).json({ message: 'Account created', userId: _id });
  } catch(err) {
    next(err);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body,
      user = await User.findOne({ email });
    if(!user) {
      throw new AppError('User not found', 401);
    }
    if(!await compare(password, user.hash)) {
      throw new AppError('Wrong password', 401);
    }
    const token = jwt.sign({
      email: user.email,
      userId: user._id.toString()
    }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.status(200).json({ token, userId: user._id.toString() });
  } catch(err) {
    next(err);
  }
};