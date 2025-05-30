// controllers/authController.js
const authService = require('../services/authService');

const signup = async (req, res) => {
  try {
    const { username, password, city, address, isPainter } = req.body;
    const user = await authService.signup(username, password, city, address, isPainter  );
    const { password: _, ...safeUser } = user.toObject();
    res.status(201).json({ message: 'User created', safeUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await authService.login(username, password);
    const { password: _, ...safeUser } = user.toObject();
    res.status(200).json({ message: 'Login successful', safeUser, token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login,
};