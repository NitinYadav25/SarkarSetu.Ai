const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Scheme name is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['All', 'SC', 'ST', 'OBC', 'General', 'Women', 'Minority'],
      default: 'All',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    benefits: [
      {
        type: String,
        required: true,
      },
    ],
    // Targeting Criteria
    minAge: { type: Number, default: 0 },
    maxAge: { type: Number, default: 120 },
    maxIncome: { type: Number, default: 10000000 },
    occupation: [{ type: String, lowercase: true, default: ['all'] }],
    state: [{ type: String, default: ['All'] }],
    documents: [{ type: String }],
    applyLink: { type: String },
    isActive: { type: Boolean, default: true },
    applicationStart: { type: Date },
    applicationEnd: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scheme', schemeSchema);
