import { Request, Response } from 'express';
import { Product } from '../models/Product';

export const getProductStats = async (req: Request, res: Response) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: '$categoryId',
          totalProducts: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
          totalStock: { $sum: '$quantity' }
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $unwind: '$category'
      },
      {
        $project: {
          categoryName: '$category.name',
          totalProducts: 1,
          avgPrice: { $round: ['$avgPrice', 2] },
          minPrice: 1,
          maxPrice: 1,
          totalStock: 1
        }
      }
    ]);

    res.json({ stats });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const { limit = 10 } = req.query;
    
    const topProducts = await Product.find()
      .sort({ price: -1 })
      .limit(Number(limit))
      .populate('sellerId', 'name')
      .select('name price averageRating reviewCount');

    res.json({ topProducts });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getLowStockProducts = async (req: Request, res: Response) => {
  try {
    const { threshold = 10 } = req.query;
    
    const lowStockProducts = await Product.find({
      quantity: { $lte: Number(threshold) },
      inStock: true
    })
    .populate('sellerId', 'name')
    .select('name quantity price sellerId')
    .sort({ quantity: 1 });

    res.json({ lowStockProducts, threshold: Number(threshold) });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPriceDistribution = async (req: Request, res: Response) => {
  try {
    const distribution = await Product.aggregate([
      {
        $bucket: {
          groupBy: '$price',
          boundaries: [0, 50, 100, 200, 500, 1000, Infinity],
          default: 'Other',
          output: {
            count: { $sum: 1 },
            products: { $push: { name: '$name', price: '$price' } }
          }
        }
      }
    ]);

    res.json({ priceDistribution: distribution });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};