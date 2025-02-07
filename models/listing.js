const mongoose = require("mongoose");
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
    country: String
})

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;