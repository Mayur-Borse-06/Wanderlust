const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const port = 3000;

main()
.then(() => {
    console.log("Connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


//index route
app.get("/listings", async(req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
})

//create route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

app.post("/listings", async(req, res, next) => {
    try {
        let newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
    } catch (err) {
        next(err);
    }
})

//show route
app.get("/listings/:id", async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing })
})

//edit route
app.get("/listings/:id/edit", async(req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing })
})

//update route
app.put("/listings/:id", async(req, res) => {
    let { id } = req.params;
    let updatedListing = req.body.listing;
    await Listing.findByIdAndUpdate(id, {...updatedListing});
    res.redirect(`/listings/${id}`);
})

//destroy route

app.delete("/listings/:id", async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

//Error handling middlewares
app.use((err, req, res, next) => {
    res.send("Some error occured");
})






app.listen(port, () => {
    console.log("Server is now listening on port 3000");
})