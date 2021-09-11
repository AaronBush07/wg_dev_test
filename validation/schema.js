const Joi = require('joi')

/**All requests to products are validated here according to the below ruleset. 
 * Unknown keys are not allowed. All keys are currently optional. 
 */
const schema = Joi.object().keys({
    pricemin: Joi.number().positive(),
    pricemax: Joi.number().when('pricemin', {
        is: Joi.exist(), 
        then: Joi.number().greater(Joi.ref('pricemin'))
    }).positive(),
    fantastic: Joi.bool(),
    ratingmin: Joi.number().positive(),
    ratingmax: Joi.number().when('ratingmin', {
        is: Joi.exist(), 
        then: Joi.number().greater(Joi.ref('ratingmin'))
    }).positive(),
    limit: Joi.number().positive(),
    offset: Joi.number().positive()
})

module.exports = validate = async(data) => {
    return await schema.validate(data, {abortEarly:false})
}