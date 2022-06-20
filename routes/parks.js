const express = require("express");
const router = express.Router();

//IMAGE UPLOAD
const multer = require("multer");
const { storage } = require("../cloudinary/index");
const upload = multer({ storage });

//CONTROLLER & MODEL FROM 'parks.js' IN CONTROLLER & MODELS DIRECTORY
const parks = require("../controllers/parks");
const Park = require("../models/park");

const catchAsync = require("../utilities/catchAsync");

//EXTERNAL MIDDLEWARE FROM 'middleware.js'
const { isLoggedIn } = require("../utilities/middleware");
const { path } = require("express/lib/application");

//ROUTES

router
  .route("/")
  //RENDER THE INDEX OF PARKS
  // JJ comments: Personally not a fan of catchAsynch,
  // The reason for catchAsync is it's suppose to be error handling, however it's confusing how the error is being handled
  // Looking at a better way to fix this.
  .get(catchAsync(parks.index));

router.route("/search").get(catchAsync(parks.search));

router
  .route("/:id")
  //RENDER THE INDIVIDUAL PARK PROFILE PAGE
  .get(catchAsync(parks.showPark))
  //POSTING NEW IMAGES
  .post(upload.array("image"), catchAsync(parks.addImages));

router
  .route("/:id/addImages")
  //RENDER 'addImages' FORM
  .get(isLoggedIn, catchAsync(parks.addImagesForm));

module.exports = router;
