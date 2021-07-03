const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tokenSchema = new Schema({
    token: {
        type: String,
        required: true
    },
    // created_at: {
    //     type: Date,
    //     required: true,
    //     default: Date.now()
    // }
    interval: {
        type: Number,
        default: 1439
    }
}, { collection: 'token_black_list' })

const Token = mongoose.model('token_black_list', tokenSchema)

module.exports = Token;