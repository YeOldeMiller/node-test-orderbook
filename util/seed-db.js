const fs = require('fs'),
  { promisify } = require('util'),
  path = require('path');

const bcrypt = require('bcryptjs');

const User = require('../models/user'),
  Product = require('../models/product'),
  readFile = promisify(fs.readFile);

module.exports = async () => {
  try {
    let { userSeed } = JSON.parse(await readFile(path.join(__dirname, '..', 'data', 'user-seed.json'))),
      { productSeed } = JSON.parse(await readFile(path.join(__dirname, '..', 'data', 'product-seed.json')));
    if(!userSeed || !productSeed) throw new Error('No seed data to populate database');
    userSeed.length = productSeed.length = Math.min(userSeed.length, productSeed.length);

    await User.deleteMany({ initial: true });
    await Product.deleteMany({ initial: true });
    userSeed = await Promise.all(userSeed.map(async user => ({ ...user, hash: await bcrypt.hash(user.password, 12), initial: true })));
    const users = await User.insertMany(userSeed);
    productSeed = productSeed.map((product, index) => ({ ...product, owner_id: users[index]._id, initial: true }));
    const products = await Product.insertMany(productSeed);
    console.log('Database repopulated:', users, products);
  } catch(err) {
    console.log(err);
  }
};