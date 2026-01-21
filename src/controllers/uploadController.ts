import { Request, Response } from 'express';
import { uploadToCloudinary } from '../services/uploadService';

export const uploadImage = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const imageUrl = await uploadToCloudinary(req.file, 'products');
    
    res.json({
      message: 'Image uploaded successfully',
      imageUrl
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
};

export const uploadMultipleImages = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const uploadPromises = files.map(file => uploadToCloudinary(file, 'products'));
    const imageUrls = await Promise.all(uploadPromises);
    
    res.json({
      message: 'Images uploaded successfully',
      imageUrls
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
};

export const uploadAvatar = async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const avatarUrl = await uploadToCloudinary(req.file, 'avatars');
    
    res.json({
      message: 'Avatar uploaded successfully',
      avatarUrl
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
};