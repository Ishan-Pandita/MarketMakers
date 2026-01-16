const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Exam title is required"],
            trim: true,
            unique: true,
            minlength: [5, "Title must be at least 5 characters"],
            maxlength: [100, "Title cannot exceed 100 characters"],
        },
        description: {
            type: String,
            required: [true, "Exam description is required"],
            trim: true,
        },
        questions: [
            {
                question: {
                    type: String,
                    required: true,
                },
                options: {
                    type: [String],
                    required: true,
                    validate: {
                        validator: function (options) {
                            return options.length >= 2 && options.length <= 6;
                        },
                        message: "Each question must have between 2 and 6 options",
                    },
                },
                correctAnswer: {
                    type: Number,
                    required: true,
                    min: 0,
                },
            },
        ],
        passingScore: {
            type: Number,
            required: [true, "Passing score is required"],
            min: [0, "Passing score must be at least 0"],
            max: [100, "Passing score cannot exceed 100"],
            default: 80,
        },
        duration: {
            type: Number, // in minutes
            required: [true, "Exam duration is required"],
            min: [10, "Duration must be at least 10 minutes"],
            max: [180, "Duration cannot exceed 180 minutes"],
            default: 60,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
