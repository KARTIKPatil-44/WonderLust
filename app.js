const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");

// MongoDB URL
const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";
S
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

// Root route
app.get("/", (req, res) => {
  res.send("Hello I am root");
});

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
