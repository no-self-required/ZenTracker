const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sessions: { type: Array }
  },
  { collection: "user-data" }
);
//current problem: Sessions must be an object? 
//sessions created, how sessions are read
const model = mongoose.model('UserData', User)

module.exports = model
