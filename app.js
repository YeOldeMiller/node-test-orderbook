require('dotenv').config();

const express = require('express'),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose');

const app = express();

const seedDB = require('./util/seed-db');

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
})

app.use(require('./routes/auth'));
// app.use('/feed', require('./routes/feed'));

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
  .then(() => app.listen(8080))
  .catch(console.log);