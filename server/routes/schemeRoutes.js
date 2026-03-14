const express = require('express');
const router = express.Router();
const {
  getAllSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  getAllSchemesAdmin,
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

module.exports = router;
