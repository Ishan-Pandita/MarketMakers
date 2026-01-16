const mongoose = require("mongoose");

const examAttemptSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        examId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Exam",
            required: [true, "Exam ID is required"],
        },
        answers: [
            {
                questionIndex: {
                    type: Number,
                    required: true,
                },
                selectedAnswer: {
                    type: Number,
                    required: true,
                },
            },
        ],
        score: {
            type: Number,
            required: true,
            min: 0,
            max: 100,
        },
        passed: {
            type: Boolean,
            required: true,
        },
        completedAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

// Index to track user attempts
examAttemptSchema.index({ userId: 1, examId: 1 });

module.exports = mongoose.model("ExamAttempt", examAttemptSchema);
