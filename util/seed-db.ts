import { readFile } from 'fs';
import { promisify } from 'util';
import path from 'path';

import { hash } from 'bcryptjs';

import User from '../models/user';
import Product from '../models/product';

const readFileAsync = promisify(readFile);

export default async () => {
  try {
    let { userSeed } = JSON.parse(await readFileAsync(path.join(__dirname, '..' , '..', 'data', 'user-seed.json'), 'utf8')),
      { productSeed } = JSON.parse(await readFileAsync(path.join(__dirname, '..', '..', 'data', 'product-seed.json'), 'utf8'));
    if(!userSeed || !productSeed) throw new Error('No seed data to populate database');
    userSeed.length = productSeed.length = Math.min(userSeed.length, productSeed.length);

    await User.deleteMany({ initial: true });
    await Product.deleteMany({ initial: true });

    userSeed = await Promise.all(userSeed.map(async user => ({ ...user, hash: await hash(user.password, 12), initial: true })));
    const users = await User.insertMany(userSeed);
    
    productSeed = productSeed.map((product, index) => ({ ...product, owner_id: users[index]._id, initial: true }));
    await Product.insertMany(productSeed);

    console.log('Database repopulated');
  } catch(err) {
    console.log(err);
  }
};