const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const {authenticate} = require('../middlewares/authMiddleware');
const {verifyClient} = require('../middlewares/identityMiddleware');

// Apply authentication and client verification to all routes
router.use(authenticate);
router.use(verifyClient);

// Get client's bookings
router.get('/appointments', clientController.getMyAppointments);

// Request a appointment
router.post('/appointments/request', clientController.requestAppointment);

// Confirm a appointment booking
router.post('/appointments/confirm', clientController.confirmAppointment);

module.exports = router;