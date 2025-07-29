// Import required modules
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js"); // Mongoose model
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { ListingSchema } = require("./schema.js");


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

// Root route
app.get("/", (req, res) => {
  res.send("Hello I am root");
});

const validateListing = (req, res,next)=>{
  let {error} =  ListingSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el)=> el.message).join(",");
    throw new ExpressError(400,errMsg);
   }else{
    next();
   }

}

// ==================== ROUTES ==================== //

// INDEX ROUTE - List all listings
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  })
);

// NEW ROUTE - Form to create new listing
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// SHOW ROUTE - Show a single listing by ID
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  })
);

// CREATE ROUTE - Save new listing to DB
app.post(
  "/listings",validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  })
);

// EDIT ROUTE - Form to edit an existing listing
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  })
);

// UPDATE ROUTE - Update listing details
app.put(
  "/listings/:id",validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

// DELETE ROUTE - Delete a listing
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  })
);

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

// app.all("*", (req, res, next) => {
//   next(new ExpressError(400, "Page not found!"));
// });

app.use((err, req, res, next) => {
  let { statusCode = 500, message= "Somthing went wrong!" } = err;
  res.status(statusCode).render("error.ejs",{message});
  // res.status(statusCode).send(message);
});

// Starting the server
app.listen(8080, () => {
  console.log("Server is running on port 8080");
});
