/**
 * ⚠️  DEVELOPMENT ONLY — DO NOT RUN IN PRODUCTION
 * Seeds a single admin user into the database.
 *
 * Usage: npm run seed:admin
 */

const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("../models/User");

dotenv.config();

const seedAdmin = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Check if admin exists
        const adminExists = await User.findOne({ email: "admin@marketmakers.com" });

        if (adminExists) {
            console.log("Admin user already exists");
            process.exit();
        }

        // Create admin user (pre-save hook handles password hashing)
        const adminUser = new User({
            name: "Ishan Pandita",
            email: "admin@marketmakers.com",
            password: "admin123",
            role: "admin",
            status: "active",
        });

        await adminUser.save();

        console.log("Admin user created successfully");
        console.log("Email: admin@marketmakers.com");
        console.log("Password: admin123");

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedAdmin();
