import { Request, Response, NextFunction } from 'express';

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
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