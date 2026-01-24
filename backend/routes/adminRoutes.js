const express = require("express");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Middleware to check if user is admin
const checkAdmin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403);
        throw new Error("Not authorized as an admin");
    }
};

// Get all pending contributor requests
router.get(
    "/pending-contributors",
    protect,
    checkAdmin,
    asyncHandler(async (req, res) => {
        const pendingUsers = await User.find({
            role: "contributor",
            status: "pending",
        })
            .select("-password")
            .sort({ createdAt: -1 });

        res.json(pendingUsers);
    })
);

// Approve or Reject a user
router.put(
    "/update-status/:id",
    protect,
    checkAdmin,
    asyncHandler(async (req, res) => {
        const { status } = req.body; // 'active' or 'rejected'
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error("User not found");
        }

        if (!["active", "rejected", "pending"].includes(status)) {
            res.status(400);
            throw new Error("Invalid status");
        }

        user.status = status;
        const updatedUser = await user.save();

        res.json({
            message: `User status updated to ${status}`,
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                role: updatedUser.role,
                status: updatedUser.status,
            },
        });
    })
);

module.exports = router;
