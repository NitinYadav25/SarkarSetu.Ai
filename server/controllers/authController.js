const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// Try to use Mongoose Admin model; fall back gracefully if DB is down
let Admin;
try {
  Admin = require('../models/Admin');
} catch (e) {
  Admin = null;
}

// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Please provide username and password.' });
    }

    const envUser = (process.env.ADMIN_USERNAME || 'admin').toLowerCase();
    const envPass = process.env.ADMIN_PASSWORD || 'admin123';

    // ───── PRIMARY: Match against .env credentials (always works) ─────
    if (username.toLowerCase() === envUser && password === envPass) {
      // Try to persist admin to MongoDB if DB is connected
      if (Admin) {
        try {
          let admin = await Admin.findOne({ username: envUser }).select('+password');
          if (!admin) {
            admin = await Admin.create({ username: envUser, password: envPass });
          }
          const token = generateToken(admin._id.toString());
          return res.json({
            success: true,
            token,
            admin: { id: admin._id, username: admin.username, role: admin.role || 'admin' },
          });
        } catch (dbErr) {
          // DB failed — fall through to env-only token
        }
      }

      // Fallback: issue a token with static ID (works without DB)
      const token = generateToken('local-admin-fallback');
      return res.json({
        success: true,
        token,
        admin: { id: 'local-admin-fallback', username: envUser, role: 'admin' },
      });
    }

    // ───── SECONDARY: Check MongoDB if .env credentials didn't match ─────
    if (Admin) {
      try {
        const admin = await Admin.findOne({ username: username.toLowerCase() }).select('+password');
        if (admin) {
          const isMatch = await admin.comparePassword(password);
          if (isMatch) {
            const token = generateToken(admin._id.toString());
            return res.json({
              success: true,
              token,
              admin: { id: admin._id, username: admin.username, role: admin.role || 'admin' },
            });
          }
        }
      } catch (dbErr) {
        // DB lookup failed — still return invalid credentials below
      }
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  } catch (err) {
    next(err);
  }
};

// @route   GET /api/auth/me
// @access  Private (Admin)
const getMe = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

module.exports = { login, getMe };
