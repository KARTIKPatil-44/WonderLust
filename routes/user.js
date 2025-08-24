// Importing required modules
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js"); // Error handling wrapper for async routes
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login", // Redirect on failure
      failureFlash: true, // Flash error message on failure
    }),
    userController.login
  );

router.get("/logout", userController.logout);

// Exporting router to be used in app.js
module.exports = router;
