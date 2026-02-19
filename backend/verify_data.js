const mongoose = require("mongoose");
require("dotenv").config();
const Course = require("./models/Course");
const Module = require("./models/Module");

const verify = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB");

        const courses = await Course.find();
        console.log(`\nCourses found: ${courses.length}`);
        courses.forEach(c => console.log(`- [${c._id}] ${c.title}`));

        if (courses.length > 0) {
            const courseId = courses[0]._id;
            const modules = await Module.find({ courseId });
            console.log(`\nModules for first course [${courseId}]: ${modules.length}`);
            modules.forEach(m => console.log(`  - [Order: ${m.order}] ${m.title}`));
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

verify();
