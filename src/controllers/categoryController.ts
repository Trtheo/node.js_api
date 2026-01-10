import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '../models/Category';

export const getCategories = async (req: Request, res: Response) => {
  const categories = await Category.find();
  res.json(categories.map(c => ({ id: c._id, name: c.name, description: c.description })));
};

export const getCategory = async (req: Request, res: Response) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json({ id: category._id, name: category.name, description: category.description });
};

export const createCategory = async (req: Request, res: Response) => {
  const category = new Category({ _id: uuidv4(), ...req.body });
  await category.save();
  res.status(201).json({ id: category._id, name: category.name, description: category.description });
};

export const updateCategory = async (req: Request, res: Response) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json({ id: category._id, name: category.name, description: category.description });
};

export const deleteCategory = async (req: Request, res: Response) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.status(204).send();
};