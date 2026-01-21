import { Request, Response } from 'express';
import Review from '../models/Review';
import { Product } from '../models/Product';
import Order from '../models/Order';

export const createReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { productId, rating, comment } = req.body;

    const existingReview = await Review.findOne({ userId, productId });
    if (existingReview) {
      return res.status(400).json({ error: 'You have already reviewed this product' });
    }

    const hasOrdered = await Order.findOne({
      userId,
      'items.productId': productId,
      status: { $in: ['delivered', 'confirmed'] }
    });

    const review = new Review({
      userId,
      productId,
      rating,
      comment,
      verified: !!hasOrdered
    });

    await review.save();
    await updateProductRating(productId);

    res.status(201).json({ message: 'Review created successfully', review });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductReviews = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId })
      .populate('userId', 'name profile.firstName profile.lastName')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { rating, comment } = req.body;

    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, userId },
      { rating, comment },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await updateProductRating(review.productId.toString());
    res.json({ message: 'Review updated successfully', review });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const review = await Review.findOne({ _id: req.params.id, userId });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const productId = review.productId.toString();
    await Review.findOneAndDelete({ _id: req.params.id, userId });
    await updateProductRating(productId);
    
    res.json({ message: 'Review deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProductRating = async (productId: string) => {
  const reviews = await Review.find({ productId });
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  await Product.findByIdAndUpdate(productId, {
    averageRating: Math.round(averageRating * 10) / 10,
    reviewCount: reviews.length
  });
};
export const getUserReviews = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const reviews = await Review.find({ userId })
      .populate('productId', 'name price images')
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};