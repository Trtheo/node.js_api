import { Request, Response } from 'express';
import Order, { OrderStatus, PaymentStatus } from '../models/Order';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import User from '../models/User';
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../services/emailService';
import mongoose from 'mongoose';

export const createOrder = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const userId = (req as any).userId;
      const { shippingAddress } = req.body;

      const cart = await Cart.findOne({ userId }).session(session);
      if (!cart || cart.items.length === 0) {
        throw new Error('Cart is empty');
      }

      let totalAmount = 0;
      const orderItems = [];

      for (const item of cart.items) {
        const product = await Product.findById(item.productId).session(session);
        if (!product) {
          throw new Error(`Product ${item.productId} not found`);
        }
        if (product.quantity < item.quantity) {
          throw new Error(`Insufficient stock for ${product.name}`);
        }

        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;

        orderItems.push({
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: item.quantity
        });

        product.quantity -= item.quantity;
        await product.save({ session });
      }

      const order = new Order({
        userId,
        items: orderItems,
        totalAmount,
        shippingAddress
      });

      await order.save({ session });
      await Cart.findOneAndDelete({ userId }, { session });

      // Send order confirmation email (outside transaction)
      setImmediate(async () => {
        try {
          const user = await User.findById(userId);
          if (user) {
            await sendOrderConfirmationEmail(user.email, {
              id: order._id,
              totalAmount: order.totalAmount,
              status: order.status
            });
          }
        } catch (emailError) {
          console.error('Failed to send order confirmation email:', emailError);
        }
      });

      res.status(201).json({ message: 'Order created successfully', order });
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Internal server error' });
  } finally {
    await session.endSession();
  }
};

export const getOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const order = await Order.findOne({ _id: req.params.id, userId });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ order });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'email name');
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Send order status update email
    try {
      const user = order.userId as any;
      if (user && user.email) {
        await sendOrderStatusEmail(user.email, {
          id: order._id,
          status: order.status,
          totalAmount: order.totalAmount
        });
      }
    } catch (emailError) {
      console.error('Failed to send order status email:', emailError);
    }

    res.json({ message: 'Order status updated', order });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  
  try {
    await session.withTransaction(async () => {
      const userId = (req as any).userId;
      const order = await Order.findOne({ _id: req.params.id, userId }).session(session);
      
      if (!order) {
        throw new Error('Order not found');
      }
      
      if (order.status !== OrderStatus.PENDING) {
        throw new Error('Cannot cancel order that is not pending');
      }

      // Restore product stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(
          item.productId,
          { $inc: { quantity: item.quantity } },
          { session }
        );
      }

      order.status = OrderStatus.CANCELLED;
      await order.save({ session });

      res.json({ message: 'Order cancelled successfully', order });
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message || 'Internal server error' });
  } finally {
    await session.endSession();
  }
};