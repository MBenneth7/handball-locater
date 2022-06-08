const express = require('express');
const router = express.Router();

//CONTROLLER FROM 'parks.js' IN CONTROLLER DIRECTORY
const parks = require('../controllers/parks');

const Park = require('../models/park');
const catchAsync = require('../utilities/catchAsync'); 

//EXTERNAL MIDDLEWARE FROM 'middleware.js'
const {isLoggedIn} = require('../utilities/middleware');
const { path } = require('express/lib/application');

router.route('/')
    //RENDER THE INDEX OF PARKS
    .get(catchAsync(parks.index));

router.route('/:id')
    //RENDER THE INDIVIDUAL PARK PROFILE PAGE
    .get(catchAsync(parks.showPark));    


module.exports = router;    