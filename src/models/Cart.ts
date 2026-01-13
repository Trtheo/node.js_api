import { Schema, model } from 'mongoose';

const cartItemSchema = new Schema({
  _id: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { 
    type: Number, 
    required: true,
    min: [1, 'Quantity must be at least 1']
  }
}, { _id: false });

const cartSchema = new Schema({ // Define the Cart schema
  items: [cartItemSchema] // Array of cart items
});

export const Cart = model('Cart', cartSchema);