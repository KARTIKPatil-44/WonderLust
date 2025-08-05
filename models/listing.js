// Import Mongoose and other required modules
const mongoose = require("mongoose");
const review = require("./review"); // Mongoose Review model
const { ReviewSchema } = require("../schema"); // (Optional) Joi schema for validation (not used directly here)
const Schema = mongoose.Schema;

// Define the Listing schema
const ListingSchema = new Schema({
  // Title of the listing (required)
  title: {
    type: String,
    required: true,
  },

  // Description of the listing (optional)
  description: String,

  // Image URL for the listing
  image: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    
    // If image is an empty string, set to default image URL
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v,
  },

  // Price of the listing
  price: Number,

  // Location name or address
  location: String,

  // Country name
  country: String,

  // Array of associated review IDs (references Review model)
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // reference to Review model
    },
  ],
});

// ================================
// Mongoose Middleware
// ================================
// This middleware runs after a listing is deleted using findOneAndDelete()
// It removes all reviews associated with the deleted listing
ListingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } }); // delete all reviews in the array
  }
});

// Create the Listing model from the schema
const Listing = mongoose.model("Listing", ListingSchema);

// Export the model so it can be used in other parts of the app
module.exports = Listing;
