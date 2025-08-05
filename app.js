// ==========================
// Import Required Packages
// ==========================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js');

// ==========================
// Import Route Files
// ==========================
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ==========================
// MongoDB Connection
// ==========================
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}

// ==========================
// View Engine & Templates Setup
// ==========================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate); // Enables layouts & partials

// ==========================
// Middleware Setup
// ==========================
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(methodOverride("_method")); // To use PUT/DELETE via POST
app.use(express.static(path.join(__dirname, "public"))); // Serve static assets (CSS, JS, images)

// ==========================
// Session & Flash Configuration
// ==========================
const sessionOptions = {
  secret: "mysuperseceretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

// ==========================
// Passport Authentication Setup
// ==========================
app.use(passport.initialize());
app.use(passport.session()); // Needed for persistent login sessions
passport.use(new LocalStrategy(User.authenticate())); // Local strategy using User model's authenticate method
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========================
// Set Flash Messages in All Templates
// ==========================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user; // Makes logged-in user available in all views
  next();
});

// ==========================
// Routes
// ==========================

// Root route (can be replaced with home page in future)
app.get("/", (req, res) => {
  res.send("Hello I am root");
});

app.use("/listings", listingRouter); // Routes for listings
app.use("/listings/:id/reviews", reviewRouter); // Nested review routes
app.use("/", userRouter); // Routes for signup/login/logout

// ==========================
// 404 Handler - Catch All Unmatched Routes
// ==========================
app.all(/.*/, (req, res, next) => {
  next(new ExpressError(400, "Page not found!"));
});

// ==========================
// Centralized Error Handler
// ==========================
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // If you prefer text error for APIs: res.status(statusCode).send(message);
});

// ==========================
// Start the Server
// ==========================
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
