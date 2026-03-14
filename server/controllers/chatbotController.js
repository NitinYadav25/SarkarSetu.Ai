const { chatbotAnswer } = require('../utils/openai');
const Scheme = require('../models/Scheme');

// @route   POST /api/chatbot
// @access  Public (rate limited)
const chatbot = async (req, res, next) => {
  try {
    const { userProfile, availableSchemes, userQuestion } = req.body;
    
    // If no specific schemes are passed from the frontend, fetch all schemes for global context.
    let schemes = availableSchemes;
    if (!schemes || schemes.length === 0) {
      schemes = await Scheme.find().lean();
    }

    const answer = await chatbotAnswer(userProfile, schemes, userQuestion);

    res.json({ success: true, answer });
  } catch (err) {
    next(err);
  }
};

module.exports = { chatbot };
