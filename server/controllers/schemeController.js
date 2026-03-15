const Scheme = require('../models/Scheme');
const { scrapeJobs, scrapeSchemes, scrapeNotices } = require('../services/scraperService');

// @route   GET /api/schemes
// @access  Public
const getAllSchemes = async (req, res, next) => {
  try {
    const schemes = await Scheme.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: schemes.length, schemes });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/schemes/:id
// @access  Public
const getSchemeById = async (req, res, next) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found.' });
    }
    res.json({ success: true, scheme });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/schemes
// @access  Private (Admin)
const createScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.create(req.body);
    res.status(201).json({ success: true, scheme });
  } catch (err) {
    next(err);
  }
};

// @route   PUT /api/schemes/:id
// @access  Private (Admin)
const updateScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found.' });
    }
    res.json({ success: true, scheme });
  } catch (err) {
    next(err);
  }
};

// @route   DELETE /api/schemes/:id
// @access  Private (Admin)
const deleteScheme = async (req, res, next) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) {
      return res.status(404).json({ success: false, message: 'Scheme not found.' });
    }
    res.json({ success: true, message: 'Scheme deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/schemes/admin/all  (includes inactive)
// @access  Private (Admin)
const getAllSchemesAdmin = async (req, res, next) => {
  try {
    const schemes = await Scheme.find().sort({ createdAt: -1 });
    res.json({ success: true, count: schemes.length, schemes });
  } catch (err) {
    next(err);
  }
};

// @route   POST /api/schemes/scrape
// @access  Private (Admin)
const triggerScrape = async (req, res, next) => {
  try {
    const { type } = req.body; // 'Jobs', 'Schemes', or 'Notices'
    let result = { success: false, message: 'Invalid scrape type' };

    if (type === 'Jobs') {
      result = await scrapeJobs();
    } else if (type === 'Schemes') {
      result = await scrapeSchemes();
    } else if (type === 'Notices') {
      result = await scrapeNotices();
    }

    if (result.success) {
      res.json({ success: true, message: `Successfully scraped ${type}.` });
    } else {
      res.status(500).json({ success: false, message: `Failed to scrape ${type}.`, error: result.error });
    }
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllSchemes, getSchemeById, createScheme, updateScheme, deleteScheme, getAllSchemesAdmin, triggerScrape };
