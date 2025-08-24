// Import Mongoose
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Review schema
const reviewSchema = new Schema({
    // The comment content of the review
    comment: String,

    // The rating given by the user, must be between 1 and 5
    rating: {
        type: Number,
        min: 1, // Minimum allowed value
        max: 5, // Maximum allowed value
    },

    // Timestamp for when the review was created
    createdAt: {
        type: Date,
        default: Date.now(), // Automatically sets the date to the current time
    },
    author:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});

// Export the Review model so it can be used in other files
module.exports = mongoose.model("Review", reviewSchema);
