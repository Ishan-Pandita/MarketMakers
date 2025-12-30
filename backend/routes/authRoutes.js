const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;

  //chek if user exis
  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "user alread exists" });
  }

  //hash the passord
  const hashPassword = await bcrypt.hash(password, 10);

  //save the user with hash in db

  const user = new User({
    name,
    email,
    password: hashPassword,
    role,
  });
  await user.save();
  res.json({ message: "User registered successfully" });
});

//login

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  //match password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  //generate jwt token
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  //res to frontend
  res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
});

module.exports = router;
