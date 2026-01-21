import { Request, Response } from 'express';
import path from 'path';

export const getImage = async (req: Request, res: Response) => {
  try {
    const { filename } = req.params;
    
    // For Cloudinary images, redirect to the actual URL
    if (filename.includes('cloudinary')) {
      return res.redirect(filename);
    }
    
    // For local images (if any)
    const imagePath = path.join(__dirname, '../../uploads', filename);
    res.sendFile(imagePath);
  } catch (error: any) {
    res.status(404).json({ error: 'Image not found' });
  }
};