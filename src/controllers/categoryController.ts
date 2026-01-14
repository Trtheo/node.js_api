import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Category } from '../models/Category';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories.map(c => ({ _id: c._id, name: c.name, description: c.description })));
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get a single category by ID
export const getCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ _id: category._id, name: category.name, description: category.description });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

//  Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = new Category({ _id: uuidv4(), ...req.body });
    await category.save();
    res.status(201).json({ _id: category._id, name: category.name, description: category.description });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Category name already exists' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.json({ _id: category._id, name: category.name, description: category.description });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(409).json({ error: 'Category name already exists' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({ error: messages.join(', ') });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};