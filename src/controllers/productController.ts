import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products.map(p => ({ 
      _id: p._id, name: p.name, price: p.price, description: p.description, 
      categoryId: p.categoryId, inStock: p.inStock, quantity: p.quantity 
    })));
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ 
      _id: product._id, name: product.name, price: product.price, description: product.description, 
      categoryId: product.categoryId, inStock: product.inStock, quantity: product.quantity 
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.body;
    
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Category does not exist' });
    }
    
    const product = new Product({ _id: uuidv4(), ...req.body });
    await product.save();
    res.status(201).json({ 
      _id: product._id, name: product.name, price: product.price, description: product.description, 
      categoryId: product.categoryId, inStock: product.inStock, quantity: product.quantity 
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.body;
    
    if (categoryId) {
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return res.status(400).json({ error: 'Category does not exist' });
      }
    }
    
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ 
      _id: product._id, name: product.name, price: product.price, description: product.description, 
      categoryId: product.categoryId, inStock: product.inStock, quantity: product.quantity 
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};