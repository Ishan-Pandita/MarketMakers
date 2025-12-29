const mongoose = require("mongoose");
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("DB error", error.message);
    process.exit(1); //stops node.js
  }
};

module.exports = connectDB;
//env is a file used to store secret values that should not be written directly in code like db passwords etc
