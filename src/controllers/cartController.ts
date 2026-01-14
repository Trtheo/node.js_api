import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    res.json({ items: cart.items.map(item => ({ _id: item._id, productId: item.productId, quantity: item.quantity })) });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const addCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId, quantity } = req.body;
    
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    if (!product.inStock || product.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      const newItem = { _id: uuidv4(), productId, quantity };
      cart.items.push(newItem);
    }
    
    await cart.save();
    const addedItem = existingItem || cart.items[cart.items.length - 1];
    res.status(201).json({ _id: addedItem._id, productId: addedItem.productId, quantity: addedItem.quantity });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    
    const item = cart.items.find(item => item._id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    res.json({ _id: item._id, productId: item.productId, quantity: item.quantity });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { quantity } = req.body;
    
    if (!quantity || quantity < 1 || !Number.isInteger(quantity)) {
      return res.status(400).json({ error: 'Quantity must be a positive integer' });
    }
    
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    
    const item = cart.items.find(item => item._id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    
    const product = await Product.findById(item.productId);
    if (!product || !product.inStock || product.quantity < quantity) {
      return res.status(400).json({ error: 'Insufficient stock' });
    }
    
    item.quantity = quantity;
    await cart.save();
    res.json({ _id: item._id, productId: item.productId, quantity: item.quantity });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteCartItem = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ error: 'Cart not found' });
    
    const itemIndex = cart.items.findIndex(item => item._id === req.params.id);
    if (itemIndex === -1) return res.status(404).json({ error: 'Item not found' });
    
    cart.items.splice(itemIndex, 1);
    await cart.save();
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    await Cart.findOneAndUpdate({ userId }, { items: [] }, { upsert: true });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};