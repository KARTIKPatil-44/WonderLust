
// Load environment variables from project root
require("dotenv").config();
//  Check if MAP_TOKEN loaded properly
console.log("Loaded MAP_TOKEN:", process.env.MAP_TOKEN);

const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// ✅ Use the token safely
const mapToken = process.env.MAP_TOKEN;
if (!mapToken) {
  throw new Error("MAP_TOKEN is missing. Please set it in your .env file.");
}
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {   // ✅ Fixed: added error parameter
    console.log("DB connection error:", error);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    const updateData = await Promise.all(
      initData.data.map(async (obj) => {
        // Clean up the data format - remove MongoDB-specific fields
        const cleanObj = {
          title: obj.title,
          description: obj.description,
          image: obj.image,
          price: obj.price,
          location: obj.location,
          country: obj.country,
          category: obj.category,
           owner: "68a9a5f76d0846fd32aaf280", // Use a valid user ID
          reviews: [], // Start with empty reviews array
        };

        let response;
        try {
          response = await geocodingClient
            .forwardGeocode({
              query: `${obj.location}, ${obj.country}`,
              limit: 1,
            })
            .send();
        } catch (error) {
          console.error(
            `Geocoding failed for ${obj.location}, ${obj.country}:`,
            error
          );
          return { ...cleanObj, geometry: null };
        }

        const geometry = response.body.features[0]?.geometry || null;
        return {
          ...cleanObj,
          geometry,
        };
      })
    );

    await Listing.insertMany(updateData);
    console.log("data was initialized");
  } catch (error) {
    console.log("Error initializing DB", error);
  }
};

initDB();
