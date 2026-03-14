const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Temporary in-memory store for OTPs
// Structure: { "123456789012": { otp: '123456', expiresAt: Date.now() + 5*60*1000, userData: { ... } } }
global.otpStore = global.otpStore || {};

const sendAadharOtp = async (req, res) => {
  try {
    const { name, email, password, age, income, gender, category, occupation, state, maritalStatus, aadharNumber } = req.body;

    // Validate Aadhar input
    if (!aadharNumber || aadharNumber.length !== 12 || isNaN(aadharNumber)) {
      return res.status(400).json({ success: false, message: 'Invalid Aadhar Number. Must be 12 digits.' });
    }

    // Check if user already exists
    const userExists = await User.findOne({ $or: [{ email }, { aadharNumber }] });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User with this Email or Aadhar already exists' });
    }

    // Hardcoded Fixed OTP for Demo Purposes
    const otp = '636769';

    // Store temporarily for 5 mins
    global.otpStore[aadharNumber] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      userData: { name, email, password, age, income, gender, category, occupation, state, maritalStatus, aadharNumber }
    };

    // LOG TO TERMINAL FOR DEMO PURPOSES
    console.log('\n=========================================');
    console.log('       A A D H A R   O T P               ');
    console.log(` Aadhar: ${aadharNumber}`);
    console.log(` OTP:    ${otp}`);
    console.log('=========================================\n');

    res.json({ success: true, message: 'OTP sent! For demo purposes, please use the fixed OTP: 636769' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ success: false, message: 'Server error during OTP generation' });
  }
};

const verifyAndRegister = async (req, res) => {
  try {
    const { aadharNumber, otp } = req.body;

    const tempUser = global.otpStore[aadharNumber];

    if (!tempUser) {
      return res.status(400).json({ success: false, message: 'No pending registration found for this Aadhar. Please request a new OTP.' });
    }

    if (Date.now() > tempUser.expiresAt) {
      delete global.otpStore[aadharNumber];
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    if (tempUser.otp !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // OTP verified, create user
    const user = await User.create({
      ...tempUser.userData,
      age: Number(tempUser.userData.age),
      income: Number(tempUser.userData.income),
    });

    // Clear memory store
    delete global.otpStore[aadharNumber];

    if (user) {
      res.status(201).json({
        success: true,
        user: { id: user._id, name: user.name, email: user.email, aadharNumber: user.aadharNumber },
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data during creation' });
    }
  } catch (error) {
    console.error('Registration verification error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      res.json({
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json({ success: true, user });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update only allowed fields
      user.name = req.body.name || user.name;
      user.age = req.body.age ? Number(req.body.age) : user.age;
      user.income = req.body.income ? Number(req.body.income) : user.income;
      user.gender = req.body.gender || user.gender;
      user.category = req.body.category || user.category;
      user.occupation = req.body.occupation || user.occupation;
      user.state = req.body.state || user.state;
      user.maritalStatus = req.body.maritalStatus || user.maritalStatus;
      
      // Note: We intentionally do NOT update email, password, or aadharNumber here

      const updatedUser = await user.save();

      res.json({
        success: true,
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          email: updatedUser.email,
          aadharNumber: updatedUser.aadharNumber,
          age: updatedUser.age,
          income: updatedUser.income,
          gender: updatedUser.gender,
          category: updatedUser.category,
          occupation: updatedUser.occupation,
          state: updatedUser.state,
          maritalStatus: updatedUser.maritalStatus
        }
      });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ success: false, message: 'Server error during profile update' });
  }
};

module.exports = { sendAadharOtp, verifyAndRegister, loginUser, getProfile, updateProfile };
