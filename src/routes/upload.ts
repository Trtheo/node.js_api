import { Router } from 'express';
import { uploadImage, uploadMultipleImages, uploadAvatar } from '../controllers/uploadController';
import { getImage } from '../controllers/imageController';
import { upload } from '../services/uploadService';
import { auth } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * /api/upload/image:
 *   post:
 *     tags: [Upload]
 *     summary: Upload single image
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image file (JPG, PNG, GIF, WEBP - Max 5MB)
 *     responses:
 *       200:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: 'Image uploaded successfully' }
 *                 imageUrl: { type: string, example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg' }
 *       400:
 *         description: No file uploaded or invalid file type
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error: { type: string, example: 'Only image files are allowed' }
 */
router.post('/image', auth, upload.single('image'), uploadImage);

/**
 * @swagger
 * /api/upload/images:
 *   post:
 *     tags: [Upload]
 *     summary: Upload multiple images (max 5)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 maxItems: 5
 *                 description: Multiple image files (JPG, PNG, GIF, WEBP - Max 5MB each)
 *     responses:
 *       200:
 *         description: Images uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: 'Images uploaded successfully' }
 *                 imageUrls: 
 *                   type: array
 *                   items: 
 *                     type: string
 *                     example: 'https://res.cloudinary.com/demo/image/upload/sample.jpg'
 *       400:
 *         description: No files uploaded or invalid file types
 */
router.post('/images', auth, upload.array('images', 5), uploadMultipleImages);

/**
 * @swagger
 * /api/upload/avatar:
 *   post:
 *     tags: [Upload]
 *     summary: Upload user avatar
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               avatar:
 *                 type: string
 *                 format: binary
 *                 description: Avatar image file (JPG, PNG, GIF, WEBP - Max 5MB)
 *     responses:
 *       200:
 *         description: Avatar uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message: { type: string, example: 'Avatar uploaded successfully' }
 *                 avatarUrl: { type: string, example: 'https://res.cloudinary.com/demo/image/upload/avatar.jpg' }
 *       400:
 *         description: No file uploaded or invalid file type
 */
/**
 * @swagger
 * /api/upload/images/{filename}:
 *   get:
 *     tags: [Upload]
 *     summary: Get uploaded image
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema: { type: string }
 *         description: Image filename or Cloudinary URL
 *     responses:
 *       200:
 *         description: Image file
 *         content:
 *           image/*:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Image not found
 */
router.get('/images/:filename', getImage);

router.post('/avatar', auth, upload.single('avatar'), uploadAvatar);

export default router;