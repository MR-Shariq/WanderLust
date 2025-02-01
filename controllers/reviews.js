const Listing = require("../models/listing");
const Review = require("../models/review");


module.exports.createReview =  async (req, res, next) => {
    const { id } = req.params; // ID of the listing
    const review = new Review(req.body.review); // Create a new review object from request data
    const listing = await Listing.findById(id); // Find the corresponding listing
  
    if (!listing) {
      req.flash("error", "Listing not found!");
      return res.redirect("/listings");
    }
  
    review.author = req.user._id; // Set the review's author to the currently logged-in user
    listing.reviews.push(review); // Add the review to the listing's reviews array
  
    await review.save(); // Save the review
    await listing.save(); // Save the updated listing
  
    req.flash("success", "Successfully added a new review");
    res.redirect(`/listings/${id}`);
  }


  module.exports.deleteReview = async (req, res, next) => {
    const { id, review_id } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: review_id } });
    await Review.findByIdAndDelete(review_id);
    req.flash("success", "Successfully deleted a review");
    res.redirect(`/listings/${id}`);
  }