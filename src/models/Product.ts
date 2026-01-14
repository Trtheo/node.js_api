import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  _id: { type: String, required: true },
  name: { 
    type: String, 
    required: [true, 'Product name is required'], 
    minlength: [1, 'Name cannot be empty'],
    trim: true
  },
  price: { 
    type: Number, 
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative'],
    validate: {
      validator: function(v: number) {
        return v >= 0 && Number.isFinite(v);
      },
      message: 'Price must be a valid positive number'
    }
  },
  description: { type: String, trim: true },
  categoryId: { 
    type: String, 
    required: [true, 'Category ID is required']
  },
  inStock: { 
    type: Boolean, 
    required: [true, 'Stock status is required'],
    default: true
  },
  quantity: { 
    type: Number, 
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity cannot be negative'],
    validate: {
      validator: Number.isInteger,
      message: 'Quantity must be a whole number'
    }
  }
}, { _id: false, timestamps: true });

export const Product = model('Product', productSchema);