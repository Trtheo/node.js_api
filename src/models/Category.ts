import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String }
}, { _id: false });

export const Category = model('Category', categorySchema);