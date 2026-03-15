const express = require('express');
const router = express.Router();
const {
  getAllSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  getAllSchemesAdmin,
  triggerScrape,
} = require('../controllers/schemeController');
const { protect } = require('../middleware/authMiddleware');
const { validate, schemeSchema } = require('../middleware/validateMiddleware');

// Public
router.get('/', getAllSchemes);
router.get('/admin/all', protect, getAllSchemesAdmin);
router.get('/:id', getSchemeById);

// Admin protected
router.post('/', protect, validate(schemeSchema), createScheme);
router.put('/:id', protect, validate(schemeSchema), updateScheme);
router.delete('/:id', protect, deleteScheme);
router.post('/scrape', protect, triggerScrape);

module.exports = router;
