const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
  // Eligibility / Demographic Fields
  age: { type: Number, required: true },
  income: { type: Number, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  category: { type: String, enum: ['General', 'OBC', 'SC', 'ST', 'Minority'], required: true },
  occupation: { type: String, required: true }, // e.g., Student, Farmer, etc.
  state: { type: String, required: true },
  maritalStatus: { type: String, enum: ['Single', 'Married', 'Widowed', 'Divorced'], required: true },

  // Aadhar Details for OTP
  aadharNumber: { type: String, required: true, unique: true, minlength: 12, maxlength: 12 },

  createdAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
