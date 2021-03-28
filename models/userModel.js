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
    googleId: {
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
    }
}, { collection: 'users2' })

const User = mongoose.model('users2', userSchema)

module.exports = User;