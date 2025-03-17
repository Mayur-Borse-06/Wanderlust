const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const port = 3000;
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");
require('dotenv').config({ path: './.env' });
console.log("MONGO_URI:", process.env.MONGO_URI); // Debugging ke liye

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB Connection Error:", err));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

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
app.get("/listings", wrapAsync(async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}))

//create route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

app.post("/listings", validateListing, wrapAsync(async(req, res, next) => {
    let newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");

}))

//show route
app.get("/listings/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing })
}))

//update route
app.get("/listings/:id/edit", wrapAsync(async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
}))

app.put("/listings/:id", wrapAsync(async(req, res) => {
    if(!req.body.listing) {
        throw new ExpressError(400, "Please send valid data for listing")
    }
    let { id } = req.params;
    let updatedListing = req.body.listing;
    await Listing.findByIdAndUpdate(id, {...updatedListing});
    res.redirect(`/listings/${id}`);
}))

//destroy route

app.delete("/listings/:id", wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))

//Error handling middlewares

app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some error occured please try again later." } = err;
    res.status(statusCode).render("error.ejs", { err })
})






app.listen(port, () => {
    console.log("Server is now listening on port 3000");
})