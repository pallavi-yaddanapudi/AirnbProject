const User = require("../models/user.js");

// Controller to render the signup form
module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

// Controller to handle user signup and registration
module.exports.signup = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust");
            res.redirect("/listings");
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

// Controller to render the login form
module.exports.renderLoginForm = (req, res) => {
    res.render("users/login.ejs");
};

// Controller to handle user login
module.exports.login = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust");
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

// Controller to handle user logout
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are Logged out");
        res.redirect("/listings");
    });
};
