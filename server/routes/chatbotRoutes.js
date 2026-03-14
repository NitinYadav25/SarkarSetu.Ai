const express = require('express');
const rateLimit = require('express-rate-limit');
const router = express.Router();
const { chatbot } = require('../controllers/chatbotController');
const { validate, chatbotSchema } = require('../middleware/validateMiddleware');

// Strict rate limit for chatbot (AI is expensive)
const chatbotLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { success: false, message: 'Chatbot rate limit exceeded. Please try again in 15 minutes.' },
});

router.post('/', chatbotLimiter, validate(chatbotSchema), chatbot);

module.exports = router;
