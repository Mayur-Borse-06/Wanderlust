const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing");


//listing validation
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => { return el.message }).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}

//index route
router.get("/", wrapAsync(async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}))

//create route
router.get("/new", (req, res) => {
    res.render("listings/new.ejs");
})

router.post("/", validateListing, wrapAsync(async(req, res, next) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");

}))

//show route
router.get("/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
}))

//update route
router.get("/:id/edit", wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing })
}))

router.put("/:id", wrapAsync(async(req, res) => {
    if(!req.body.listing) {
        throw new ExpressError(400, "Please send valid data for listing")
    }
    let { id } = req.params;
    let updatedListing = req.body.listing;
    await Listing.findByIdAndUpdate(id, {...updatedListing});
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}))

//destroy route

router.delete("/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}))

module.exports = router;



