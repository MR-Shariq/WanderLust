const express = require('express');
const router = express.Router({mergeParams: true});
const { reviewSchema } = require("../schema.js"); // Assuming your schema is in the schema.js file
const Review = require("../models/review.js"); // The Review model
const Listing = require("../models/listing.js"); // The Listing model
const ExpressError = require("../utils/ExpressError"); // The ExpressError class
const wrapAsync = require("../utils/wrapAsync.js");
const { validateReview } = require("../middlewares.js");
const { isLoggedIn } = require("../middlewares.js");
const { isReviewAuthor } = require("../middlewares.js");

const reviewController = require("../controllers/reviews.js");

// Add a new review to a listing
router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));


router.delete("/:review_id",  isLoggedIn, isReviewAuthor ,  wrapAsync(reviewController.deleteReview));

module.exports = router; // Export the router
