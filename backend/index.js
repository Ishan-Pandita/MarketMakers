require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  console.log("api hit");
  res.send("backed is running");
});

app.listen(5000, () => {
  console.log("server is running");
});
