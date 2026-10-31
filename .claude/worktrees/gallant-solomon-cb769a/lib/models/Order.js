const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },
  customer: {
    name:     String,
    phone:    String,
    email:    String,
    address:  String,
    province: String,
    note:     String,
  },
  items: [{
    productId: String,
    name:      String,
    img:       String,
    price:     Number,
    size:      String,
    color:     String,
    quantity:  Number,
  }],
  subtotal:      { type: Number, default: 0 },
  shipping:      { type: Number, default: 30000 },
  total:         { type: Number, default: 0 },
  status: {
    type:    String,
    enum:    ['pending', 'confirmed', 'shipping', 'delivered', 'cancelled'],
    default: 'pending',
  },
  paymentMethod: { type: String, default: 'cod' },
}, { timestamps: true });

orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = `SIGON${String(count + 1).padStart(5, '0')}`;
  }
  next();
});

orderSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
