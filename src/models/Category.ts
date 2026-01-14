import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  _id: { type: String, required: true },
  name: { 
    type: String, 
    required: [true, 'Category name is required'],
    minlength: [1, 'Name cannot be empty'],
    unique: true,
    trim: true
  },
  description: { type: String, trim: true }
}, { _id: false, timestamps: true });

export const Category = model('Category', categorySchema);