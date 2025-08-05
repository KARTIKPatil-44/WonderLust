const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const flash = require('connect-flash');

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
// const { request } = require("http");

// MongoDB URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

// Connecting to MongoDB
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

// Setting view engine and views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate); // Using ejs-mate for layout support

// Middleware
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(methodOverride("_method")); // For supporting PUT & DELETE methods via POST
app.use(express.static(path.join(__dirname, "public"))); // Serving static files

const sessionOptions = {
  secret: "mysuperseceretcode", // Used to sign the session ID cookie
  resave: false, // Prevents session from being saved back to the session store if it wasn’t modified
  saveUninitialized: true, // Forces a session that is "uninitialized" to be saved
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Sets cookie expiration date (must be a Date object)
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie is valid for 7 days
    httpOnly: true, // Prevents client-side JS from accessing the cookie
  },
};


// Root route
app.get("/", (req, res) => {
  res.send("Hello I am root");
});

app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");

  next();
})

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all(/.*/, (req, res, next) => {
  next(new ExpressError(400, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Somthing went wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

// Starting the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
