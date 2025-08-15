

// initListings.js
const mongoose = require("mongoose");
const Listing = require("../models/listing");

const MONGO_URL = "mongodb+srv://mayur-borse-06:mayur33813381@cluster0.odfu1.mongodb.net/wanderlust?retryWrites=true&w=majority";

const listings = [
  {
    _id: new mongoose.Types.ObjectId("67d872b09c64c62c4d28bde6"),
    title: "Charming Riad in Marrakech",
    description:
      "Stay in a traditional Moroccan riad in the heart of Marrakech's vibrant old city.",
    image: {
      url: "https://images.unsplash.com/photo-1628642004970-1da51c8c7dec?fm=jpg&q=80",
      fileName: "charming-riad.jpg",
    },
    price: 1800,
    location: "Marrakech",
    country: "Morocco",
    reviews: [],
    owner: new mongoose.Types.ObjectId("67fcf31ae0abd965850ee963"),
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId("67d93b17b0408335e3f57944"),
    title: "Luxurious Villa",
    description: "Dive in the beauty of Los Angeles with our premium villa",
    image: {
      url: "https://images.unsplash.com/photo-1565297032488-90722f09db62?fm=jpg&q=80",
      fileName: "luxurious-villa.jpg",
    },
    price: 3999,
    location: "Los Angeles",
    country: "California",
    reviews: [],
    owner: new mongoose.Types.ObjectId("67fcf31ae0abd965850ee963"),
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId("67ea3a7c774cffea2a58ccef"),
    title: "Penthouse",
    description:
      "Beautiful scenarios with highly trained staff at your services",
    image: {
      url: "https://images.unsplash.com/photo-1576941089067-2de3c901e126?fm=jpg&q=80",
      fileName: "penthouse.jpg",
    },
    price: 1800,
    location: "San Diego",
    country: "California",
    reviews: [],
    owner: new mongoose.Types.ObjectId("67fcf31ae0abd965850ee963"),
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId("67fd5726ea1dc0b548a37bfe"),
    title: "My villa",
    description: "Beautiful villa with staff at your service",
    image: {
      url: "https://images.unsplash.com/photo-1596178067639-5c6e68aea6dc?w=600&auto=format",
      fileName: "my-villa.jpg",
    },
    price: 2999,
    location: "San Jose",
    country: "California",
    reviews: [],
    owner: new mongoose.Types.ObjectId("67fd511f8b667a309ec8162f"),
    __v: 0,
  },
  {
    _id: new mongoose.Types.ObjectId("689d8eb06afd0e8f1eae1304"),
    title: "My villa",
    description: "bdfse",
    image: {
      url: "",
      fileName: "no-image.jpg",
    },
    price: 1800,
    location: "Surat, Gujarat",
    country: "India",
    reviews: [],
    owner: new mongoose.Types.ObjectId("67fcf31ae0abd965850ee963"),
    __v: 0,
  },
];

async function init() {
  await mongoose.connect(MONGO_URL);
  console.log("📦 Connected to DB");

  await Listing.deleteMany({});
  console.log("🗑 Old data removed");

  await Listing.insertMany(listings);
  console.log("✅ New data inserted");

  mongoose.connection.close();
}

init().catch((err) => {
  console.error(err);
  mongoose.connection.close();
});
