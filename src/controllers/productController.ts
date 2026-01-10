import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../models/Product';

export const getProducts = async (req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products.map(p => ({ 
    id: p._id, name: p.name, price: p.price, description: p.description, 
    categoryId: p.categoryId, inStock: p.inStock, quantity: p.quantity 
  })));
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ 
    id: product._id, name: product.name, price: product.price, description: product.description, 
    categoryId: product.categoryId, inStock: product.inStock, quantity: product.quantity 
  });
};

export const createProduct = async (req: Request, res: Response) => {
  const product = new Product({ _id: uuidv4(), ...req.body });
  await product.save();
  res.status(201).json({ 
    id: product._id, name: product.name, price: product.price, description: product.description, 
    categoryId: product.categoryId, inStock: product.inStock, quantity: product.quantity 
  });
};

export const updateProduct = async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ 
    id: product._id, name: product.name, price: product.price, description: product.description, 
    categoryId: product.categoryId, inStock: product.inStock, quantity: product.quantity 
  });
};

export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.status(204).send();
};