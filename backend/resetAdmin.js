const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const User = require("./models/User");

dotenv.config();

const resetAdmin = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);

        // Delete all existing admins
        const deleteResult = await User.deleteMany({ role: "admin" });
        console.log(`Deleted ${deleteResult.deletedCount} existing admin(s).`);

        // Create new admin user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("Marketmakers.123", salt);

        const adminUser = new User({
            name: "Ishan Pandita",
            email: "ishanpandita@marketmakers.com",
            password: hashedPassword,
            role: "admin",
            status: "active",
            contributorDetails: {
                experience: "10+ Years",
                reason: "Platform Owner",
            },
        });

        await adminUser.save();

        console.log("New Admin user created successfully");
        console.log("Name: Ishan Pandita");
        console.log("Email: ishanpandita@marketmakers.com");
        console.log("Password: Marketmakers.123");

        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

resetAdmin();
