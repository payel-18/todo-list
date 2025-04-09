const mongoose = require("mongoose");

const conn = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/todoDB");
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

conn();