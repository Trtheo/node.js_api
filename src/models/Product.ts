import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, minlength: 1 },
  price: { 
    type: Number, 
    required: true,
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v: number) {
        return v >= 0;
      },
      message: 'Price must be greater than or equal to 0'
    }
  },
  description: { type: String },
  categoryId: { type: String, required: true },
  inStock: { type: Boolean, required: true },
  quantity: { 
    type: Number, 
    required: true,
    min: [0, 'Quantity cannot be negative']
  }
}, { _id: false });

export const Product = model('Product', productSchema);