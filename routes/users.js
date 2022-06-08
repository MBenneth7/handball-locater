const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utilities/catchAsync');
const passport = require('passport');

//CONTROLLER FROM 'users.js' IN CONTROLLER DIRECTORY
const users = require('../controllers/users');

router.route('/register')
    //DISPLAYING REGISTER FORM
    .get(users.renderRegister)
    //REGISTERING A NEW USER
    .post(catchAsync(users.register))

router.route('/login')
    //DISPLAYING LOGIN FORM
    .get(users.renderLogin)
    //LOGGING USER IN
     //'passport.authenticate()' IS A MIDDLEWARE FROM PASSPORT, ARGS SHOULD BE STRATAGIES WE ARE IMPLEMENTING
     .post( passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), users.login)

router.get('/logout', users.logout);

module.exports = router;
