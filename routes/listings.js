const express= require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middlewares.js");
const {isOwner} = require("../middlewares.js");
const {validateListing} = require("../middlewares.js");
const multer  = require('multer');
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage });


const listingController = require("../controllers/listings.js");


//Index Route and Create Route
router.route("/")
    .get(wrapAsync(listingController.index))
    .post( isLoggedIn ,   upload.single("listing[image]"), validateListing , wrapAsync(listingController.createListing));

   
      

    //New Route
    router.get("/new", isLoggedIn, listingController.renderNewForm);

    router.get("/search", wrapAsync(listingController.searchListings));

//Show, Update and Delete Routes
router.route("/:id")
       .get(wrapAsync(listingController.showListing))
        .put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing, wrapAsync(listingController.updateListing))
        .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));


  
  //edit route
router.get("/:id/edit" , isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));
  
  
  
    module.exports = router;


