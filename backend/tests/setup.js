// tests/setup.js - Test environment setup
const mongoose = require("mongoose");

// Clean up after all tests
afterAll(async () => {
    // Close the MongoDB connection
    await mongoose.connection.close();
});
