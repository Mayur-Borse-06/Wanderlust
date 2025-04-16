const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Review = require("../models/reviews.js");
const Listing = require("../models/listing");
const { isLoggedIn, isReviewOwner } = require('../middleware.js');
const reviewController = require("../controllers/reviews.js");

//review validation
const validateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el) => { return el.message }).join(",");
        throw new ExpressError(400, errMsg)
    } else {
        next();
    }
}

//Create route

router.post("/", isLoggedIn, validateReview, wrapAsync(reviewController.createReview));

//Destroy route

router.delete("/:reviewId", isLoggedIn, isReviewOwner, wrapAsync(reviewController.deleteReview));

module.exports = router;