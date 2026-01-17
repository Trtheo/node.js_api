import { Request, Response } from 'express';
import Order, { OrderStatus, PaymentStatus } from '../models/Order';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { shippingAddress } = req.body;

    const cart = await Cart.findOne({ userId });
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    let totalAmount = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `Product ${item.productId} not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
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
      await product.save();
    }

    const order = new Order({
      userId,
      items: orderItems,
      totalAmount,
      shippingAddress
    });

    await order.save();
    await Cart.findOneAndDelete({ userId });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
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
    );
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order status updated', order });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const order = await Order.findOne({ _id: req.params.id, userId });
    
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    
    if (order.status !== OrderStatus.PENDING) {
      return res.status(400).json({ error: 'Cannot cancel order that is not pending' });
    }

    order.status = OrderStatus.CANCELLED;
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (error: any) {
    res.status(500).json({ error: 'Internal server error' });
  }
};