const clientService = require('../services/clientService');

const getMyAppointments = async (req, res) => {
    try {
        const clientId = req.user.userId;
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

        const appointments = await clientService.getMyAppointments(clientId, status, startTime);
        res.status(200).json({
            message: 'Appointments retrieved successfully',
            appointments
        });
    } catch (error) {
        res.status(400).json({ message: 'Error fetching appointments', error: error.message });
    }
};

const requestAppointment = async (req, res) => {
    try {
        const clientId = req.user.userId;
        const { startTime, endTime } = req.body;

        if (!startTime || !endTime) {
            return res.status(400).json({ 
                message: 'Both startTime and endTime are required' 
            });
        }

        // Validate date format
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            return res.status(400).json({ 
                message: 'Invalid date format. Please use ISO 8601 format' 
            });
        }

        if (startDate >= endDate) {
            return res.status(400).json({ 
                message: 'startTime must be before endTime' 
            });
        }

        const result = await clientService.requestAppointment(clientId, { startTime, endTime });
        
        if (result.type === 'available_appointments') {
            return res.status(200).json({
                message: 'Available appointments found',
                appointments: result.appointments
            });
        } else {
            return res.status(200).json({
                message: 'No appointments found in requested time range. Here is the nearest available appointment:',
                nearestAppointment: result.appointment
            });
        }
    } catch (error) {
        if (error.message === 'Client not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'No painters are available for the requested time slot') {
            return res.status(404).json({ message: error.message });
        }
        res.status(400).json({ message: 'Error requesting appointment', error: error.message });
    }
};

const confirmAppointment = async (req, res) => {
    try {
        const clientId = req.user.userId;
        const { appointmentId } = req.body;

        const appointment = await clientService.confirmAppointment(clientId, appointmentId);
        res.status(200).json({
            message: 'Appointment confirmed successfully',
            appointment
        });
    } catch (error) {
        if (error.message === 'Appointment not found') {
            return res.status(404).json({ message: error.message });
        }
        if (error.message === 'Appointment is not in requested state') {
            return res.status(400).json({ message: error.message });
        }
        res.status(400).json({ message: 'Error confirming appointment', error: error.message });
    }
};

module.exports = {
    getMyAppointments,
    requestAppointment,
    confirmAppointment
}; 