import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

let categories: any[] = [];

export const getCategories = async (req: Request, res: Response) => {
  res.json(categories);
};

export const getCategory = async (req: Request, res: Response) => {
  const category = categories.find(c => c.id === req.params.id);
  if (!category) return res.status(404).json({ error: 'Category not found' });
  res.json(category);
};

export const createCategory = async (req: Request, res: Response) => {
  const category = { id: uuidv4(), ...req.body };
  categories.push(category);
  res.status(201).json(category);
};

export const updateCategory = async (req: Request, res: Response) => {
  const index = categories.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  categories[index] = { ...categories[index], ...req.body };
  res.json(categories[index]);
};

export const deleteCategory = async (req: Request, res: Response) => {
  const index = categories.findIndex(c => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Category not found' });
  categories.splice(index, 1);
  res.status(204).send();
};