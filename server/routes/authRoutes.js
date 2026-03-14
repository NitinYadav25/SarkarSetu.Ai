const express = require('express');
const router = express.Router();
const { login, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validate, loginSchema } = require('../middleware/validateMiddleware');

router.post('/login', validate(loginSchema), login);
router.get('/me', protect, getMe);

module.exports = router;
