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
    return `${scheme.name} - Aap is scheme ke liye eligible hain. Is scheme se aapko ${scheme.benefits[0] || 'financial help'} milega.`;
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
Do NOT use external knowledge. If the question is NOT related to these schemes, respond:
"Is profile ke basis par koi relevant scheme nahi mili. Kripya apna profile check karein."

USER PROFILE:
Age: ${userProfile.age}, Income: ₹${userProfile.income}/year, Occupation: ${userProfile.occupation}, State: ${userProfile.state}, Category: ${userProfile.category}

AVAILABLE SCHEMES:
${schemeList || 'No schemes available.'}

USER QUESTION: ${userQuestion}

Answer in simple Hindi-English mix. Be concise and helpful.`;

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
    return 'Maafi kijiye, abhi AI service available nahi hai. Thodi der baad try karein.';
  }
};

module.exports = { generateSchemeSummary, chatbotAnswer };
