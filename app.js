// ==========================
// Import Required Packages
// ==========================
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ==========================
// Import Route Files
// ==========================
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

// ==========================
// MongoDB Connection
// ==========================
const dbUrl =
  process.env.ATLASDB_URL || "mongodb://127.0.0.1:27017/wonderlust";

async function main() {
  try {
    await mongoose.connect(dbUrl);
    console.log("✅ Connected to DB:", dbUrl);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
  }
}
main();

// ==========================
// View Engine & Templates Setup
// ==========================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

// ==========================
// Middleware Setup
// ==========================
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(methodOverride("_method"));
app.use(
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".css") || filePath.endsWith(".js")) {
        res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        res.setHeader("Pragma", "no-cache");
        res.setHeader("Expires", "0");
      }
    },
  })
);

// ==========================
// Session & Flash Configuration
// ==========================
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET || "mysuperseceretcode",
  },
  touchAfter: 24 * 3600,
});
store.on("error", function (e) {
  console.log("❌ ERROR in MONGO SESSION STORE", e);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET || "mysuperseceretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
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
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ==========================
// Set Flash Messages in All Templates
// ==========================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

// ==========================
// Routes
// ==========================
app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ==========================
// 404 Handler
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
});

// ==========================
// Start the Server
// ==========================
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
