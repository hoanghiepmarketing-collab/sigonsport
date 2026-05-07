const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:          { type: String, required: true },
  brand:         { type: String, default: '' },
  sport:         { type: String, default: '' },
  category:      { type: String, default: '' },
  price:         { type: Number, required: true },
  originalPrice: { type: Number },
  discount:      { type: Number, default: 0 },
  img:           { type: String, default: '' },
  images:        [String],
  sizes:         [Number],
  colors:        [String],
  rating:        { type: Number, default: null },
  reviewCount:   { type: Number, default: 0 },
  sold:          { type: Number, default: 0 },
  isNew:         { type: Boolean, default: false },
  isHot:         { type: Boolean, default: false },
  isSecondhand:  { type: Boolean, default: false },
  inStock:       { type: Boolean, default: true },
  condition:     { type: String, default: '' },
  description:   { type: String, default: '' },
  tags:          [String],
}, { timestamps: true });

productSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);
