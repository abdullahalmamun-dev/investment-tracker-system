const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  profitOrLoss: { type: String, enum: ['profit', 'loss'], required: true },
  description: { type: String, trim: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true, min: 0 },
  profitOrLossAmount: { type: Number, required: true, min: 0 }, // New field
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Investment', investmentSchema);
