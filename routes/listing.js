const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
.route("/")
.get(wrapAsync(listingController.index))// Index Route - Fetch all listings
.post(isLoggedIn,upload.single("listing[image]"),validateListing, wrapAsync(listingController.createListing));// Create Route - Add a new listing

// New Route - Render form for new listing
router.get("/new",isLoggedIn,listingController.renderNewForm);

router 
    .route("/:id")  
    .get(wrapAsync(listingController.showListing))// Show Route - Display a single listing
    .put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))// Update Route - Modify an existing listing
    .delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))// Delete Route - Remove a listing



// Edit Route - Render edit form
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));

module.exports = router;