const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const mongoose = require("mongoose");
const port = 3000;
const ExpressError = require("./utils/ExpressError.js");

const listingsRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/reviews.js");

require('dotenv').config({ path: './.env' });          

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch(err => console.error("MongoDB Connection Error:", err));


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));


//Routes
app.use("/listings", listingsRoutes);
app.use("/listings/:id/reviews", reviewRoutes)


//Error handling middlewares

app.all("*", (req, res, next, err) => {
    next(new ExpressError(404, "Page Not Found!"));
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Some error occured please try again later." } = err;
    res.status(statusCode).render("error.ejs", { err })
})




app.listen(port, () => {
    console.log("Server working");
})