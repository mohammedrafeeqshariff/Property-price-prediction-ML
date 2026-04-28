const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Turf = require('../models/turfModel');
const connectDB = require('../config/dbConfig');

dotenv.config({ path: path.join(__dirname, '../.env') });

const turfs = [
  {
    turfName: "Santiago Bernabéu Lite",
    turfSportCategory: "Football",
    turfDescription: "A premium 5-a-side arena with professional-grade artificial turf and high-intensity floodlighting. Perfect for nocturnal matches.",
    turfPrice: 1200,
    turfDistrict: "Chennai",
    address: "123 Anna Salai, Chennai, TN",
    ownerContact: 9876543210,
    turfThumbnail: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1000",
    turfImages: ["https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=1000"],
    turfTimings: [{ day: 'Monday', start: '06:00', end: '23:00' }]
  },
  {
    turfName: "Lord's Backyard",
    turfSportCategory: "Cricket",
    turfDescription: "Indoor cricket arena with high-quality bowling machines and shock-absorbent flooring. Ideal for rainy day practice.",
    turfPrice: 800,
    turfDistrict: "Madurai",
    address: "45 Gandhi Road, Madurai, TN",
    ownerContact: 9123456789,
    turfThumbnail: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&q=80&w=1000",
    turfImages: [],
    turfTimings: [{ day: 'Monday', start: '08:00', end: '22:00' }]
  },
  {
    turfName: "The Garden (Coimbatore)",
    turfSportCategory: "Basketball",
    turfDescription: "Full-sized hardwood court with adjustable hoops and stadium-style seating. Professional vibes for elite ballers.",
    turfPrice: 1500,
    turfDistrict: "Coimbatore",
    address: "88 Race Course Road, Coimbatore, TN",
    ownerContact: 9988776655,
    turfThumbnail: "https://images.unsplash.com/photo-1504450758481-7338eba7524a?auto=format&fit=crop&q=80&w=1000",
    turfImages: [],
    turfTimings: [{ day: 'Monday', start: '05:00', end: '21:00' }]
  },
  {
    turfName: "Wimbledon Mini",
    turfSportCategory: "Tennis",
    turfDescription: "Clay courts with night play capability. Features a lounge for spectators and elite amenities.",
    turfPrice: 2000,
    turfDistrict: "Chennai",
    address: "55 ECR, Chennai, TN",
    ownerContact: 9000012345,
    turfThumbnail: "https://images.unsplash.com/photo-1595435066311-665a39626300?auto=format&fit=crop&q=80&w=1000",
    turfImages: [],
    turfTimings: [{ day: 'Monday', start: '06:00', end: '22:00' }]
  },
  {
    turfName: "Precision Shuttle",
    turfSportCategory: "Badminton",
    turfDescription: "6 wooden floor courts with high clearance and anti-glare lighting. Used by state-level players.",
    turfPrice: 400,
    turfDistrict: "Madurai",
    address: "12 Bypass Road, Madurai, TN",
    ownerContact: 9444455555,
    turfThumbnail: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1000",
    turfImages: [],
    turfTimings: [{ day: 'Monday', start: '06:00', end: '22:00' }]
  },
  {
    turfName: "Old Trafford Vibe",
    turfSportCategory: "Football",
    turfDescription: "Expansive 7-a-side turf with FIFA-certified grass. Features a digital scoreboard and team dugouts.",
    turfPrice: 1800,
    turfDistrict: "Coimbatore",
    address: "101 Avinashi Road, Coimbatore, TN",
    ownerContact: 8888877777,
    turfThumbnail: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&q=80&w=1000",
    turfImages: [],
    turfTimings: [{ day: 'Monday', start: '06:00', end: '23:00' }]
  },
  {
    turfName: "Power Alley Cricket",
    turfSportCategory: "Cricket",
    turfDescription: "Natural grass pitch with concrete nets. The best spot for aggressive stroke play.",
    turfPrice: 900,
    turfDistrict: "Chennai",
    address: "22 OMR, Chennai, TN",
    ownerContact: 7777766666,
    turfThumbnail: "https://images.unsplash.com/photo-1540747913346-19e3ad643121?auto=format&fit=crop&q=80&w=1000",
    turfImages: [],
    turfTimings: [{ day: 'Monday', start: '07:00', end: '20:00' }]
  },
  {
     turfName: "Sky Hoop Rooftop",
     turfSportCategory: "Basketball",
     turfDescription: "Rooftop 3x3 court with city view and neon lighting. Perfect for urban streetball.",
     turfPrice: 1100,
     turfDistrict: "Chennai",
     address: "Roof Top, Nexus Mall, Chennai, TN",
     ownerContact: 9666655555,
     turfThumbnail: "https://images.unsplash.com/photo-1544919934-08eb426e680a?auto=format&fit=crop&q=80&w=1000",
     turfImages: [],
     turfTimings: [{ day: 'Monday', start: '16:00', end: '24:00' }]
  },
  {
    turfName: "Clay King Arena",
    turfSportCategory: "Tennis",
    turfDescription: "European style red clay courts. Slow-paced surface for tactical masters.",
    turfPrice: 2200,
    turfDistrict: "Madurai",
    address: "Thallakulam Main Rd, Madurai, TN",
    ownerContact: 8111122222,
    turfThumbnail: "https://images.unsplash.com/photo-1595435066311-665a39626300?auto=format&fit=crop&q=80&w=1000",
    turfImages: [],
    turfTimings: [{ day: 'Monday', start: '05:00', end: '21:00' }]
  },
  {
    turfName: "Grip & Smash",
    turfSportCategory: "Badminton",
    turfDescription: "Synthetic matting courts with high friction and excellent cushioning. Non-marking shoes mandatory.",
    turfPrice: 500,
    turfDistrict: "Coimbatore",
    address: "66 Saravanampatti, Coimbatore, TN",
    ownerContact: 7333344444,
    turfThumbnail: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1000",
    turfImages: [],
    turfTimings: [{ day: 'Monday', start: '06:00', end: '23:00' }]
  },
  {
    turfName: "The Stadium (Football)",
    turfSportCategory: "Football",
    turfDescription: "Full 11-a-side ground with natural grass and pro seating. Hosting tournament qualifiers.",
    turfPrice: 5000,
    turfDistrict: "Madurai",
    address: "Airport Road, Madurai, TN",
    ownerContact: 9222233333,
    turfThumbnail: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=1000",
    turfImages: [],
    turfTimings: [{ day: 'Monday', start: '06:00', end: '22:00' }]
  },
  {
    turfName: "Boundary Hitter",
    turfSportCategory: "Cricket",
    turfDescription: "Box cricket specialized for power hitting. High nets and protective screens included.",
    turfPrice: 750,
    turfDistrict: "Coimbatore",
    address: "Peelamedu, Coimbatore, TN",
    ownerContact: 8000099999,
    turfThumbnail: "https://images.unsplash.com/photo-1540747913346-19e3ad643121?auto=format&fit=crop&q=80&w=1000",
    turfImages: [],
    turfTimings: [{ day: 'Monday', start: '07:00', end: '24:00' }]
  },
  {
    turfName: "Downtown Ballers",
    turfSportCategory: "Basketball",
    turfDescription: "Indoor AC court with glass backboards and professional floor finish. The ultimate indoor experience.",
    turfPrice: 2500,
    turfDistrict: "Madurai",
    address: "Near Anna Arch, Madurai, TN",
    ownerContact: 7111100000,
    turfThumbnail: "https://images.unsplash.com/photo-1505666287802-9ca15689443d?auto=format&fit=crop&q=80&w=1000",
    turfImages: [],
    turfTimings: [{ day: 'Monday', start: '08:00', end: '22:00' }]
  },
  {
    turfName: "Clay Court Elite",
    turfSportCategory: "Tennis",
    turfDescription: "Synthetic hard courts for fast-paced action. Floodlit for night marathons.",
    turfPrice: 1800,
    turfDistrict: "Coimbatore",
    address: "Singanallur, Coimbatore, TN",
    ownerContact: 9888800001,
    turfThumbnail: "https://images.unsplash.com/photo-1595435066311-665a39626300?auto=format&fit=crop&q=80&w=1000",
    turfImages: [],
    turfTimings: [{ day: 'Monday', start: '06:00', end: '21:00' }]
  },
  {
    turfName: "Smash Zone",
    turfSportCategory: "Badminton",
    turfDescription: "Modern facility with 10 courts and dedicated training zones. Shower and locker facilities available.",
    turfPrice: 600,
    turfDistrict: "Chennai",
    address: "Mount Road, Chennai, TN",
    ownerContact: 9777700002,
    turfThumbnail: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=1000",
    turfImages: [],
    turfTimings: [{ day: 'Monday', start: '05:00', end: '24:00' }]
  }
];

const seedDB = async () => {
  await connectDB();
  await Turf.deleteMany({});
  await Turf.insertMany(turfs);
  console.log("✅ 15 Realistic Arenas Seeded Successfully!");
  process.exit();
};

seedDB();
