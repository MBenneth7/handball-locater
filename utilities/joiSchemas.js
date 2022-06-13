const Joi = require('joi');

//REQUIRING THE DATA FOR REVIEWS ON THE SERVER SIDE

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        body: Joi.string().required()
    }).required()
});

//REQUIRING THE DATA FOR COMMENTS ON THE SERVER SIDE

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        body: Joi.string().required(),
    }).required()
});