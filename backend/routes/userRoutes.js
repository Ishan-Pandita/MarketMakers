const express = require("express");
const User = require("../models/User");
const Module = require("../models/Module");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

// Get list of all contributors
router.get(
    "/contributors",
    asyncHandler(async (req, res) => {
        const contributors = await User.find({
            role: "contributor",
            status: "active",
        }).select("name email contributorDetails createdAt");

        res.json(contributors);
    })
);

// Get specific contributor profile
router.get(
    "/contributors/:id",
    asyncHandler(async (req, res) => {
        const user = await User.findById(req.params.id).select(
            "name email contributorDetails createdAt role"
        );

        if (!user) {
            res.status(404);
            throw new Error("Contributor not found");
        }

        // Get modules created by this contributor
        const modules = await Module.find({ contributor: user._id }).sort({
            createdAt: -1,
        });

        res.json({
            profile: user,
            modules,
        });
    })
);

module.exports = router;
