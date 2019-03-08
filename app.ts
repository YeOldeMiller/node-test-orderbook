require('dotenv').config();

import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import orderRoutes from './routes/orderbook';

import seedDB from './util/seed-db';

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

app.use(authRoutes);
app.use('/product', productRoutes);
app.use('/orderbook', orderRoutes);

app.use((error, req, res, next) => {
  console.log(error);
  const { statusCode, message } = error;
  res.status(statusCode || 500).json({ message });
});

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useFindAndModify: false
})
  .then(seedDB)
  .then(() => {
    app.listen(process.env.PORT || 8080);
    console.log('Listening on port ' + (process.env.PORT || 8080));
  })
  .catch(console.log);