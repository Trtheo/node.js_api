import mongoose from 'mongoose';
import User, { UserRole } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import Review from '../models/Review';
import { v4 as uuidv4 } from 'uuid';

export const seedUsers = async () => {
  try {
    await User.deleteMany({});
    
    const users = [
      {
        email: 'admin@ecommerce.com',
        password: 'admin123',
        name: 'Admin User',
        role: UserRole.ADMIN,
        emailVerified: true
      },
      {
        email: 'seller1@ecommerce.com',
        password: 'seller123',
        name: 'John Seller',
        role: UserRole.SELLER,
        emailVerified: true
      },
      {
        email: 'buyer1@ecommerce.com',
        password: 'buyer123',
        name: 'Jane Buyer',
        role: UserRole.BUYER,
        emailVerified: true
      }
    ];

    await User.insertMany(users);
    console.log('Users seeded successfully');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

export const seedCategories = async () => {
  try {
    await Category.deleteMany({});
    
    const categories = [
      { _id: uuidv4(), name: 'Electronics', description: 'Electronic devices and gadgets' },
      { _id: uuidv4(), name: 'Clothing', description: 'Fashion and apparel' },
      { _id: uuidv4(), name: 'Books', description: 'Educational and entertainment books' }
    ];

    await Category.insertMany(categories);
    console.log('Categories seeded successfully');
    return categories;
  } catch (error) {
    console.error('Error seeding categories:', error);
    return [];
  }
};

export const seedProducts = async () => {
  try {
    await Product.deleteMany({});
    
    const seller = await User.findOne({ role: UserRole.SELLER });
    const categories = await Category.find();
    
    if (!seller || categories.length === 0) {
      console.log('Please seed users and categories first');
      return;
    }

    const products = [
      {
        _id: uuidv4(),
        name: 'iPhone 15 Pro',
        price: 999.99,
        description: 'Latest iPhone with advanced features',
        categoryId: categories[0]._id,
        inStock: true,
        quantity: 50,
        sellerId: seller._id,
        featured: true,
        tags: ['smartphone', 'apple', 'premium']
      },
      {
        _id: uuidv4(),
        name: 'Nike Air Max',
        price: 150.00,
        description: 'Comfortable running shoes',
        categoryId: categories[1]._id,
        inStock: true,
        quantity: 30,
        sellerId: seller._id,
        tags: ['shoes', 'nike', 'running']
      },
      {
        _id: uuidv4(),
        name: 'JavaScript Guide',
        price: 29.99,
        description: 'Complete guide to JavaScript programming',
        categoryId: categories[2]._id,
        inStock: true,
        quantity: 100,
        sellerId: seller._id,
        tags: ['programming', 'javascript', 'education']
      }
    ];

    await Product.insertMany(products);
    console.log('Products seeded successfully');
    return products;
  } catch (error) {
    console.error('Error seeding products:', error);
    return [];
  }
};

export const seedReviews = async () => {
  try {
    await Review.deleteMany({});
    
    const buyer = await User.findOne({ role: UserRole.BUYER });
    const products = await Product.find();
    
    if (!buyer || products.length === 0) {
      console.log('Please seed users and products first');
      return;
    }

    const reviews = [
      {
        userId: buyer._id,
        productId: products[0]._id,
        rating: 5,
        comment: 'Excellent product! Highly recommended.',
        verified: true
      },
      {
        userId: buyer._id,
        productId: products[1]._id,
        rating: 4,
        comment: 'Good quality shoes, very comfortable.',
        verified: true
      }
    ];

    await Review.insertMany(reviews);
    console.log('Reviews seeded successfully');
  } catch (error) {
    console.error('Error seeding reviews:', error);
  }
};

export const seedAll = async () => {
  try {
    await seedUsers();
    await seedCategories();
    await seedProducts();
    await seedReviews();
    console.log('All data seeded successfully');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};