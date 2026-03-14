const Scheme = require('../models/Scheme');
const { runEligibilityEngine } = require('../utils/eligibilityEngine');
const { generateSchemeSummary } = require('../utils/openai');

// @route   POST /api/check-eligibility
// @access  Public
const checkEligibility = async (req, res, next) => {
  try {
    const userProfile = req.body;

    // Fetch all active schemes from DB
    const schemes = await Scheme.find({ isActive: true });

    if (!schemes.length) {
      return res.json({ success: true, results: [], message: 'No schemes available right now.' });
    }

    // Run rule-based engine
    const matched = runEligibilityEngine(userProfile, schemes);

    if (!matched.length) {
      return res.json({
        success: true,
        results: [],
        message: 'Aapke profile ke liye koi matching scheme nahi mili. Criteria alag ho sakta hai.',
      });
    }

    // Generate AI summaries for each matched scheme (parallel)
    const resultsWithSummaries = await Promise.all(
      matched.map(async ({ scheme, matchPercent }) => {
        const aiSummary = await generateSchemeSummary(scheme, userProfile);
        return {
          scheme,
          matchPercent,
          aiSummary,
        };
      })
    );

    res.json({ success: true, results: resultsWithSummaries, userProfile });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/check-eligibility/my-schemes
// @access  Private (User)
const getMySchemes = async (req, res, next) => {
  try {
    const userProfile = req.user; // populated by protectUser middleware
    
    // Fetch all active schemes
    const schemes = await Scheme.find({ isActive: true });

    if (!schemes.length) {
      return res.json({ success: true, results: [], message: 'No schemes available right now.' });
    }

    // Run engine using user's saved demographics
    const matched = runEligibilityEngine(userProfile, schemes);

    if (!matched.length) {
      return res.json({
        success: true,
        results: [],
        message: 'Aapke profile ke liye koi matching scheme nahi mili.',
      });
    }

    // Return without AI summaries to make it fast for the dashboard, 
    // or we can generate summaries later. For now, just return matches.
    res.json({ success: true, results: matched, userProfile });
  } catch (err) {
    next(err);
  }
};

module.exports = { checkEligibility, getMySchemes };
