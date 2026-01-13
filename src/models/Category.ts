import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  _id: { type: String, required: true },
  name: { 
    type: String, 
    required: true,
    minlength: [1, 'Name cannot be empty'],
    unique: true
  },
  description: { type: String }
}, { _id: false });

export const Category = model('Category', categorySchema);