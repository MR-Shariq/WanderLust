const mongoose = require("mongoose");
const Listing = require("../models/listing"); // Adjust path if needed
const axios = require("axios");

const MAPTILER_API_KEY = "125TGmHMaBByaaxaxGOQ"; // Replace with your actual MapTiler API key

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function updateListings() {
  try {
    const listings = await Listing.find({ geometry: { $exists: false } }); // Find listings without geometry
    console.log(`Found ${listings.length} listings to update.`);

    for (let listing of listings) {
      if (!listing.location) {
        console.warn(`Skipping listing ${listing._id} - No location found.`);
        continue;
      }

      const geoData = await axios.get(
        `https://api.maptiler.com/geocoding/${encodeURIComponent(
          listing.location
        )}.json?key=${"125TGmHMaBByaaxaxGOQ"}`
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
    }

    console.log("All listings updated successfully.");
  } catch (err) {
    console.error("Error updating listings:", err);
  } finally {
    mongoose.connection.close();
  }
}

updateListings();
