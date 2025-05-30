// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, primaryKey: true },
  password: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String },
  isPainter: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);

