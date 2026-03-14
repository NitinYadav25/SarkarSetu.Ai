const express = require('express');
const router = express.Router();
const { sendAadharOtp, verifyAndRegister, loginUser, getProfile, updateProfile } = require('../controllers/userAuthController');
const { protectUser } = require('../middleware/authMiddleware');

router.post('/send-otp', sendAadharOtp);
router.post('/register', verifyAndRegister);
router.post('/login', loginUser);
router.route('/profile')
  .get(protectUser, getProfile)
  .put(protectUser, updateProfile);

module.exports = router;
