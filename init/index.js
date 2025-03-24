const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const initData = require("./data.js");

main()
.then(() => {
    console.log("Connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect("mongodb+srv://mayur-borse-06:mayur33813381@cluster0.odfu1.mongodb.net/wanderlust?retryWrites=true&w=majority");
}

const initDB = async() => {
    await Listing.deleteMany();
    await Listing.insertMany(initData.data);
    console.log("All data have been saved");
}

initDB();