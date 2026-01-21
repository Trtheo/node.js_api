import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { uploadToCloudinary } from '../services/uploadService';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search, 
      category, 
      minPrice, 
      maxPrice, 
      sortBy = 'createdAt', 
      sortOrder = 'desc',
      featured,
      inStock
    } = req.query;

    const query: any = {};
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search as string, 'i')] } }
      ];
    }
    
    if (category) query.categoryId = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (featured !== undefined) query.featured = featured === 'true';
    if (inStock !== undefined) query.inStock = inStock === 'true';

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('sellerId', 'name profile.firstName profile.lastName');

    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('sellerId', 'name profile.firstName profile.lastName');
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ product });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.body;
    const sellerId = (req as any).userId;
    const files = req.files as Express.Multer.File[];
    
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Category does not exist' });
    }
    
    let images: string[] = [];
    if (files && files.length > 0) {
      const uploadPromises = files.map(file => uploadToCloudinary(file, 'products'));
      images = await Promise.all(uploadPromises);
    }
    
    const product = new Product({ _id: uuidv4(), ...req.body, sellerId, images });
    await product.save();
    res.status(201).json({ message: 'Product created successfully', product });
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
    const sellerId = (req as any).userId;
    const userRole = (req as any).userRole;
    const files = req.files as Express.Multer.File[];
    
    if (categoryId) {
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return res.status(400).json({ error: 'Category does not exist' });
      }
    }
    
    let updateData = { ...req.body };
    
    if (files && files.length > 0) {
      const uploadPromises = files.map(file => uploadToCloudinary(file, 'products'));
      const newImages = await Promise.all(uploadPromises);
      updateData.images = newImages;
    }
    
    const query = userRole === 'admin' ? { _id: req.params.id } : { _id: req.params.id, sellerId };
    const product = await Product.findOneAndUpdate(query, updateData, { new: true, runValidators: true });
    
    if (!product) return res.status(404).json({ error: 'Product not found or unauthorized' });
    res.json({ message: 'Product updated successfully', product });
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
    const sellerId = (req as any).userId;
    const userRole = (req as any).userRole;
    
    const query = userRole === 'admin' ? { _id: req.params.id } : { _id: req.params.id, sellerId };
    const product = await Product.findOneAndDelete(query);
    
    if (!product) return res.status(404).json({ error: 'Product not found or unauthorized' });
    res.json({ message: 'Product deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};