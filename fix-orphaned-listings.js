const mongoose = require('mongoose');
const Listing = require('./models/listing');
const User = require('./models/user');

// Connect to MongoDB (you'll need to set your connection string)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/wanderlust');
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Function to find and fix orphaned listings
const fixOrphanedListings = async () => {
  try {
    console.log('Checking for listings without owners...');
    
    // Find all listings that don't have an owner or have a null owner
    const orphanedListings = await Listing.find({
      $or: [
        { owner: { $exists: false } },
        { owner: null }
      ]
    });
    
    console.log(`Found ${orphanedListings.length} listings without owners:`);
    
    if (orphanedListings.length === 0) {
      console.log('No orphaned listings found!');
      return;
    }
    
    // Display orphaned listings
    orphanedListings.forEach(listing => {
      console.log(`- ${listing.title} (ID: ${listing._id})`);
    });
    
    // Use the specific user ID you provided
    const specificUserId = "68a9a62c6d0846fd32aaf289";
    
    // Verify the user exists
    const user = await User.findById(specificUserId);
    
    if (!user) {
      console.log(`User with ID ${specificUserId} not found in database.`);
      return;
    }
    
    console.log(`\nAssigning owner: ${user.username} (${user._id})`);
    
    // Update all orphaned listings with the specific owner
    const updateResult = await Listing.updateMany(
      {
        $or: [
          { owner: { $exists: false } },
          { owner: null }
        ]
      },
      { owner: specificUserId }
    );
    
    console.log(`Updated ${updateResult.modifiedCount} listings with owner ${user.username}.`);
    
    // Verify the fix
    const remainingOrphaned = await Listing.find({
      $or: [
        { owner: { $exists: false } },
        { owner: null }
      ]
    });
    
    if (remainingOrphaned.length === 0) {
      console.log('✅ All listings now have owners!');
    } else {
      console.log(`⚠️  ${remainingOrphaned.length} listings still don't have owners.`);
    }
    
  } catch (error) {
    console.error('Error fixing orphaned listings:', error);
  }
};

// Main execution
const main = async () => {
  await connectDB();
  await fixOrphanedListings();
  await mongoose.connection.close();
  console.log('Database connection closed.');
};

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { fixOrphanedListings };
