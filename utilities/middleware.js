const ExpressError = require('./ExpressError'); //FROM 'ExpressError.js'
const { reviewSchema } = require('./joiSchemas'); //FROM 'schemas.js' USING 'joi' FOR 'reviewSchema' TO VALIDATE DATA
const Park = require('../models/park');
const Review = require('../models/review');

module.exports.validateReview = (req, res, next) =>{
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message)
        throw new ExpressError(msg, 400);
    }
    else{
        next();
    }
}