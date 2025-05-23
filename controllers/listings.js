const Listing = require("../models/listing.js");

module.exports.index = async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.createNewListing = async (req, res, next) => {
    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");

}

module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing })
}

module.exports.renderEditForm =  async (req, res) => {
        let { id } = req.params;
        const listing = await Listing.findById(id);
        if (!listing) {
            req.flash("error", "Listing you requested does not exist");
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", { listing })
    }

module.exports.updateListing = (async (req, res) => {
        if (!req.body.listing) {
            throw new ExpressError(400, "Please send valid data for listing")
        }
        let { id } = req.params;
        let updatedListing = req.body.listing;
        await Listing.findByIdAndUpdate(id, { ...updatedListing });
        req.flash("success", "Listing updated!");
        res.redirect(`/listings/${id}`);
    })

module.exports.destroyListing = (async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
})



