const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const Course = require("../models/Course");
const Module = require("../models/Module");
const Lesson = require("../models/Lesson");
const Exam = require("../models/Exam");
const ExamAttempt = require("../models/ExamAttempt");

const MONGO_URI = process.env.MONGO_URI;

async function run() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to DB...");

        // Find all courses starting with "Test Course"
        const testCourses = await Course.find({ title: { $regex: /^Test Course/i } });
        console.log(`Found ${testCourses.length} test courses to delete.`);

        for (const course of testCourses) {
            console.log(`Cleaning up data for course: ${course.title} (${course._id})`);
            
            // Find all modules in this course
            const modules = await Module.find({ course: course._id });
            for (const mod of modules) {
                // Delete lessons
                await Lesson.deleteMany({ module: mod._id });
                // Delete exams
                const exams = await Exam.find({ module: mod._id });
                for (const exam of exams) {
                    await ExamAttempt.deleteMany({ exam: exam._id });
                }
                await Exam.deleteMany({ module: mod._id });
            }
            
            // Delete modules
            await Module.deleteMany({ course: course._id });

            // Delete course
            await Course.findByIdAndDelete(course._id);
            console.log(`Successfully removed: ${course.title}`);
        }

        console.log("Cleanup finished.");
    } catch (err) {
        console.error("Error during cleanup:", err);
    } finally {
        await mongoose.disconnect();
    }
}

run();
