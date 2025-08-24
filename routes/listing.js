const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Use Cloudinary storage only if creds are present; otherwise save locally to /public/uploads
const useCloudinary = !!(
  process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET
);
let upload;
if (useCloudinary) {
  const { storage } = require("../cloudConfig.js");
  upload = multer({ storage });
} else {
  const uploadsDir = path.join(__dirname, "../public/uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const diskStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname || "");
      cb(null, `${uniqueSuffix}${ext}`);
    },
  });
  upload = multer({ storage: diskStorage });
}

// ------------------ ROUTES ------------------

// Route for "/" → Show all listings and Create a new listing
router
  .route("/")
  // GET → Fetch all listings (Index page)
  .get(wrapAsync(listingController.index))
  // POST → Create a new listing (with validations & image upload)
  .post(
    isLoggedIn,
    // Safely handle image upload; if Cloudinary is not configured, continue without a file
    (req, res, next) => {
      const runUpload = upload.single("listing[image]");
      runUpload(req, res, (err) => {
        if (err) {
          console.error("Image upload failed:", err.message || err);
          req.file = null; // proceed without the uploaded file
        }
        next();
      });
    },
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
    upload.single("listing[image]"), // handle updated image
    validateListing, // validate updated data
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
