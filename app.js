// Import required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // Mongoose model
const path = require("path");
const methodOverride = require('method-override');
const ejsMate  = require('ejs-mate');

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
app.engine('ejs', ejsMate); // Using ejs-mate for layout support

// Middleware
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(methodOverride("_method")); // For supporting PUT & DELETE methods via POST
app.use(express.static(path.join(__dirname, "public"))); // Serving static files

// Root route
app.get("/", (req, res) => {
  res.send("Hello I am root");
});

// ==================== ROUTES ==================== //

// INDEX ROUTE - List all listings
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// NEW ROUTE - Form to create new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// CREATE ROUTE - Save new listing to DB
app.post("/listings", async (req, res) => {
  const data = req.body.listing;
  // Set default image if not provided
  if (typeof data.image !== "string" || !data.image.trim()) {
    data.image = "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=2070&auto=format&fit=crop";
  }
  const newListing = new Listing(data);
  await newListing.save();
  res.redirect("/listings");
});

// SHOW ROUTE - Show a single listing by ID
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

// EDIT ROUTE - Form to edit an existing listing
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// UPDATE ROUTE - Update listing details
app.put("/listings/:id", async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
});

// DELETE ROUTE - Delete a listing
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

// ==================== OPTIONAL TEST ROUTE ==================== //
// Used for seeding/testing purpose
// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My new Villa",
//     description: "beach side",
//     price: 1200,
//     location: "Belagavi",
//     country: "India",
//   });
//   await sampleListing.save();
//   console.log("Sample was saved");
//   res.send("Successful testing");
// });

// Starting the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
