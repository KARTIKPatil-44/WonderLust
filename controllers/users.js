const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    // Extract user details from the request body
    let { username, email, password } = req.body;

    // Create a new User instance (without password yet)
    const newUser = new User({ email, username });

    // Register the user with passport-local-mongoose (handles password hashing & storage)
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      // Flash success message and redirect
      req.flash("success", "Welcome to WonderLust!");
      res.redirect("/listings");
    });
  } catch (e) {
    // Flash error message and redirect to signup page
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.login = async (req, res) => {
  // Flash success message and redirect on success
  req.flash("success", "Welcome back to WonderLust!");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "you are logged out");
    res.redirect("/listings");
  });
};
