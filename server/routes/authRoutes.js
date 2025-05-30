// routes/authRoutes.js
const express = require('express');
const authController = require('../controllers/authController');
const { authenticate } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// test Protected route
router.get('/profile', authenticate, (req, res) => {
  res.status(200).json({ message: 'Profile accessed', user: req.user });
});

module.exports = router;