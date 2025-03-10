const Listing = require("../models/listing"); // Import the Listing model
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken:mapToken });

// Controller to display all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// Controller to render the form for creating a new listing
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Controller to display a specific listing by ID along with its reviews and owner details
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({ 
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    //console.log(listing);
    res.render("listings/show.ejs", { listing });
};

// Controller to create a new listing and associate it with the logged-in user
module.exports.createListing = async (req, res,next) => {
    let response = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
      })
        .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url,filename};
    newListing.geometry = response.body.features[0].geometry;
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New listing created successfully");
    res.redirect("/listings");
};

// Controller to render the edit form for a specific listing
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    
    if (!listing) {
        req.flash("error", "Listing not found");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing,originalImageUrl });
};

// Controller to update a listing with new data
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });

    if(typeof req.file !== "undefined") {
        let url=req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success", "Listing updated successfully");
    res.redirect(`/listings/${id}`);
};

// Controller to delete a listing from the database
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted successfully");
    res.redirect("/listings");
};
