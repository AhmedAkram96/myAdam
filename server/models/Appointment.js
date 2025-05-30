const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    painter: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    client: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        default: null 
    },
    startTime: { 
        type: Date, 
        required: true 
    },
    endTime: { 
        type: Date, 
        required: true 
    },
    status: { 
        type: String, 
        enum: ['available', 'booked', 'inprogress', 'done'],
        default: 'available' 
    },
    city: { 
        type: String, 
        required: true 
    }
}, {
    timestamps: true
});

// Index for efficient queries
appointmentSchema.index({ painter: 1, startTime: 1, endTime: 1 });
appointmentSchema.index({ user: 1, startTime: 1 });
appointmentSchema.index({ city: 1, status: 1, startTime: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema); 