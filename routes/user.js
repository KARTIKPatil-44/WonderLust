// Importing required modules
const express = require("express");
const router = express.Router();
const User = require("../models/user.js"); // Mongoose User model
const wrapAsync = require("../utils/wrapAsync.js"); // Error handling wrapper for async routes
const passport = require("passport");

// =====================
// Signup Route - GET
// =====================
// Render the signup form
router.get("/signup", (req, res) => {
  res.render("users/signup.ejs");
});

// =====================
// Signup Route - POST
// =====================
// Register a new user and log them in
router.post(
  "/signup",
  wrapAsync(async (req, res) => {
    try {
      // Extract user details from the request body
      let { username, email, password } = req.body;

      // Create a new User instance (without password yet)
      const newUser = new User({ email, username });

      // Register the user with passport-local-mongoose (handles password hashing & storage)
      const registeredUser = await User.register(newUser, password);
      console.log(registeredUser);

      // Flash success message and redirect
      req.flash("success", "Welcome to WonderLust!");
      res.redirect("/listings");
    } catch (e) {
      // Flash error message and redirect to signup page
      req.flash("error", e.message);
      res.redirect("/signup");
    }
  })
);

// =====================
// Login Route - GET
// =====================
// Render the login form
router.get("/login", (req, res) => {
  res.render("users/login.ejs");
});

// =====================
// Login Route - POST
// =====================
// Authenticate user using passport-local strategy
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",   // Redirect on failure
    failureFlash: true,          // Flash error message on failure
  }),
  async (req, res) => {
    // Flash success message and redirect on success
    req.flash("success", "Welcome back to WonderLust!");
    res.redirect("/listings");
  }
);

// Exporting router to be used in app.js
module.exports = router;
