const mongoose = require("mongoose");
const Listing = require("./models/listing");
require("dotenv").config();

// Connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
mongoose.connect(MONGO_URL);

async function checkListings() {
  try {
    console.log("🔍 Checking listings in database...");

    // Get all listings
    const listings = await Listing.find({});
    console.log(`📋 Found ${listings.length} listings in database`);

    if (listings.length === 0) {
      console.log(
        " No listings found! You need to initialize your database first."
      );
      console.log("💡 Run: node init/index.js to populate with sample data");
      return;
    }

    console.log("\n Listing Details:");
    console.log("=".repeat(80));

    listings.forEach((listing, index) => {
      console.log(`${index + 1}. ${listing.title}`);
      console.log(`   Location: ${listing.location}, ${listing.country}`);
      console.log(`   Price: $${listing.price}`);
      console.log(`   Category: ${listing.category}`);

      if (listing.geometry && listing.geometry.coordinates) {
        const coords = listing.geometry.coordinates;
        if (coords.length === 2 && coords[0] !== 0 && coords[1] !== 0) {
          console.log(`   ✅ Coordinates: [${coords[0]}, ${coords[1]}]`);
        } else {
          console.log(` Invalid coordinates: [${coords[0]}, ${coords[1]}]`);
        }
      } else {
        console.log(`No coordinates found`);
      }
      console.log("");
    });
  } catch (error) {
    console.error("❌ Error checking listings:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Database connection closed");
  }
}

// Run the check
checkListings();
