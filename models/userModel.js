const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        maxLength: 25
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        email: true,
        lowercase: true
    },
    password: {
        type: String,
    },
    phoneNumber: {
        type: String,
        unique: true
    },
    reservation: {
        carParkId: {
            type: String
        },
        state: {
            type: Boolean,
            default: false
        },
        reservationArea: {
            type: String
        }
    },
    licencePlate: {
        type: String,
        unique: true
    },
    vehicleType: {
        type: String
    },
    fuelType: {
        type: String
    }
}, { collection: 'users' })

const User = mongoose.model('users', userSchema)

module.exports = User;