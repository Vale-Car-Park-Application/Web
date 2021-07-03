const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carparkSchema = new Schema({
    carparkName: {
        type: String,
        required: true
    },
    areas: [{
        areaName: {
            type: String
        },
        remainingTime: {
            type: Number
        },
        reservationState: {
            type: Boolean,
            default: false
        },
        isFull: {
            type: Boolean,
            default: false
        },
        user_id: {
            type: String,
            default: null
        }
    }],
    carparkAttendant: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    latitude: {
        type: Number,
        required: true,
    },
    longitude: {
        type: Number,
        required: true
    },
}, { collection: 'carparks' })

const Carpark = mongoose.model('carparks', carparkSchema)

module.exports = Carpark;