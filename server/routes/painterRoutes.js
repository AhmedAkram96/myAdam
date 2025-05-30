const express = require('express');
const router = express.Router();
const painterController = require('../controllers/painterController');
const {authenticate} = require('../middlewares/authMiddleware');
const {verifyPainter} = require('../middlewares/identityMiddleware');


// Apply authentication and painter verification to all routes
router.use(authenticate);
router.use(verifyPainter);

// Create new available appointments
router.post('/appointments', painterController.submitAvailability);

// Get all appointments for the authenticated painter
router.get('/appointments', painterController.getPainterAppointments);

module.exports = router; 