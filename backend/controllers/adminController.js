const User = require("../models/User");
const Course = require("../models/Course");
const Exam = require("../models/Exam");
const Progress = require("../models/Progress");

// Get all pending contributor requests
const getPendingContributors = async (req, res) => {
  const pendingUsers = await User.find({
    role: "contributor",
    status: "pending",
  })
    .select("-password")
    .sort({ createdAt: -1 });

  res.json(pendingUsers);
};

// Approve or Reject a user
const updateStatus = async (req, res) => {
  const { status } = req.body;
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
};

// Get platform stats for admin dashboard
const getAdminStats = async (req, res) => {
  const [
    totalUsers,
    totalLearners,
    totalContributors,
    pendingApprovals,
    totalCourses,
    activeCourses,
    totalExams,
    totalCompletedLessons,
    recentUsers,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "learner", status: "active" }),
    User.countDocuments({ role: "contributor", status: "active" }),
    User.countDocuments({ role: "contributor", status: "pending" }),
    Course.countDocuments(),
    Course.countDocuments({ isActive: true }),
    Exam.countDocuments(),
    Progress.countDocuments(),
    User.find().select("name email role status createdAt").sort({ createdAt: -1 }).limit(10),
  ]);

  res.json({
    users: {
      total: totalUsers,
      learners: totalLearners,
      contributors: totalContributors,
      pendingApprovals,
    },
    content: {
      totalCourses,
      activeCourses,
      totalExams,
      totalCompletedLessons,
    },
    recentUsers,
  });
};

module.exports = {
  getPendingContributors,
  updateStatus,
  getAdminStats,
};

