module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash("error", "User must be logged in to create listing");
    return res.redirect("/login");
  }
  next();
};
