const checkContributor = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not Authenticated" });
  }
  if (req.user.role !== "contributor") {
    return res
      .status(403)
      .json({ message: "Only contributor can create content" });
  }
  next();
};

module.exports = checkContributor;
