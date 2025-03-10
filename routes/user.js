const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

router
    .route("/signup") 
    .get(userController.renderSignupForm)// Route to render the signup form
    .post(wrapAsync(userController.signup))// Route to handle user signup

router
    .route("/login")
    .get(userController.renderLoginForm)// Route to render the login form
    .post(
        saveRedirectUrl, // Middleware to save redirect URL before authentication
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        userController.login
    )// Route to handle user login with authentication

    

// Route to handle user logout
router.get("/logout", userController.logout);

module.exports = router;
