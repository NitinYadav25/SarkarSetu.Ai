const express = require('express');
const router = express.Router();
const { checkEligibility, getMySchemes } = require('../controllers/eligibilityController');
const { validate, eligibilitySchema } = require('../middleware/validateMiddleware');
const { protectUser } = require('../middleware/authMiddleware');

router.post('/', validate(eligibilitySchema), checkEligibility);
router.get('/my-schemes', protectUser, getMySchemes);

module.exports = router;
