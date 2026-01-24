const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

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

        // Create admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        const adminUser = new User({
            name: "Ishan Pandita",
            email: "admin@marketmakers.com",
            password: hashedPassword,
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
