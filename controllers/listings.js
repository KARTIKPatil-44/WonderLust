const Listing = require("../models/listing");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;
// Only create the client if a token is available to avoid runtime error
const geocodingClient = mapToken ? mbxGeocoding({ accessToken: mapToken }) : null;
const path = require('path');
const fs = require('fs');

// ------------------ CONTROLLERS ------------------

// Show all listings
module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

// Render form for creating a new listing
module.exports.renderNewForm = (req, res) => {
  res.render("listings/new.ejs");
};

// Show details of a single listing by ID
module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({ path: "reviews", populate: { path: "author" } }) // also load reviews + their authors
    .populate("owner"); // also load owner details
  if (!listing) {
    req.flash("error", "Listing you requested for does not not exist");
    return res.redirect("/listings");
  }
  res.render("listings/show.ejs", { listing, mapToken: process.env.MAP_TOKEN });
};

// Create a new listing
module.exports.createListing = async (req, res, next) => {
  // 1) Try to geocode location with Mapbox (if configured)
  let geometry = null;
  try {
    if (process.env.MAP_TOKEN) {
      const response = await geocodingClient
        .forwardGeocode({ query: req.body.listing.location, limit: 1 })
        .send();
      if (
        response &&
        response.body &&
        Array.isArray(response.body.features) &&
        response.body.features.length > 0
      ) {
        geometry = response.body.features[0].geometry;
      }
    }
  } catch (e) {
    console.error("Geocoding failed:", e.message);
  }

  // 2) Build listing from request body
  const newListing = new Listing(req.body.listing);

  // 3) Attach image from upload
  try {
    if (req.file && (req.file.path || req.file.filename)) {
      console.log('Processing uploaded file:', req.file);
      // Cloudinary: req.file.path is a full URL; Local: serve from /uploads filename
      const isCloudinary = !!(process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET);
      const imageUrl = isCloudinary
        ? req.file.path
        : `/uploads/${req.file.filename}`;

      newListing.image = {
        url: imageUrl,
        filename: req.file.filename || "",
      };
      console.log('Image attached successfully:', newListing.image);
    } else {
      console.log('No file uploaded, using placeholder image');
      // No upload provided → placeholder
      newListing.image = {
        url:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1200&auto=format&fit=crop",
        filename: "placeholder",
      };
    }
  } catch (error) {
    console.error('Error processing image upload:', error);
    throw error;
  }

  // 4) Set owner
  newListing.owner = req.user._id;

  // 5) Ensure geometry is present to satisfy schema
  newListing.geometry =
    geometry ?? { type: "Point", coordinates: [0, 0] };

  // 6) Save and redirect
  await newListing.save();
  req.flash("success", "New Listing is created!");
  res.redirect(`/listings/${newListing._id}`);
};

// Render form for editing an existing listing
module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing you requested for does not not exist");
    return res.redirect("/listings");
  }
  // Show a smaller preview of the existing image (Cloudinary only)
  let orignalImageUrl = listing.image.url;
  if (orignalImageUrl && orignalImageUrl.includes("res.cloudinary.com")) {
    orignalImageUrl = orignalImageUrl.replace("/upload", "/upload/w_250");
  }

  res.render("listings/edit.ejs", { listing, orignalImageUrl });
};

