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
  },
  images: [{ type: String }],
  brand: { type: String, trim: true },
  sku: { type: String, unique: true, sparse: true },
  weight: { type: Number, min: 0 },
  dimensions: {
    length: { type: Number, min: 0 },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 }
  },
  tags: [{ type: String, trim: true }],
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 },
  featured: { type: Boolean, default: false },
  discount: {
    percentage: { type: Number, min: 0, max: 100, default: 0 },
    startDate: Date,
    endDate: Date
  }
}, { _id: false, timestamps: true });

productSchema.virtual('discountedPrice').get(function() {
  if (this.discount?.percentage && 
      this.discount.startDate && 
      this.discount.endDate &&
      new Date() >= this.discount.startDate && 
      new Date() <= this.discount.endDate) {
    return this.price * (1 - this.discount.percentage / 100);
  }
  return this.price;
});

export const Product = model('Product', productSchema);