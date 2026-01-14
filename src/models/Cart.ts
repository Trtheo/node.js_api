import { Schema, model } from 'mongoose';

const cartItemSchema = new Schema({
  _id: { type: String, required: true },
  productId: { type: String, required: true },
  quantity: { 
    type: Number, 
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  }
}, { _id: false });

const cartSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [cartItemSchema]
}, { timestamps: true });

export const Cart = model('Cart', cartSchema);