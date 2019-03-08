import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';

import User from '../models/user';
import AppError from '../util/app-error';

export const signupUser = async (req, res, next) => {
  try {
    const { email, name, password } = req.body,
      { _id } = User.create({ email, name, hash: await hash(password, 12) });
    res.status(201).json({ message: 'Account created', userId: _id });
  } catch(err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
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