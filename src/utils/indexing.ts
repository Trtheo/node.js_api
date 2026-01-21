import mongoose from 'mongoose';
import User from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import Order from '../models/Order';
import Review from '../models/Review';

export const createIndexes = async () => {
  try {
    // User indexes
    await User.collection.createIndex({ email: 1 }, { unique: true });
    await User.collection.createIndex({ role: 1 });
    await User.collection.createIndex({ emailVerified: 1 });

    // Product indexes
    await Product.collection.createIndex({ name: 'text', description: 'text', tags: 'text' });
    await Product.collection.createIndex({ categoryId: 1 });
    await Product.collection.createIndex({ sellerId: 1 });
    await Product.collection.createIndex({ price: 1 });
    await Product.collection.createIndex({ featured: 1 });
    await Product.collection.createIndex({ inStock: 1 });
    await Product.collection.createIndex({ averageRating: -1 });
    await Product.collection.createIndex({ createdAt: -1 });

    // Category indexes
    await Category.collection.createIndex({ name: 1 }, { unique: true });

    // Order indexes
    await Order.collection.createIndex({ userId: 1 });
    await Order.collection.createIndex({ status: 1 });
    await Order.collection.createIndex({ orderDate: -1 });

    // Review indexes
    await Review.collection.createIndex({ productId: 1 });
    await Review.collection.createIndex({ userId: 1 });
    await Review.collection.createIndex({ userId: 1, productId: 1 }, { unique: true });

    console.log('Database indexes created successfully');
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
};