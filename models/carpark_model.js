const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const carparkSchema = new Schema({
    carparkName: {
        type: String
    },
    areas: [{
        areaName: {
            type: String
        },
        remainingTime: {
            type: Number
        },
        state: {
            type: boolean,
            default: false
        }
    }],
    carparkAttendant: String,
    contact: String,
    latitude: Number,
    longitude: Number
}, { collection: 'carparks' })

const Carpark = mongoose.model('carparks', carparkSchema)

module.exports = Carpark;