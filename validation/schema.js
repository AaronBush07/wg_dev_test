const Joi = require('joi')

/**All requests to products are validated here according to the below ruleset. 
 * Unknown keys are not allowed. All keys are currently optional. 
 * When corresponding min and max numbers are present, 
 * Joi will check if the max number is at least greater or equal to the min number.
 */
const schema = Joi.object().keys({
    pricemin: Joi.number().positive(),
    pricemax: Joi.number().when('pricemin', {
        is: Joi.exist(), 
        then: Joi.number().min(Joi.ref('pricemin'))
    }).positive(),
    fantastic: Joi.bool(),
    ratingmin: Joi.number().positive(),
    ratingmax: Joi.number().when('ratingmin', {
        is: Joi.exist(), 
        then: Joi.number().min(Joi.ref('ratingmin'))
    }).positive(),
    limit: Joi.number().positive(),
    offset: Joi.number().positive()
})

module.exports = validate = async(data) => {
    return await schema.validate(data, {abortEarly:false})
}