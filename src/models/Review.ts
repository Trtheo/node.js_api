import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  rating: { 
    type: Number, 
    required: true, 
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot exceed 5']
  },
  comment: { type: String, trim: true, maxlength: [500, 'Comment cannot exceed 500 characters'] },
  verified: { type: Boolean, default: false }
}, { timestamps: true });

reviewSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);