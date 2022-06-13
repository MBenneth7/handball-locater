const ExpressError = require('./ExpressError'); //FROM 'ExpressError.js'
const { reviewSchema, commentSchema } = require('./joiSchemas'); //FROM 'schemas.js' USING 'joi' FOR 'reviewSchema' TO VALIDATE DATA
const Park = require('../models/park');
const Review = require('../models/review');
const Comment = require('../models/comment');

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

//VALIDATING THE COMMENTS ON THE SERVER SIDE

module.exports.validateComment = (req, res, next)=>{
    const{error} = commentSchema.validate(req.body);
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

    if(!req.isAuthenticated()){

        //KEEPING TRACK OF WHERE THE USER WAS DURING LOGIN, WE ADD TO THE 'req.session' OBJECT 'returnTo
        req.session.returnTo = req.originalUrl;

        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    next();
}

//CHECKING IF YOU ARE THE OWNER OF A REIVEW ON THE SERVER SIDE

module.exports.isReviewAuthor = async(req, res, next)=>{
    const{ id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/parks/${id}`);
    }

    next();
}

//CHECKING IF YOU ARE THE OWNER OF A COMMENT ON SERVER SIDE

module.exports.isCommentAuthor = async(req, res, next)=>{
    const{ id, commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if(!comment.author.equals(req.user._id)){
        req.flash('error', 'You do not have permission to do that!');
        return res.redirect(`/parks/${id}`);
    }

    next();
}