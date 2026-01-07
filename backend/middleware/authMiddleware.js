const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  let token = req.headers.authorization; //http  header when user logged in frontend sends token

  if (token && token.startsWith("Bearer")) {
    // this is to tell it is jwt login token
    try {
      token = token.split(" ")[1]; //will remove bearer and give token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next(); //user has got access you can go to next route
    } catch (error) {
      return res.status(401).json({ message: "Not authorized" });
    }
  } else {
    return res.status(401).json({ message: "No token" });
  }
};

module.exports = protect;