// Update an existing listing
module.exports.updateListing = async (req, res) => {
  let { id } = req.params;

  // 1) Try to geocode new location if it changed
  let geometry = null;
  if (req.body.listing.location) {
    try {
      if (process.env.MAP_TOKEN) {
        const response = await geocodingClient
          .forwardGeocode({
            query: req.body.listing.location,
            limit: 1
          })
          .send();
        if (
          response &&
          response.body &&
          Array.isArray(response.body.features) &&
          response.body.features.length > 0
        ) {
          geometry = response.body.features[0].geometry;
        }
      }
    } catch (e) {
      console.error("Geocoding failed:", e.message);
    }
  }

  // 2) Update listing with new data
  let listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  // Update basic fields
  Object.assign(listing, req.body.listing);

  // Update geometry if we got new coordinates
  if (geometry) {
    listing.geometry = geometry;
  } else if (req.body.listing.location !== listing.location) {
    // If location changed but geocoding failed, use default coordinates
    listing.geometry = { type: "Point", coordinates: [0, 0] };
  }

  // 3) If new image uploaded, update image too
  try {
    if (req.file) {
      console.log('Processing updated file:', req.file);
      const isCloudinary = !!(process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET);
      
      // Delete old image file if it exists (for local storage)
      if (!isCloudinary && listing.image && listing.image.filename) {
        const oldImagePath = path.join(__dirname, '../public/uploads', listing.image.filename);
        if (fs.existsSync(oldImagePath)) {
          try {
            fs.unlinkSync(oldImagePath);
          } catch (err) {
            console.error('Error deleting old image:', err);
            // Continue even if delete fails
          }
        }
      }
      
      // Update with new image
      const imageUrl = isCloudinary ? req.file.path : `/uploads/${req.file.filename}`;
      listing.image = {
        url: imageUrl,
        filename: req.file.filename || ""
      };
      console.log('Updated image attached successfully:', listing.image);
      listing.markModified('image');
    }
  } catch (error) {
    console.error('Error processing image update:', error);
    req.flash('error', 'Failed to process image upload: ' + error.message);
    return res.redirect(`/listings/${id}/edit`);
  }

  // 4) Save all changes
  await listing.save();

  req.flash("success", "Listing updated!");
  res.redirect(`/listings/${listing._id}`);
};

module.exports.filter = async (req,res, next)=>{
  let {id} = req.params;
  
  // Handle category names with spaces and special characters
  let categoryName = id.replace(/-/g, ' ');
  
  let allListings = await Listing.find({
    $or: [
      {category: {$in:[id]}},
      {category: {$in:[categoryName]}},
      {category: {$regex: id, $options: "i"}}
    ]
  });
  
  if(allListings.length !== 0){
    res.locals.success = `Listings Filtered by ${id}!`;
    res.render("listings/index.ejs", {allListings});
  }else {
    req.flash("error", `There are no listings for ${id}!`);
    res.redirect("/listings");
  }
};


module.exports.search = async (req,res)=>{
  let input = req.query.q.trim();
  if(input === ""){
    req.flash("error", "Please enter search query!");
    return res.redirect("/listings");
  }
  
  // Search in title first
  let allListings = await Listing.find({
    title: {$regex: input, $options: "i"},
  });

  if(allListings.length !== 0){
    res.locals.success = "Listings searched by Title!";
    res.render("listings/index.ejs",{allListings});
    return;
  }

  // Search in category
  allListings = await Listing.find({
    category: { $regex: input, $options: "i"},
  }).sort({_id:-1});
  
  if(allListings.length !== 0){
    res.locals.success = "Listings searched by Category!";
    res.render("listings/index.ejs",{allListings});
    return;
  }

  // Search in country
  allListings = await Listing.find({
    country: { $regex: input, $options: "i"},
  }).sort({_id: -1});
  
  if(allListings.length !== 0){
    res.locals.success = "Listings searched by Country!";
    res.render("listings/index.ejs",{allListings});
    return;
  }

  // Search in location
  allListings = await Listing.find({
    location: { $regex: input, $options: "i"},
  }).sort({_id: -1});
  
  if(allListings.length !== 0){
    res.locals.success = "Listings searched by Location!";
    res.render("listings/index.ejs", {allListings});
    return;
  }

  // Search by price if input is a number
  const intValue = parseInt(input, 10);
  if(!isNaN(intValue) && intValue > 0){
    allListings = await Listing.find({price: {$lte: intValue}}).sort({
      price: 1,
    });
    if(allListings.length !== 0){
      res.locals.success = `Listings searched by price less than Rs ${intValue}!`;
      res.render("listings/index.ejs", {allListings});
      return;
    }
  }

  // No results found
  req.flash("error", "No listings found based on your search!");
  res.redirect("/listings");
};

// Delete a listing
module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  const deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);

  req.flash("success", "Listing is Deleted");
  res.redirect("/listings");
};

module.exports.reserveListing = async (req,res)=>{
  let {id } = req.params;
  req.flash("success", "Reservatrion Details is sent to you Email");
  res.redirect(`/listings/${id}`);
};
