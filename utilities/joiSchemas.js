const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

//EXTENTSION TO PREVENT CROSS-SCRIPTING, WE SANITIZE INPUTS FROM POTENTIAL JS SCRIPTS

const extension = (joi) =>({
    type: 'string',
    base: joi.string(),
    messages:{
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules:{
        escapeHTML: {
            validate(value, helpers){
                const clean = sanitizeHTML(value,{
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});

//ADDING EXTENSION ON TOP OF 'joi'

const Joi = BaseJoi.extend(extension); 

//REQUIRING THE DATA FOR REVIEWS ON THE SERVER SIDE

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required().escapeHTML()
    }).required()
});

//REQUIRING THE DATA FOR COMMENTS ON THE SERVER SIDE

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required().escapeHTML()
    }).required()
}); 