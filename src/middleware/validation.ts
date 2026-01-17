import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { email, password, role } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  
  if (role && !Object.values(UserRole).includes(role)) {
    return res.status(400).json({ error: 'Invalid role specified' });
  }
  
  next();
};

export const validateLogin = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  next();
};

export const validateCategory = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Category name is required' });
  }
  
  next();
};

export const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const { name, price, categoryId, quantity } = req.body;
  
  if (!name || name.trim().length === 0) {
    return res.status(400).json({ error: 'Product name is required' });
  }
  
  if (price === undefined || price < 0) {
    return res.status(400).json({ error: 'Price must be a positive number' });
  }
  
  if (!categoryId) {
    return res.status(400).json({ error: 'Category ID is required' });
  }
  
  if (quantity === undefined || quantity < 0 || !Number.isInteger(quantity)) {
    return res.status(400).json({ error: 'Quantity must be a non-negative integer' });
  }
  
  next();
};

export const validateCartItem = (req: Request, res: Response, next: NextFunction) => {
  const { productId, quantity } = req.body;
  
  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }
  
  if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
    return res.status(400).json({ error: 'Quantity must be a positive integer' });
  }
  
  next();
};

export const validateOrder = (req: Request, res: Response, next: NextFunction) => {
  const { shippingAddress } = req.body;
  
  if (!shippingAddress) {
    return res.status(400).json({ error: 'Shipping address is required' });
  }
  
  const { street, city, state, zipCode, country } = shippingAddress;
  
  if (!street || !city || !state || !zipCode || !country) {
    return res.status(400).json({ error: 'Complete shipping address is required' });
  }
  
  next();
};

export const validateReview = (req: Request, res: Response, next: NextFunction) => {
  const { productId, rating, comment } = req.body;
  
  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }
  
  if (!rating || rating < 1 || rating > 5 || !Number.isInteger(rating)) {
    return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
  }
  
  if (comment && comment.length > 500) {
    return res.status(400).json({ error: 'Comment cannot exceed 500 characters' });
  }
  
  next();
};

export const validateForgotPassword = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email' });
  }
  
  next();
};

export const validateResetPassword = (req: Request, res: Response, next: NextFunction) => {
  const { token, newPassword } = req.body;
  
  if (!token) {
    return res.status(400).json({ error: 'Reset token is required' });
  }
  
  if (!newPassword || newPassword.length < 6) {
    return res.status(400).json({ error: 'New password must be at least 6 characters' });
  }
  
  next();
};