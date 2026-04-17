const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('../models/Product');
const Category = require('../models/Category');

const seedData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');

    // Clear existing data
    await Product.deleteMany();
    await Category.deleteMany();

    console.log('Old data removed');

    // Create categories
    const electronics = await Category.create({ name: 'Electronics' });
    const books = await Category.create({ name: 'Books' });
    const clothing = await Category.create({ name: 'Clothing' });

    console.log('Categories created');

    // Create products
    await Product.insertMany([
      {
        name: 'Wireless Headphones',
        description: 'Noise cancelling headphones with premium sound.',
        price: 299,
        stock: 50,
        image: 'https://via.placeholder.com/300',
        category: electronics._id
      },
      {
        name: 'Smartphone Pro',
        description: 'Latest smartphone with amazing camera.',
        price: 999,
        stock: 25,
        image: 'https://via.placeholder.com/300',
        category: electronics._id
      },
      {
        name: 'Programming Book',
        description: 'Learn full stack development.',
        price: 45,
        stock: 100,
        image: 'https://via.placeholder.com/300',
        category: books._id
      },
      {
        name: 'Men T-Shirt',
        description: 'Comfortable cotton t-shirt.',
        price: 20,
        stock: 200,
        image: 'https://via.placeholder.com/300',
        category: clothing._id
      }
    ]);

    console.log('Products inserted successfully 🎉');

    process.exit();
  } catch (error) {
    console.error('Seeding failed ❌', error);
    process.exit(1);
  }
};

seedData();