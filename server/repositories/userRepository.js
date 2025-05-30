// repositories/userRepository.js
const User = require('../models/User');

const createUser = async (userData) => {
  const user = new User(userData);
  return await user.save();
};

const findUserByUsername = async (username) => {
  return await User.findOne({ username });
};

const findUserById = async(userId) => {
  return await User.findById(userId)
}

module.exports = {
  createUser,
  findUserByUsername,
  findUserById
};