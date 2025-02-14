const mongoose = require("mongoose");
const Listing = require("../models/listing"); // Adjust path if needed
const axios = require("axios");
require("dotenv").config(); // Load environment variables

const MAPTILER_API_KEY = process.env.MAPTILER_API_KEY; // Use environment variable

mongoose.connect("mongodb+srv://shariq:0OhJmBcBPpoTEITi@cluster0.ugkdr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateListings() {
  try {
    const listings = await Listing.find({
      $or: [
        { geometry: { $exists: false } }, // No geometry field at all
        { geometry: { $eq: {} } },        // Geometry field is empty
      ],
    });
    const count = await Listing.countDocuments({ geometry: { $exists: false } });
    console.log(`Listings without geometry: ${count}`);
    
    console.log(`Found ${listings.length} listings to update.`);

    for (let listing of listings) {
      if (!listing.location) {
        console.warn(`Skipping listing ${listing._id} - No location found.`);
        continue;
      }

      try {
        const geoData = await axios.get(
          `https://api.maptiler.com/geocoding/${encodeURIComponent(listing.location)}.json?key=${MAPTILER_API_KEY}`
        );

        if (!geoData.data.features.length) {
          console.warn(`No coordinates found for ${listing.location}`);
          continue;
        }

        const coordinates = geoData.data.features[0].geometry.coordinates; // [longitude, latitude]

        listing.geometry = {
          type: "Point",
          coordinates: coordinates,
        };

        await listing.save();
        console.log(`Updated ${listing.title} with coordinates: ${coordinates}`);
      } catch (geoError) {
        console.error(`Error fetching coordinates for ${listing.location}:`, geoError.message);
      }
    }

    console.log("All listings updated successfully.");
  } catch (err) {
    console.error("Error updating listings:", err);
  } finally {
    mongoose.connection.close();
  }
}

updateListings();
