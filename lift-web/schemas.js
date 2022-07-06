const Joi = require('joi');

module.exports.workoutSchema = Joi.object({
    workout: Joi.object({
        name: Joi.string().required(),
        date: Joi.date().required()
    }).required()
});

module.exports.exerciseSchema = Joi.object({
    exercise: Joi.object({
        name: Joi.string().required()
    }).required()
})

module.exports.setSchema = Joi.object({
    set: Joi.object({
        weightCompleted: Joi.number().required().min(0),
        repsCompleted: Joi.number().required().min(0)
    }).required()
})