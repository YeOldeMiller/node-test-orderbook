const fs = require('fs'),
  { promisify } = require('util'),
  path = require('path');

const bcrypt = require('bcryptjs');

const User = require('../models/user'),
  Product = require('../models/product')
  readFile = promisify(fs.readFile);

module.exports = async () => {
  try {
    let { userSeed } = JSON.parse(await readFile(path.join(__dirname, '..', 'data', 'user-seed.json'))),
      { productSeed } = JSON.parse(await readFile(path.join(__dirname, '..', 'data', 'product-seed.json')));
    if(!userSeed || !productSeed) {
      throw new Error('No data to populate database');
    };
    await User.deleteMany();
    await Product.deleteMany();
    userSeed.forEach(entry => {
      bcrypt.hash(entry.password, 12).then(hash => {
        const user = new User({ ...entry, hash });
        user.save();
      });
    });
    const users = await User.find();
    console.log(users)
    // productSeed = productSeed.map((product, index) => ({ ...product, owner_id: users[index]._id }));
    // console.log(productSeed);
    //   await user.save();
    //   const product = new Product({
    //     ...entry.product,
    //     owner_id: user._id
    //   });
    //   await product.save();
    // })
  } catch(err) {
    console.log(err);
  }
};