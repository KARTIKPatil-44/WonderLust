const mongoose = require("mongoose");
const Listing = require("./models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
require('dotenv').config();

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Connect to MongoDB
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
mongoose.connect(MONGO_URL);

async function updateAllListings() {
    try {
        console.log("🔄 Starting to update all listings with proper coordinates...");
        
        // Get all listings
        const listings = await Listing.find({});
        console.log(`📋 Found ${listings.length} listings to update`);
        
        let updatedCount = 0;
        let errorCount = 0;
        
        for (const listing of listings) {
            try {
                console.log(` Processing: ${listing.title} (${listing.location}, ${listing.country})`);
                
                // Skip if already has valid coordinates
                if (listing.geometry && 
                    listing.geometry.coordinates && 
                    listing.geometry.coordinates.length === 2 &&
                    listing.geometry.coordinates[0] !== 0 && 
                    listing.geometry.coordinates[1] !== 0) {
                    console.log(`   ✅ Already has valid coordinates: [${listing.geometry.coordinates[0]}, ${listing.geometry.coordinates[1]}]`);
                    continue;
                }
                
                // Get coordinates from Mapbox
                const response = await geocodingClient
                    .forwardGeocode({
                        query: `${listing.location}, ${listing.country}`,
                        limit: 1,
                    })
                    .send();
                
                if (response.body.features && response.body.features.length > 0) {
                    const geometry = response.body.features[0].geometry;
                    
                    // Update the listing
                    await Listing.findByIdAndUpdate(listing._id, {
                        geometry: geometry
                    });
                    
                    console.log(`   ✅ Updated with coordinates: [${geometry.coordinates[0]}, ${geometry.coordinates[1]}]`);
                    updatedCount++;
                } else {
                    console.log(`    No coordinates found for: ${listing.location}, ${listing.country}`);
                    errorCount++;
                }
                
                // Small delay to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 100));
                
            } catch (error) {
                console.log(`    Error updating ${listing.title}:`, error.message);
                errorCount++;
            }
        }
        
        console.log(" Update completed!");
        console.log(`Successfully updated: ${updatedCount} listings`);
        console.log(`Errors: ${errorCount} listings`);
        console.log(`Total processed: ${listings.length} listings`);
        
    } catch (error) {
        console.error(" Error in update process:", error);
    } finally {
        await mongoose.connection.close();
        console.log(" Database connection closed");
    }
}

// Run the update
updateAllListings();
