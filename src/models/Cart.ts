import { Schema, model } from 'mongoose';

const cartItemSchema = new Schema({
  _id: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

const cartSchema = new Schema({
  items: [cartItemSchema]
});

export const Cart = model('Cart', cartSchema);