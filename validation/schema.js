const Joi = require('joi')

const schema = Joi.object().keys({
    pricemin: Joi.number().positive(),
    pricemax: Joi.number().when('pricemin', {
        is: Joi.exist(), 
        then: Joi.number().greater(Joi.ref('pricemin'))
    }).positive(),
    fantastic: Joi.bool(),
    rating: Joi.number().positive(),
    limit: Joi.number().positive(),
    offset: Joi.number().positive()
})

module.exports = validate = async(data) => {
    return await schema.validate(data, {abortEarly:false})
}