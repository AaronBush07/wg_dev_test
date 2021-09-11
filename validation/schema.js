const Joi = require('joi')

const schema = Joi.object().keys({
    pricemin: Joi.number(),
    pricemax: Joi.number(),
    fantastic: Joi.boolean(),
    rating: Joi.number(),
    limit: Joi.number(),
    offset: Joi.number()
})

module.exports = validate = async(data) => {
    return await schema.validate(data, {abortEarly:false})
}