import mongoose from 'mongoose';

const portfolioSchema = new mongoose.Schema({
  title: {
    en: { type: String, required: true },
    hi: { type: String, required: true },
    mr: { type: String, required: true }
  },
  description: {
    en: { type: String, required: true },
    hi: { type: String, required: true },
    mr: { type: String, required: true }
  },
  images: [{
    type: String,
    required: true
  }],
  category: {
    type: String,
    required: true,
    enum: ['personal', 'acrylic', 'led', 'standees', 'stickers', 'hoardings', 'banners', 'other']
  },
  featured: {
    type: Boolean,
    default: false
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.models.Portfolio || mongoose.model('Portfolio', portfolioSchema);
