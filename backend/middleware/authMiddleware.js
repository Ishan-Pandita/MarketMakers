const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * Authentication middleware -- verifies JWT Bearer token and confirms the
 * user still exists in the database. This prevents deleted or banned users
 * from accessing the API with a previously issued token.
 *
 * Sets req.user = { id, role } from the verified database record.
 */
const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Verify the user still exists in the database
      const user = await User.findById(decoded.id).select("_id role").lean();
      if (!user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      req.user = { id: user._id.toString(), role: user.role };
      next();
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ message: "No token provided" });
  }
};

module.exports = protect;
