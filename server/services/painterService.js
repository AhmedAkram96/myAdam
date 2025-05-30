const appointmentRepository = require('../repositories/appointmentRepository');
const userRepository = require('../repositories/userRepository');

const submitAvailability = async (painterId, appointments) => {
    try {
        // Get painter's city
        const painter = await userRepository.findUserById(painterId);
        if (!painter) {
            throw new Error('Painter not found');
        }

        const addedAppointments = [];
        const duplicates = [];

        // Process each appointment
        for (const appointmentData of appointments) {
            // Check for existing appointment with same time
            const existingAppointment = await appointmentRepository.findExistingAppointment({
                painter: painterId,
                startTime: new Date(appointmentData.startTime),
                endTime: new Date(appointmentData.endTime)
            });

            if (existingAppointment) {
                duplicates.push(appointmentData);
                continue;
            }

            // Create new appointment
            const appointment = {
                ...appointmentData,
                painter: painterId,
                city: painter.city,
                status: 'available'
            };
            
            const newAppointment = await appointmentRepository.createAppointments([appointment]);
            addedAppointments.push(newAppointment[0]);
        }

        return {
            addedAppointments,
            duplicates: duplicates.length > 0 ? duplicates : undefined
        };
    } catch (error) {
        throw error;
    }
};

const getPainterAvailability = async (painterId, status, startTime) => {
    try {
        return await appointmentRepository.getPainterAppointments(painterId, status, startTime);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    submitAvailability,
    getPainterAvailability
};