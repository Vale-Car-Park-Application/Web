const joi = require('joi');

const areas = joi.object({
    _id: joi.string().length(24),
    areaName: joi.string(),
    remainingTime: joi.number(),
    reservationState: joi.boolean(),
    isFull: joi.boolean(),
    user_id: joi.string()
})

const carparkValidation = joi.object({
    carparkName: joi.string().required(),
    areas: joi.array().items(areas),
    carparkAttendant: joi.string(),
    contact: joi.string(),
    latitude: joi.number(),
    longitude: joi.number()

})

module.exports = { carparkValidation, areas }