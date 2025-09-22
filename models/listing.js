// Import Mongoose and other required modules
const mongoose = require("mongoose");
const Review = require("./review"); // Mongoose Review model
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
    url: String,
    filename: String,
  },

  // Price of the listing
  price:{
    type: Number

  },

  // Location name or address
  location:{type:  String,
  },
  // Country name
  country:{ type:  String,
  },

  // Array of associated review IDs (references Review model)
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review", // reference to Review model
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  category:{
    type: String
  },
});

// ================================
// Mongoose Middleware
// ================================
// This middleware runs after a listing is deleted using findOneAndDelete()
// It removes all reviews associated with the deleted listing
ListingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } }); // delete all reviews in the array
  }
});

// Create the Listing model from the schema
const Listing = mongoose.model("Listing", ListingSchema);

// Export the model so it can be used in other parts of the app
module.exports = Listing;
