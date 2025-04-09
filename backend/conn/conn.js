const mongoose = require("mongoose");
require("dotenv").config();

const conn = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB ");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

conn();
