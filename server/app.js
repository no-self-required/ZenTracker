const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

app.use(cors());
app.use(express.json());

const usersRouter = require("./routes/users");

mongoose.connect("mongodb://localhost:27017/zentracker-db");

const PORT = process.env.PORT || 5000;

app.use("/api/users", usersRouter);

app.post("/api/register", async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.create({
      email: req.body.email,
      username: req.body.username,
      password: req.body.password,
    });
    res.json({ status: "ok" });
  } catch (err) {
    res.json({ status: "error", error: "Dupilicate email" });
  }
});

app.post("/api/login", async (req, res) => {
  const user = await User.findOne({
    username: req.body.username,
    password: req.body.password,
  });

  if (user) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      "secretcode123"
    );
    return res.json({ status: "ok", user: token, username: user});
  } else {
    return res.json({ status: "error", user: false });
  }
});


// app.listen(PORT, () => {
//   console.log(`Listening on Port: ${PORT}`);
// });

app.listen(process.env.PORT || 3000);

