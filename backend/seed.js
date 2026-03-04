const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const User = require("./models/User");
const Temple = require("./models/Temple");
const DarshanSlot = require("./models/DarshanSlot");
const Booking = require("./models/Booking");
const Donation = require("./models/Donation");

const ADMIN_EMAIL = "admin@darshanease.com";
const ADMIN_PASSWORD = "Admin@123";
const ORGANIZER_EMAIL = "organizer@darshanease.com";
const ORGANIZER_PASSWORD = "Organizer@123";

async function seed() {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is required in .env");
  }

  await mongoose.connect(process.env.MONGO_URI);

  await Promise.all([
    User.deleteMany({}),
    Temple.deleteMany({}),
    DarshanSlot.deleteMany({}),
    Booking.deleteMany({}),
    Donation.deleteMany({}),
  ]);

  const [adminHash, organizerHash] = await Promise.all([
    bcrypt.hash(ADMIN_PASSWORD, 10),
    bcrypt.hash(ORGANIZER_PASSWORD, 10),
  ]);

  await User.insertMany([
    {
      name: "DarshanEase Admin",
      email: ADMIN_EMAIL,
      passwordHash: adminHash,
      role: "ADMIN",
    },
    {
      name: "DarshanEase Organizer",
      email: ORGANIZER_EMAIL,
      passwordHash: organizerHash,
      role: "ORGANIZER",
    },
  ]);

  const temples = await Temple.insertMany([
    {
      name: "Shree Siddhivinayak Temple",
      location: "Prabhadevi, Mumbai",
      description: "Famous Ganesh temple with high pilgrimage footfall.",
      imageUrl:
        "https://images.unsplash.com/photo-1576485290814-1c72aa4bbb8e?auto=format&fit=crop&w=1000&q=80",
    },
    {
      name: "Kashi Vishwanath Temple",
      location: "Varanasi, Uttar Pradesh",
      description: "One of the most sacred temples dedicated to Lord Shiva.",
      imageUrl:
        "https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1000&q=80",
    },
  ]);

  const today = new Date();
  const day1 = today.toISOString().split("T")[0];
  const day2 = new Date(today.getTime() + 86400000).toISOString().split("T")[0];

  const slotTemplates = [
    { date: day1, time: "07:00 AM", capacity: 50 },
    { date: day1, time: "10:00 AM", capacity: 40 },
    { date: day2, time: "06:30 AM", capacity: 60 },
  ];

  const slotsToCreate = [];
  for (const temple of temples) {
    for (const template of slotTemplates) {
      slotsToCreate.push({
        templeId: temple._id,
        ...template,
      });
    }
  }

  await DarshanSlot.insertMany(slotsToCreate);

  console.log("Seed complete");
  console.log(`ADMIN: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  console.log(`ORGANIZER: ${ORGANIZER_EMAIL} / ${ORGANIZER_PASSWORD}`);

  await mongoose.disconnect();
}

seed().catch(async (err) => {
  console.error("Seed failed:", err.message);
  await mongoose.disconnect();
  process.exit(1);
});
