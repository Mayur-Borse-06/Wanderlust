const mongoose = require("mongoose");
const Review = require("./reviews.js");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: String,
    image: {
        type: String,
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDXvzB8AP6D9djpASxBiu77exJ7_6aGWvcAg&s",
        set: (v) => {
            return v===""? "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDXvzB8AP6D9djpASxBiu77exJ7_6aGWvcAg&s": v
        },
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },  
})

listingSchema.post("findOneAndDelete", async(listing) => {
    if(listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}})
    }
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;