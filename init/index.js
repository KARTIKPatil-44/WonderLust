// Load environment variables
require("dotenv").config();

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// ✅ Load Mapbox token
const mapToken = process.env.MAP_TOKEN;
if (!mapToken) {
  throw new Error("MAP_TOKEN is missing. Please set it in your .env file.");
}
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// ✅ Load MongoDB URL
const MONGO_URL = process.env.ATLASDB_URL;
if (!MONGO_URL) {
  throw new Error("ATLASDB_URL is missing. Please set it in your .env file.");
}

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("DB connection error:", error);
    process.exit(1); // Exit if DB connection fails
  }
}

// Initialize DB
const initDB = async () => {
  try {
    // Clear existing listings
    await Listing.deleteMany({});

    // Prepare data with geocoding
    const updatedData = await Promise.all(
      initData.data.map(async (obj) => {
        const cleanObj = {
          title: obj.title,
          description: obj.description,
          image: obj.image,
          price: obj.price,
          location: obj.location,
          country: obj.country,
          category: obj.category,
          owner: "68a9a5f76d0846fd32aaf280", // Replace with a valid user ID
          reviews: [],
        };

        let geometry = null;
        try {
          const response = await geocodingClient
            .forwardGeocode({
              query: `${obj.location}, ${obj.country}`,
              limit: 1,
            })
            .send();

          geometry = response.body.features[0]?.geometry || null;
        } catch (error) {
          console.error(
            `Geocoding failed for ${obj.location}, ${obj.country}:`,
            error
          );
        }

        return { ...cleanObj, geometry };
      })
    );

    await Listing.insertMany(updatedData);
    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing DB:", error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the script
main().then(() => initDB());
