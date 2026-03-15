const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Generate a short Hindi-English summary explaining a scheme to a user.
 */
const generateSchemeSummary = async (scheme, userProfile) => {
  const prompt = `You are SarkarSetu AI, a government scheme assistant.

Explain the following government scheme in very simple Hindi-English mixed language.

Keep it:
- Clear and friendly
- Short (under 120 words)
- Mention why THIS user is eligible

SCHEME:
Name: ${scheme.name}
Benefits: ${scheme.benefits.join(', ')}
Category: ${scheme.category}
Max Income Limit: ₹${scheme.maxIncome}/year

USER PROFILE:
Age: ${userProfile.age}
Income: ₹${userProfile.income}/year
Occupation: ${userProfile.occupation}
State: ${userProfile.state}
Category: ${userProfile.category}

Write a helpful, encouraging summary.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 200,
      temperature: 0.7,
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI summary error:', error.message);
    return `${scheme.name} - You are eligible for this scheme. It will provide you with ${scheme.benefits[0] || 'financial support'}.`;
  }
};

/**
 * Chatbot: answer user question grounded only in given schemes.
 */
const chatbotAnswer = async (userProfile, availableSchemes, userQuestion) => {
  const schemeList = availableSchemes
    .map(
      (s, i) =>
        `${i + 1}. ${s.name}: ${s.description}. Benefits: ${s.benefits.join(', ')}.`
    )
    .join('\n');

  const prompt = `You are SarkarSetu AI, a helpful government scheme assistant.

STRICT RULE: You must ONLY answer from the provided scheme list below.
Do NOT use external knowledge. 
FUZZY MATCHING RULE: If the user misspells a scheme name, but it sounds similar or matches at least 30% of an actual scheme name, treat it as a valid match and provide the relevant scheme info.
If the question is completely unrelated to government schemes or the provided list, respond:
"No relevant schemes were found based on this profile. Please update your profile information."

USER PROFILE:
Age: ${userProfile.age}, Income: ₹${userProfile.income}/year, Occupation: ${userProfile.occupation}, State: ${userProfile.state}, Category: ${userProfile.category}

AVAILABLE SCHEMES:
${schemeList || 'No schemes available.'}

USER QUESTION: ${userQuestion}

CRITICAL LANGUAGE RULE: 
- Your DEFAULT language must be ENGLISH.
- If the user asks their question in Hindi (Devanagari or Roman/Hinglish), ONLY THEN you MUST reply ONLY in Hindi.
- If the user asks in English, you MUST reply ONLY in English.
- Do NOT mix languages. Match the user's exact preferred language.
- Be concise, friendly, and helpful.`;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
      temperature: 0.5,
    });
    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error('OpenAI chatbot error:', error.message);
    return 'Sorry, the AI service is currently unavailable. Please try again later.';
  }
};

module.exports = { generateSchemeSummary, chatbotAnswer };
