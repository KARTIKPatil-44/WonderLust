// Importing required modules
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// Define the User schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true, // Email is required for each user
    },
});

// Plugin passport-local-mongoose to handle username, hash, salt, and authentication methods
// This plugin adds a username field by default and also provides helpful methods like register(), authenticate(), etc.
userSchema.plugin(passportLocalMongoose);

// Export the User model
module.exports = mongoose.model("User", userSchema);
