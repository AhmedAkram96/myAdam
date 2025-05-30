const painterService = require('../services/painterService');

const submitAvailability = async (req, res) => {
    try {
        const painterId = req.user.userId;
        const { appointments } = req.body;

        if (!appointments || !Array.isArray(appointments) || appointments.length === 0) {
            return res.status(400).json({ message: 'At least one appointment with startTime and endTime is required' });
        }

        // Validate each appointment
        for (const appointment of appointments) {
            if (!appointment.startTime || !appointment.endTime) {
                return res.status(400).json({ message: 'Each appointment must have startTime and endTime' });
            }

            // Validate date format
            const startDate = new Date(appointment.startTime);
            const endDate = new Date(appointment.endTime);

            if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
                return res.status(400).json({ 
                    message: 'Invalid date format. Please use ISO 8601 format' 
                });
            }

            if (startDate >= endDate) {
                return res.status(400).json({ 
                    message: 'startTime must be before endTime for each appointment' 
                });
            }
        }

        const result = await painterService.submitAvailability(painterId, appointments);

        if (result.duplicates && result.duplicates.length > 0) {
            return res.status(400).json({
                message: 'Some appointments were not added due to conflicts',
                duplicates: result.duplicates,
                addedAppointments: result.addedAppointments
            });
        }

        res.status(201).json({
            message: 'All appointments added successfully',
            appointments: result.addedAppointments
        });
    } catch (error) {
        if (error.message === 'Painter not found') {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: 'Error creating appointments', error: error.message });
    }
};

const getPainterAppointments = async (req, res) => {
    try {
        const painterId = req.user.userId;
        const { status, startTime } = req.query;

        // Validate status if provided
        if (status && !['available', 'booked', 'inprogress', 'finished', 'cancelled'].includes(status)) {
            return res.status(400).json({ 
                message: 'Invalid status. Must be one of: available, booked, inprogress, finished, cancelled' 
            });
        }

        // Validate startTime if provided
        if (startTime) {
            const startDate = new Date(startTime);
            if (isNaN(startDate.getTime())) {
                return res.status(400).json({ 
                    message: 'Invalid startTime format. Please use ISO 8601 format' 
                });
            }
        }

        const appointments = await painterService.getPainterAvailability(painterId, status, startTime);
        res.status(200).json({
            message: 'Appointments retrieved successfully',
            appointments
        });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching appointments', error: error.message });
    }
};

module.exports = {
    submitAvailability,
    getPainterAppointments
};