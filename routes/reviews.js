const express = require('express');
////////////////////////////////////////////////////////////////////////////////////////////////
const router = express.Router({mergeParams: true}); 
//IF WE DON'T EXPLCITILY STATE THE :id PROPERTY IN THIS FILE, WE HAVE TO USE 'mergeParams: true'
//TO MERGE THE :id PROPERTY FROM THE MAIN app.js FILE TO MAKE IT WORK IN THIS FILE

const Park = require('../models/park');
const Review = require('../models/review');
const catchAsync = require('../utilities/catchAsync'); 
const ExpressError = require('../utilities/ExpressError'); //FROM 'ExpressError.js'

//CONTROLLER FILE FROM 'reviews.js' IN CONTROLLER
const reviews = require('../controllers/reviews.js');

//EXTERNAL MIDDLEWARE FROM 'middleware.js'
const{validateReview, isLoggedIn, isReviewAuthor} = require('../utilities/middleware');

//CREATING A NEW REVIEW
router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

//DELETING A REVIEW
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;