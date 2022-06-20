const express = require('express');
const router = express.Router({mergeParams: true}); 
const catchAsync = require('../utilities/catchAsync'); 

//CONTROLLER & MODEL FROM 'comments.js' IN CONTROLLER & MODELS DIRECTORY
const comments = require('../controllers/comments');
const comment = require('../models/comment');

//EXTERNAL MIDDLEWARE FROM 'middleware.js'
const{validateComment, isLoggedIn, isCommentAuthor} = require('../utilities/middleware');
const { path } = require('express/lib/application');

//ROUTES

//POSTING COMMENTS
router.route('/').post(isLoggedIn, validateComment, catchAsync(comments.postComment));

//DELETING COMMENTS
router.route('/:commentId').delete(isLoggedIn, isCommentAuthor, catchAsync(comments.deleteComment));

module.exports = router;