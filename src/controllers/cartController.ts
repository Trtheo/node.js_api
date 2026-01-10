import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Cart } from '../models/Cart';

export const getCart = async (req: Request, res: Response) => {
  let cart = await Cart.findOne();
  if (!cart) cart = new Cart({ items: [] });
  res.json({ items: cart.items.map(item => ({ id: item._id, productId: item.productId, quantity: item.quantity })) });
};

export const addCartItem = async (req: Request, res: Response) => {
  let cart = await Cart.findOne();
  if (!cart) cart = new Cart({ items: [] });
  const newItem = { _id: uuidv4(), ...req.body };
  cart.items.push(newItem);
  await cart.save();
  res.status(201).json({ id: newItem._id, productId: newItem.productId, quantity: newItem.quantity });
};

export const updateCartItem = async (req: Request, res: Response) => {
  const cart = await Cart.findOne();
  if (!cart) return res.status(404).json({ error: 'Cart not found' });
  const item = cart.items.id(req.params.id);
  if (!item) return res.status(404).json({ error: 'Item not found' });
  Object.assign(item, req.body);
  await cart.save();
  res.json({ id: item._id, productId: item.productId, quantity: item.quantity });
};

export const deleteCartItem = async (req: Request, res: Response) => {
  const cart = await Cart.findOne();
  if (!cart) return res.status(404).json({ error: 'Cart not found' });
  cart.items.pull({ _id: req.params.id });
  await cart.save();
  res.status(204).send();
};

export const clearCart = async (req: Request, res: Response) => {
  await Cart.deleteMany({});
  res.status(204).send();
};