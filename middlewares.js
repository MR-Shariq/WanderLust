const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError");
const { listingSchema , reviewSchema } = require("./schema.js");

// Middleware for checking if the user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //redirect url
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }
    next();
}

// Middleware for saving the redirect url
module.exports.savedRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl) {
        let redirectUrl = req.session.redirectUrl;
       res.locals.redirectUrl = redirectUrl;
    }
    next();
}
// Middleware for checking if the user is the owner of the listing
module.exports.isOwner =  async(req, res, next) => {
    let id = req.params.id;
    const listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You do not have permission to do that!");
        return res.redirect(`/listings/${id}`);
      }
        next();
}
// Middleware for validating listing data
module.exports.validateListing = (req, res, next) => {
    let result = listingSchema.validate(req.body);
    if (result.error) {
      let msg = result.error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };

// Middleware for validating review data
module.exports.validateReview = (req, res, next) => {
    const result = reviewSchema.validate(req.body);
    if (result.error) {
      const msg = result.error.details.map((el) => el.message).join(",");
      throw new ExpressError(msg, 400);
    } else {
      next();
    }
  };

  module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, review_id } = req.params; // Extract listing ID and review ID from parameters
    const review = await Review.findById(review_id); // Find the review by ID
  
    // Check if the review exists
    if (!review) {
      req.flash("error", "Review not found!");
      return res.redirect(`/listings/${id}`);
    }
  
    // Check if the currently logged-in user is the author of the review
    if (!review.author.equals(req.user._id)) {
      req.flash("error", "You are not authorized to edit or delete this review!");
      return res.redirect(`/listings/${id}`);
    }
  
    next(); // Proceed to the next middleware or route handler
  };
  