/**
 * Rule-Based Eligibility Engine
 * Matches user profile against scheme criteria and returns top 3 by score.
 */

/**
 * @param {Object} userProfile - { age, gender, income, state, category, occupation }
 * @param {Array} schemes - list of Scheme documents from DB
 * @returns {Array} top 3 matched schemes with relevanceScore and matchPercent
 */
const runEligibilityEngine = (userProfile, schemes) => {
  const { age, income, state, category, occupation } = userProfile;

  const scored = schemes
    .filter((scheme) => scheme.isActive)
    .map((scheme) => {
      let score = 0;
      let maxScore = 0;

      // ── Age Check ──────────────────────────────────────
      maxScore += 20;
      const minAge = scheme.minAge || 0;
      const maxAge = scheme.maxAge || 120;
      if (age >= minAge && age <= maxAge) {
        score += 20;
      } else {
        return null; // Hard disqualification
      }

      // ── Income Check ───────────────────────────────────
      maxScore += 25;
      if (income <= scheme.maxIncome) {
        // Proportional score: lower income relative to cap = better score
        const ratio = 1 - income / scheme.maxIncome;
        score += Math.round(25 * (0.5 + ratio * 0.5));
      } else {
        return null; // Hard disqualification
      }

      // ── State Check ────────────────────────────────────
      maxScore += 20;
      const schemeStates = scheme.state.map((s) => s.toLowerCase());
      if (schemeStates.includes('all') || schemeStates.includes(state.toLowerCase())) {
        score += 20;
      } else {
        return null; // Hard disqualification
      }

      // ── Category Check ────────────────────────────────
      maxScore += 20;
      const schemeCategory = scheme.category.toLowerCase();
      if (schemeCategory === 'all' || schemeCategory === category.toLowerCase()) {
        score += 20;
      } else {
        // Soft disqualifier - still partially eligible for general/all categories
        if (schemeCategory === 'all') {
          score += 10;
        }
      }

      // ── Occupation Check (Smart Filtering) ────────────
      maxScore += 40; // Increased weight for targeted occupations
      const schemeOccupations = scheme.occupation.map((o) => o.toLowerCase());
      const userOcc = occupation.toLowerCase();
      
      const isGeneralScheme = schemeOccupations.includes('all');
      const isExactMatch = schemeOccupations.includes(userOcc);

      if (isExactMatch) {
        // Direct targeted match gets the highest possible boost
        score += 40;
      } else if (isGeneralScheme) {
        // General schemes are okay, but lower priority than targeted ones
        score += 15;
      } else {
        // Scheme is for specific occupations, but the user does not match.
        return null; // Hard Disqualification
      }

      const matchPercent = Math.min(100, Math.round((score / maxScore) * 100));

      return {
        scheme,
        relevanceScore: score,
        matchPercent,
      };
    })
    .filter(Boolean) // remove null (disqualified)
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, 6); // Provide up to 6 smart recommendations

  return scored;
};

module.exports = { runEligibilityEngine };
