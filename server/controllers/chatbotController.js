const { chatbotAnswer } = require('../utils/openai');

// @route   POST /api/chatbot
// @access  Public (rate limited)
const chatbot = async (req, res, next) => {
  try {
    const { userProfile, availableSchemes, userQuestion } = req.body;

    const answer = await chatbotAnswer(userProfile, availableSchemes || [], userQuestion);

    res.json({ success: true, answer });
  } catch (err) {
    next(err);
  }
};

module.exports = { chatbot };
