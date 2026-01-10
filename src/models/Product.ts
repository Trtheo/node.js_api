import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  categoryId: { type: String, required: true },
  inStock: { type: Boolean, required: true },
  quantity: { type: Number, required: true }
}, { _id: false });

export const Product = model('Product', productSchema);