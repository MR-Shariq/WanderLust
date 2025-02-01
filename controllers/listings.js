const Listing = require("../models/listing");
const maptilerClient=require("@maptiler/client")
maptilerClient.config.apiKey=process.env.MAP_TOKEN


// module.exports.index = async (req, res) => {
//     const allListings = await Listing.find({});
//     res.render("listings/index.ejs", { allListings });
//   };

module.exports.index = async (req, res) => {
  try {
      const query = req.query.q; // Get the search query from the request
      const category = req.query.category; // Get the category from the request
      let filter = {}; // Initialize the filter object

      // Add search query to the filter if present
      if (query) {
          filter.title = { $regex: new RegExp("^" + query, "i") }; // Case-insensitive search
      }

      // Add category to the filter if present
      if (category) {
          filter.category = category; // Exact match for the category
      }

      // Fetch listings based on the filter, or all if no filter is applied
      const allListings = await Listing.find(filter);

      // Render the index page with the filtered or all listings
      res.render("listings/index", { allListings, query, category });
  } catch (err) {
      console.error(err);
      req.flash("error", "Something went wrong while fetching listings.");
      res.redirect("/");
  }
};


  module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
  }

  module.exports.showListing = async (req, res) => {
      let id = req.params.id;
      const listing = await Listing.findById(id).populate({path: "reviews" , populate: {path : "author"},}).populate("owner");
      if (!listing) {
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
      }
      res.render("listings/show.ejs", { listing });
    };

    module.exports.createListing = async (req, res) => {
        // let {title, desciption , image , price , country , location} = req.body;
    

        // if (!req.body.listing.image.url) {
        //   req.body.listing.image.url = "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60";
        // }
       
        if (!req.file) {
          req.flash("error", "No image uploaded");
          return res.redirect("/listings/new");
        }
        // in an async function, or as a 'thenable':
       let result = await maptilerClient.geocoding.forward(req.body.listing.location);
     

        // Extract file details
        let url = req.file.path;
        let filename = req.file.filename;
         
        const newListing = new Listing(req.body.listing);
        newListing.image.url = url;
        newListing.image.filename = filename;
        newListing.owner = req.user._id;
        newListing.geometry =  result.features[0].geometry;
        let saved = await newListing.save();
        console.log(saved.geometry);
        req.flash("success", "Successfully made a new listing");
        res.redirect("/listings");
      
      };

      module.exports.renderEditForm = async(req,res)=>{
        let id = req.params.id;
        const listing = await Listing.findById(id);
        if (!listing) {
          req.flash("error", "Cannot find that listing!");
          return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", {listing});
      };

    module.exports.updateListing =   async (req, res) => {
        let id = req.params.id;
        if(!req.body.listing) 
          throw new ExpressError("Invalid Listing Data", 400);
       
        let listing =  await Listing.findByIdAndUpdate(id, req.body.listing, {new:true});

        if (typeof req.file!== "undefined") {

        let url = req.file.path;
        let filename = req.file.filename;
         
        listing.image.url = url;
       listing.image.filename = filename;
        await listing.save();
        }
        req.flash("success", "Successfully updated a listing");
      
        res.redirect(`/listings/${id}`);
      };

      module.exports.deleteListing = async(req,res)=>{
        let id = req.params.id;
        await Listing.findByIdAndDelete(id);
        req.flash("success", "Successfully deleted a listing");
        res.redirect("/listings");
      };


   module.exports.searchListings = async (req, res) => {
    res.send("hello from search");
  }
