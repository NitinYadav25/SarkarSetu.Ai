const Joi = require('joi');

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message).join(', ');
    return res.status(422).json({ success: false, message: messages });
  }
  next();
};

// Schema: Eligibility form
const eligibilitySchema = Joi.object({
  age: Joi.number().integer().min(1).max(120).required(),
  gender: Joi.string().valid('male', 'female', 'other').required(),
  income: Joi.number().min(0).required(),
  state: Joi.string().trim().required(),
  category: Joi.string().valid('SC', 'ST', 'OBC', 'General', 'All', 'Women', 'Minority').required(),
  occupation: Joi.string().trim().required(),
});

// Schema: Chatbot request
const chatbotSchema = Joi.object({
  userProfile: Joi.object({
    age: Joi.number().required(),
    gender: Joi.string().required(),
    income: Joi.number().required(),
    state: Joi.string().required(),
    category: Joi.string().required(),
    occupation: Joi.string().required(),
  }).required(),
  availableSchemes: Joi.array().required(),
  userQuestion: Joi.string().trim().min(1).max(500).required(),
});

// Schema: Admin login
const loginSchema = Joi.object({
  username: Joi.string().trim().required(),
  password: Joi.string().min(6).required(),
});

// Schema: Scheme create/update
const schemeSchema = Joi.object({
  name: Joi.string().trim().required(),
  category: Joi.string().valid('SC', 'ST', 'OBC', 'General', 'All', 'Women', 'Minority').required(),
  description: Joi.string().trim().required(),
  benefits: Joi.array().items(Joi.string()).min(1).required(),
  minAge: Joi.number().min(0).required(),
  maxAge: Joi.number().min(0).optional(),
  maxIncome: Joi.number().min(0).required(),
  occupation: Joi.array().items(Joi.string()).min(1).required(),
  state: Joi.array().items(Joi.string()).min(1).required(),
  documents: Joi.array().items(Joi.string()).min(1).required(),
  applyLink: Joi.string().uri().optional().allow(''),
  isActive: Joi.boolean().optional(),
});

module.exports = { validate, eligibilitySchema, chatbotSchema, loginSchema, schemeSchema };
