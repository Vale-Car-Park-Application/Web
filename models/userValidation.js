const Joi = require('Joi')

const signupValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    licencePlate: Joi.string().required(),
    vehicleType: Joi.string().required(),
    fuelType: Joi.string().required(),
    phoneNumber: Joi.string().required().regex(/^\d{3}-\d{3}-\d{4}$/)
})

module.exports = signupValidation