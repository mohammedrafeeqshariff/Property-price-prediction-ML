const mongoose = require('mongoose');
const turfUpload = require('./models/turfModel');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const dummyTurfs = [
  {
    turfThumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
    turfImages: [
      "https://images.unsplash.com/photo-1574629810360-7efbbe195018",
      "https://images.unsplash.com/photo-1529900748604-07564a03e7a6"
    ],
    turfName: "Green Valley Arena",
    turfDescription: "Premium grass turf for soccer and cricket matches. Excellent lighting for night games.",
    ownerContact: 9876543210,
    address: "123 Sports Road, Silicon Valley",
    turfDistrict: "Bangalore",
    turfTimings: 12,
    turfSportCategory: "Soccer",
    turfPrice: 1500,
    userID: "dummy_owner_1"
  },
  {
    turfThumbnail: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    turfImages: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc",
      "https://images.unsplash.com/photo-1504450758481-7338ef752496"
    ],
    turfName: "Asphalt Kings Court",
    turfDescription: "Professional basketball and tennis court with shock-absorbent flooring.",
    ownerContact: 9887766554,
    address: "45 Court Lane, Downtown",
    turfDistrict: "Chennai",
    turfTimings: 10,
    turfSportCategory: "Basketball",
    turfPrice: 1200,
    userID: "dummy_owner_2"
  },
  {
    turfThumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
    turfImages: [
      "https://images.unsplash.com/photo-1531415074968-036ba1b575da",
      "https://images.unsplash.com/photo-1624526267442-af54e2caae4b"
    ],
    turfName: "Cricket Central",
    turfDescription: "Indoor cricket nets with automatic bowling machines and high-grade nets.",
    ownerContact: 9112233445,
    address: "78 Cricket Enclave, West End",
    turfDistrict: "Mumbai",
    turfTimings: 14,
    turfSportCategory: "Cricket",
    turfPrice: 800,
    userID: "dummy_owner_3"
  }
];

const seedDB = async () => {
  try {
    console.log("Connecting to:", process.env.DATABASE_URI);
    await mongoose.connect(process.env.DATABASE_URI);
    console.log("Connected to MongoDB for seeding...");
    
    await turfUpload.deleteMany({}); // Clear existing
    await turfUpload.insertMany(dummyTurfs);
    
    console.log("Dummy turfs seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
