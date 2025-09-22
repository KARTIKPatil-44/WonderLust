const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} = require ("../cloudConfig.js");
const upload = multer({storage})


// ------------------ ROUTES ------------------

// Route for "/" → Show all listings and Create a new listing
router
  .route("/")
  // GET → Fetch all listings (Index page)
  .get(wrapAsync(listingController.index))
  // POST → Create a new listing (with validations & image upload)
  .post(
    isLoggedIn,
      upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// NEW ROUTE → Form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewForm);

router.get("/filter/:id", wrapAsync(listingController.filter));
router.get("/search", wrapAsync(listingController.search));

// Route for "/:id" → Show, Update, Delete listing by ID
router
  .route("/:id")
  // GET → Show details of a single listing
  .get(wrapAsync(listingController.showListing))
  // PUT → Update an existing listing
  .put(
    isLoggedIn, // must be logged in
    isOwner, // must be the owner of the listing
     upload.single("listing[image]"),
     validateListing,
     wrapAsync(listingController.updateListing)
  )
  // DELETE → Remove a listing permanently
  .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

// EDIT ROUTE → Form to edit an existing listing
router.get(
  "/:id/edit",
  isLoggedIn, // must be logged in
  isOwner, // must be owner
  wrapAsync(listingController.renderEditForm)
);

router.get(
  "/:id/reservelisting",
  isLoggedIn,
  wrapAsync(listingController.reserveListing)
);

// Export router so it can be used in app.js
module.exports = router;
