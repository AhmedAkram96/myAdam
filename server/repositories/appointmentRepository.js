const Appointment = require('../models/Appointment');

const createAppointments = async (appointmentsData) => {
    try {
        return await Appointment.insertMany(appointmentsData);
    } catch (error) {
        throw error;
    }
};

const findExistingAppointment = async ({ painter, startTime, endTime }) => {
    try {
        return await Appointment.findOne({
            painter,
            startTime,
            endTime,
        });
    } catch (error) {
        throw error;
    }
};

const getPainterAppointments = async (painterId, status, startTime) => {
    try {
        const query = { painter: painterId };
        
        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        // Add startTime filter if provided
        if (startTime) {
            query.startTime = { $gte: new Date(startTime) };
        }

        return await Appointment.find(query)
            .populate({
                path: 'client',
                select: 'username email'
            })
            .select('-painter')
            .sort({ startTime: 1 });
    } catch (error) {
        throw error;
    }
};

const getClientAppointments = async (clientId, status, startTime) => {
    try {
        const query = { client: clientId };
        
        // Add status filter if provided
        if (status) {
            query.status = status;
        }

        // Add startTime filter if provided
        if (startTime) {
            query.startTime = { $gte: new Date(startTime) };
        }

        return await Appointment.find(query)
            .populate('painter', 'username email')
            .sort({ startTime: 1 });
    } catch (error) {
        throw error;
    }
};

const findAvailableAppointmentsInCity = async ({ city, startTime, endTime }) => {
    try {
        return await Appointment.find({
            status: 'available',
            city,
            startTime: { $lte: startTime },
            endTime: { $gte: endTime }
        })
        .populate('painter', 'username email')
        .sort({ startTime: 1 });
    } catch (error) {
        throw error;
    }
};

const findNearestAvailableAppointment = async ({ city, fromDate }) => {
    try {
        return await Appointment.findOne({
            status: 'available',
            city,
            startTime: { $gte: fromDate }
        })
        .populate('painter', 'username email')
        .sort({ startTime: 1 });
    } catch (error) {
        throw error;
    }
};

const bookAppointment = async (appointmentId, userId) => {
    try {
        return await Appointment.findByIdAndUpdate(
            appointmentId,
            {
                client: userId,
                status: 'booked'
            },
            { new: true }
        ).populate('painter', 'username email');
    } catch (error) {
        throw error;
    }
};

const getAppointmentById = async (appointmentId) => {
    try {
        return await Appointment.findById(appointmentId);
    } catch (error) {
        throw error;
    }
};

const updateAppointmentStatus = async (appointmentId, status) => {
    try {
        return await Appointment.findByIdAndUpdate(
            appointmentId,
            { status },
            { new: true }
        );
    } catch (error) {
        throw error;
    }
};

module.exports = {
    createAppointments,
    findExistingAppointment,
    getPainterAppointments,
    getClientAppointments,
    findAvailableAppointmentsInCity,
    findNearestAvailableAppointment,
    bookAppointment,
    getAppointmentById,
    updateAppointmentStatus
}; 