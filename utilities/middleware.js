const ExpressError = require('./ExpressError'); //FROM 'ExpressError.js'
const { reviewSchema } = require('./joiSchemas'); //FROM 'schemas.js' USING 'joi' FOR 'reviewSchema' TO VALIDATE DATA
const Park = require('../models/park');
const Review = require('../models/review');

//VALIDATING THE REVIEWS ON THE SERVER SIDE

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

//CHECKING IF USER IS LOGGED IN

module.exports.isLoggedIn = (req, res, next) =>{

    //'req.user' IS FROM PASSPORT
    //console.log('REQ.USER...', req.user);

    if(!req.isAuthenticated()){
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}