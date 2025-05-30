const appointmentRepository = require('../repositories/appointmentRepository');
const userRepository = require('../repositories/userRepository');

const getMyAppointments = async (clientId, status, startTime) => {
    try {
        return await appointmentRepository.getClientAppointments(clientId, status, startTime);
    } catch (error) {
        throw error;
    }
};

const requestAppointment = async (clientId, { startTime, endTime }) => {
    try {
        // Get client's city
        const client = await userRepository.findUserById(clientId);
        if (!client) {
            throw new Error('Client not found');
        }

        // Find available appointments in client's city within the requested time range
        const availableAppointments = await appointmentRepository.findAvailableAppointmentsInCity({
            city: client.city,
            startTime: new Date(startTime),
            endTime: new Date(endTime)
        });

        if (availableAppointments.length > 0) {
            // Return all available appointments for the client to choose from
            return {
                type: 'available_appointments',
                appointments: availableAppointments
            };
        }

        // If no appointments found, find the nearest available appointment in the future
        const nearestAppointment = await appointmentRepository.findNearestAvailableAppointment({
            city: client.city,
            fromDate: new Date(startTime)
        });

        if (!nearestAppointment) {
            throw new Error('No painters are available for the requested time slot');
        }

        return {
            type: 'nearest_appointment',
            appointment: nearestAppointment
        };
    } catch (error) {
        throw error;
    }
};

const confirmAppointment = async (clientId, appointmentId) => {
    try {
        // Get the appointment
        const appointment = await appointmentRepository.getAppointmentById(appointmentId);
        if (!appointment) {
            throw new Error('Appointment not found');
        }


        // Check if appointment is in booked state
        if (appointment.status === 'booked') {
            throw new Error('Appointment is already booked');
        }

        // Update appointment status to confirmed
        return await appointmentRepository.bookAppointment(appointmentId, clientId);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getMyAppointments,
    requestAppointment,
    confirmAppointment
}; 