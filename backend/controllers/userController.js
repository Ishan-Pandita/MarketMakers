const User = require("../models/User");
const Module = require("../models/Module");
const Course = require("../models/Course");

// Get list of all contributors
const getContributors = async (req, res) => {
  const contributors = await User.find({
    role: "contributor",
    status: "active",
  }).select("name email contributorDetails createdAt");

  res.json(contributors);
};

// Get specific contributor profile
const getContributorProfile = async (req, res) => {
  const user = await User.findById(req.params.id).select(
    "name email contributorDetails createdAt role"
  );

  if (!user) {
    res.status(404);
    throw new Error("Contributor not found");
  }

  const courses = await Course.find({ instructor: user._id }).sort({
    order: 1,
  });

  const modules = await Module.find({ contributor: user._id }).sort({
    createdAt: -1,
  });

  res.json({
    profile: user,
    courses,
    modules,
  });
};

module.exports = {
  getContributors,
  getContributorProfile,
};
