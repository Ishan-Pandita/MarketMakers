const checkContributor = (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }
  if (req.user.role !== "contributor" && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Only contributors can create content");
  }
  next();
};

module.exports = checkContributor;
