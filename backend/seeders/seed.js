const { sequelize, Category, Product } = require('../models');

async function runSeed() {
  await sequelize.sync({ force: true }); // Drop existing tables and recreate
  
  console.log('Database synced. Seeding data...');

  const cat1 = await Category.create({ name: 'Electronics' });
  const cat2 = await Category.create({ name: 'Books' });
  const cat3 = await Category.create({ name: 'Clothing' });
  
  await Product.bulkCreate([
    {
      name: 'Wireless Noise Cancelling Headphones',
      description: 'Industry leading noise cancellation, optimized for Alexa and Google Assistant.',
      price: 298.00,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80',
      categoryId: cat1.id
    },
    {
      name: 'Smartphone 12 Pro',
      description: '5G capability, A14 Bionic chip, Pro camera system.',
      price: 999.00,
      stock: 20,
      image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=500&q=80',
      categoryId: cat1.id
    },
    {
      name: '4K Ultra HD Smart TV',
      description: 'Stunning 4K display with smart features.',
      price: 499.99,
      stock: 15,
      image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=500&q=80',
      categoryId: cat1.id
    },
    {
      name: 'The Pragmatic Programmer',
      description: 'Your journey to mastery, 20th Anniversary Edition.',
      price: 39.99,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=500&q=80',
      categoryId: cat2.id
    },
    {
      name: 'Men\'s Classic T-Shirt',
      description: '100% cotton, comfortable fit.',
      price: 19.99,
      stock: 200,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80',
      categoryId: cat3.id
    }
  ]);

  console.log('Seed completed successfully!');
  process.exit();
}

runSeed().catch(err => {
  console.error('Failed to seed:', err);
  process.exit(1);
});
