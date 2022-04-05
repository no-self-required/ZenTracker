const mongoose = require("mongoose");

const User = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    sessions: { type: Object }
  },
  { collection: "user-data" }
);

const model = mongoose.model('UserData', User)

module.exports = model

// {
//   _id: ObjectId("6222650a612f92459cc2da9b"), 
//   username: 'admin',
//   email: 'admin@admin.com',
//   password: 'admin',
//   sessions: {
//               1: {
//                   date: new Date(),
//                   length: 600,
//                   log: 'good session'
//                  },
//               2: {
//                   date: new Date(),
//                   length: 2400,
//                   log: 'turbulent session'
//                  }  
//             } 
// }

//length unit: seconds? then convert