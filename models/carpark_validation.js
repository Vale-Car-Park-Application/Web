const joi = require('joi');

const areas = joi.array().items(joi.object({
    areaName: joi.string(),
    remainingTime: joi.number(),
    state: joi.boolean()
}))

const carparkValidation = joi.object({
    carparkName: joi.string().required(),
    areas: areas,
    carparkAttendant: joi.string(),
    contact: joi.string(),
    latitude: joi.number(),
    longitude: joi.number()

})

module.exports = carparkValidation